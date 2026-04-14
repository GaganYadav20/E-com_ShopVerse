package com.ecomm.service;

import com.ecomm.dto.*;
import com.ecomm.entity.*;
import com.ecomm.exception.BadRequestException;
import com.ecomm.exception.ResourceNotFoundException;
import com.ecomm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

/**
 * Cart operations: view, add, update quantity, remove items.
 */
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /** Get the current user's cart */
    public CartDTO getCart(String email) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);
        return toDTO(cart);
    }

    /** Add a product to the cart (or increase quantity if already present) */
    @Transactional
    public CartDTO addToCart(String email, AddToCartRequest request) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + product.getStock());
        }

        // Check if item already exists in cart
        var existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQty = item.getQuantity() + request.getQuantity();
            if (newQty > product.getStock()) {
                throw new BadRequestException("Cannot add more. Stock available: " + product.getStock());
            }
            item.setQuantity(newQty);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return toDTO(cartRepository.findById(cart.getId()).orElse(cart));
    }

    /** Update quantity of a cart item */
    @Transactional
    public CartDTO updateCartItem(String email, Long itemId, int quantity) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to your cart");
        }

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            if (quantity > item.getProduct().getStock()) {
                throw new BadRequestException("Insufficient stock. Available: " + item.getProduct().getStock());
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return toDTO(cartRepository.findById(cart.getId()).orElse(cart));
    }

    /** Remove an item from the cart */
    @Transactional
    public CartDTO removeFromCart(String email, Long itemId) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to your cart");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return toDTO(cartRepository.findById(cart.getId()).orElse(cart));
    }

    /** Clear the entire cart */
    @Transactional
    public void clearCart(String email) {
        User user = getUserByEmail(email);
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    // --- Helpers ---

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart cart = Cart.builder().user(user).build();
                    return cartRepository.save(cart);
                });
    }

    private CartDTO toDTO(Cart cart) {
        var items = cart.getItems().stream().map(item -> CartItemDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productImage(item.getProduct().getImageUrl())
                .productPrice(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .build()
        ).collect(Collectors.toList());

        return CartDTO.builder()
                .id(cart.getId())
                .items(items)
                .totalPrice(cart.getTotalPrice())
                .build();
    }
}
