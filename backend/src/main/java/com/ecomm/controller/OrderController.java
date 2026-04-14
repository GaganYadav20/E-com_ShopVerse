package com.ecomm.controller;

import com.ecomm.dto.*;
import com.ecomm.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /** POST /api/orders — place an order from the cart */
    @PostMapping
    public ResponseEntity<OrderDTO> placeOrder(Authentication authentication,
                                                @Valid @RequestBody PlaceOrderRequest request) {
        return new ResponseEntity<>(
                orderService.placeOrder(authentication.getName(), request), HttpStatus.CREATED);
    }

    /** GET /api/orders — get all orders for current user */
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getUserOrders(authentication.getName()));
    }

    /** GET /api/orders/{id} — get specific order */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(Authentication authentication,
                                                  @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(authentication.getName(), id));
    }
}
