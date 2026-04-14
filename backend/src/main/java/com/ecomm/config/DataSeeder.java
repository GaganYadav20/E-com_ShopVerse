package com.ecomm.config;

import com.ecomm.entity.Product;
import com.ecomm.entity.User;
import com.ecomm.entity.Cart;
import com.ecomm.entity.enums.Role;
import com.ecomm.repository.CartRepository;
import com.ecomm.repository.ProductRepository;
import com.ecomm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Seeds the database with an admin user and sample products on first run.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create admin user if not exists
        if (!userRepository.existsByEmail("admin@ecommerce.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@ecommerce.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);

            Cart adminCart = Cart.builder().user(admin).build();
            cartRepository.save(adminCart);
        }

        // Seed products if none exist
        if (productRepository.count() == 0) {
            List<Product> products = List.of(
                    Product.builder()
                            .name("Wireless Noise Cancelling Headphones")
                            .description(
                                    "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and Hi-Res audio support. Perfect for music lovers and professionals.")
                            .price(new BigDecimal("299.99"))
                            .category("Electronics")
                            .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500")
                            .stock(50)
                            .build(),
                    Product.builder()
                            .name("Smart Watch Pro")
                            .description(
                                    "Advanced fitness tracking smartwatch with GPS, heart rate monitor, sleep tracking, and 7-day battery life. Water resistant up to 50m.")
                            .price(new BigDecimal("399.99"))
                            .category("Electronics")
                            .imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500")
                            .stock(30)
                            .build(),
                    Product.builder()
                            .name("Premium Leather Backpack")
                            .description(
                                    "Handcrafted genuine leather backpack with padded laptop compartment. Fits up to 15-inch laptops. Multiple organizational pockets.")
                            .price(new BigDecimal("149.99"))
                            .category("Fashion")
                            .imageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500")
                            .stock(40)
                            .build(),
                    Product.builder()
                            .name("Running Shoes Ultra Boost")
                            .description(
                                    "Lightweight performance running shoes with responsive cushioning, breathable mesh upper, and continental rubber outsole for superior grip.")
                            .price(new BigDecimal("179.99"))
                            .category("Fashion")
                            .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500")
                            .stock(60)
                            .build(),
                    Product.builder()
                            .name("Organic Green Tea Collection")
                            .description(
                                    "Premium organic green tea collection featuring 6 unique blends from Japan and China. Each box contains 60 individually wrapped tea bags.")
                            .price(new BigDecimal("34.99"))
                            .category("Food & Beverages")
                            .imageUrl("https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500")
                            .stock(100)
                            .build(),
                    Product.builder()
                            .name("4K Webcam with Microphone")
                            .description(
                                    "Ultra HD 4K webcam with built-in noise-cancelling microphone, auto-focus, and adjustable ring light. Perfect for streaming and video calls.")
                            .price(new BigDecimal("129.99"))
                            .category("Electronics")
                            .imageUrl("https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500")
                            .stock(45)
                            .build(),
                    Product.builder()
                            .name("Minimalist Desk Lamp")
                            .description(
                                    "Modern LED desk lamp with wireless charging base, adjustable color temperature, and touch controls. Sleek aluminum design.")
                            .price(new BigDecimal("89.99"))
                            .category("Home & Living")
                            .imageUrl(
                                    "https://images.unsplash.com/photo-1601642964568-1917224f4e4d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                            .stock(35)
                            .build(),
                    Product.builder()
                            .name("Stainless Steel Water Bottle")
                            .description(
                                    "Double-walled vacuum insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, 750ml capacity.")
                            .price(new BigDecimal("29.99"))
                            .category("Sports & Outdoors")
                            .imageUrl("https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500")
                            .stock(80)
                            .build(),
                    Product.builder()
                            .name("Yoga Mat Premium")
                            .description(
                                    "Extra thick 6mm eco-friendly yoga mat with alignment lines, non-slip surface, and carrying strap. Perfect for yoga, Pilates, and floor exercises.")
                            .price(new BigDecimal("49.99"))
                            .category("Sports & Outdoors")
                            .imageUrl("https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500")
                            .stock(55)
                            .build(),
                    Product.builder()
                            .name("Wireless Mechanical Keyboard")
                            .description(
                                    "Compact 75% wireless mechanical keyboard with hot-swappable switches, RGB backlighting, and multi-device Bluetooth connectivity.")
                            .price(new BigDecimal("159.99"))
                            .category("Electronics")
                            .imageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500")
                            .stock(25)
                            .build(),
                    Product.builder()
                            .name("Scented Candle Set")
                            .description(
                                    "Luxury hand-poured soy wax candle set with 3 signature scents: Lavender Dreams, Ocean Breeze, and Vanilla Bean. 40-hour burn time each.")
                            .price(new BigDecimal("44.99"))
                            .category("Home & Living")
                            .imageUrl(
                                    "https://images.unsplash.com/photo-1707839568938-f9b50bb88454?q=80&w=738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                            .stock(70)
                            .build(),
                    Product.builder()
                            .name("Bestseller Novel Collection")
                            .description(
                                    "Curated collection of 5 award-winning novels from contemporary authors. Hardcover editions with exclusive cover art.")
                            .price(new BigDecimal("69.99"))
                            .category("Books")
                            .imageUrl("https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500")
                            .stock(90)
                            .build());
            productRepository.saveAll(products);
        }
    }
}
