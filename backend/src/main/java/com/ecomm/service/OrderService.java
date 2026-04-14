package com.ecomm.service;

import com.ecomm.dto.*;
import com.ecomm.entity.*;
import com.ecomm.entity.enums.OrderStatus;
import com.ecomm.exception.BadRequestException;
import com.ecomm.exception.ResourceNotFoundException;
import com.ecomm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Order operations: place order from cart, view orders, update status.
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /**
     * Place an order from the user's cart.
     * Validates stock, decrements it, creates order items, and clears the cart.
     */
    @Transactional
    public OrderDTO placeOrder(String email, PlaceOrderRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty. Add items before placing an order.");
        }

        // Validate stock for all items
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException(
                        "Insufficient stock for '" + product.getName() + "'. Available: " + product.getStock());
            }
        }

        // Create order
        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .status(OrderStatus.PENDING)
                .orderDate(LocalDateTime.now())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice()) // Snapshot price at order time
                    .build();
            order.getItems().add(orderItem);

            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));

            // Decrement stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // Clear cart after successful order
        cart.getItems().clear();
        cartRepository.save(cart);

        return toDTO(savedOrder);
    }

    /** Get all orders for a specific user */
    public List<OrderDTO> getUserOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    /** Get a specific order by ID (user must own it) */
    public OrderDTO getOrderById(String email, Long orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("This order does not belong to you");
        }

        return toDTO(order);
    }

    /** Get all orders (admin) with pagination */
    public Page<OrderDTO> getAllOrders(int page, int size) {
        return orderRepository.findAllByOrderByOrderDateDesc(PageRequest.of(page, size))
                .map(this::toDTO);
    }

    /** Update order status (admin only) */
    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        try {
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status +
                    ". Valid values: PENDING, SHIPPED, DELIVERED, CANCELLED");
        }

        return toDTO(orderRepository.save(order));
    }

    /** Get dashboard statistics (admin) */
    public DashboardStats getDashboardStats() {
        return DashboardStats.builder()
                .totalUsers(userRepository.count())
                .totalProducts(productRepository.count())
                .totalOrders(orderRepository.countAllOrders())
                .totalRevenue(orderRepository.getTotalRevenue())
                .build();
    }

    // --- DTO Mapper ---

    private OrderDTO toDTO(Order order) {
        List<OrderItemDTO> items = order.getItems().stream().map(item ->
                OrderItemDTO.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productImage(item.getProduct().getImageUrl())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build()
        ).collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .shippingAddress(order.getShippingAddress())
                .orderDate(order.getOrderDate())
                .items(items)
                .userName(order.getUser().getName())
                .userEmail(order.getUser().getEmail())
                .build();
    }
}
