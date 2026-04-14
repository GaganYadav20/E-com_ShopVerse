package com.ecomm.controller;

import com.ecomm.dto.*;
import com.ecomm.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /** GET /api/cart — view current user's cart */
    @GetMapping
    public ResponseEntity<CartDTO> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCart(authentication.getName()));
    }

    /** POST /api/cart/add — add item to cart */
    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(Authentication authentication,
                                             @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(authentication.getName(), request));
    }

    /** PUT /api/cart/update/{itemId}?quantity= — update item quantity */
    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartDTO> updateCartItem(Authentication authentication,
                                                   @PathVariable Long itemId,
                                                   @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateCartItem(authentication.getName(), itemId, quantity));
    }

    /** DELETE /api/cart/remove/{itemId} — remove item from cart */
    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<CartDTO> removeFromCart(Authentication authentication,
                                                   @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeFromCart(authentication.getName(), itemId));
    }

    /** DELETE /api/cart/clear — clear entire cart */
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
