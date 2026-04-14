package com.ecomm.controller;

import com.ecomm.dto.ProductDTO;
import com.ecomm.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    /** GET /api/wishlist — view wishlist */
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getWishlist(Authentication authentication) {
        return ResponseEntity.ok(wishlistService.getWishlist(authentication.getName()));
    }

    /** POST /api/wishlist/{productId} — add to wishlist */
    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, String>> addToWishlist(Authentication authentication,
                                                              @PathVariable Long productId) {
        wishlistService.addToWishlist(authentication.getName(), productId);
        return new ResponseEntity<>(Map.of("message", "Added to wishlist"), HttpStatus.CREATED);
    }

    /** DELETE /api/wishlist/{productId} — remove from wishlist */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(Authentication authentication,
                                                    @PathVariable Long productId) {
        wishlistService.removeFromWishlist(authentication.getName(), productId);
        return ResponseEntity.noContent().build();
    }

    /** GET /api/wishlist/check/{productId} — check if in wishlist */
    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(Authentication authentication,
                                                               @PathVariable Long productId) {
        boolean inWishlist = wishlistService.isInWishlist(authentication.getName(), productId);
        return ResponseEntity.ok(Map.of("inWishlist", inWishlist));
    }
}
