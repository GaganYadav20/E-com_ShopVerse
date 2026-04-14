package com.ecomm.service;

import com.ecomm.dto.ProductDTO;
import com.ecomm.entity.*;
import com.ecomm.exception.BadRequestException;
import com.ecomm.exception.ResourceNotFoundException;
import com.ecomm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Wishlist operations: add, remove, view.
 */
@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    /** Get all wishlist items for a user */
    public List<ProductDTO> getWishlist(String email) {
        User user = getUserByEmail(email);
        return wishlistRepository.findByUserId(user.getId()).stream()
                .map(w -> toProductDTO(w.getProduct()))
                .collect(Collectors.toList());
    }

    /** Add a product to the wishlist */
    @Transactional
    public void addToWishlist(String email, Long productId) {
        User user = getUserByEmail(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new BadRequestException("Product already in wishlist");
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .product(product)
                .build();
        wishlistRepository.save(wishlist);
    }

    /** Remove a product from the wishlist */
    @Transactional
    public void removeFromWishlist(String email, Long productId) {
        User user = getUserByEmail(email);
        Wishlist wishlist = wishlistRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not in wishlist"));
        wishlistRepository.delete(wishlist);
    }

    /** Check if a product is in wishlist */
    public boolean isInWishlist(String email, Long productId) {
        User user = getUserByEmail(email);
        return wishlistRepository.existsByUserIdAndProductId(user.getId(), productId);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ProductDTO toProductDTO(Product p) {
        return ProductDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .category(p.getCategory())
                .imageUrl(p.getImageUrl())
                .stock(p.getStock())
                .build();
    }
}
