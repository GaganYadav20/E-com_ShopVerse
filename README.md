# 🛒 ShopVerse — Full-Stack E-Commerce Platform

A production-ready, placement-level full-stack e-commerce application built with **React** (frontend) and **Spring Boot** (backend), featuring JWT authentication, role-based authorization, product management, cart system, order tracking, wishlist, and an admin dashboard.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TailwindCSS 3, React Router v6, Axios, Context API |
| **Backend** | Spring Boot 3.2, Spring Security 6, Spring Data JPA (Hibernate) |
| **Auth** | JWT (jjwt), BCrypt password hashing |
| **Database** | MySQL 8 |
| **Deployment** | Docker, Docker Compose, Nginx |

---

## 📁 Project Structure

```
e-comm/
├── backend/                          # Spring Boot REST API
│   ├── src/main/java/com/ecomm/
│   │   ├── config/                   # CORS, Data Seeder
│   │   ├── controller/               # REST controllers
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── entity/                   # JPA entities + enums
│   │   ├── exception/                # Global error handling
│   │   ├── repository/               # Spring Data repositories
│   │   ├── security/                 # JWT + Spring Security
│   │   └── service/                  # Business logic
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/                         # React SPA
│   └── src/
│       ├── components/               # Reusable UI components
│       ├── context/                  # AuthContext, CartContext
│       ├── pages/                    # Page components
│       │   └── admin/                # Admin pages
│       └── services/                 # Axios API client
│
├── database/
│   └── schema.sql                    # MySQL DDL
├── docker-compose.yml
└── README.md
```

---

## ✨ Features

### User Features
- ✅ JWT-based Register & Login
- ✅ Browse products with search, filter & sort
- ✅ Product detail with image, stock status
- ✅ Add to cart, update quantity, remove items
- ✅ Checkout with shipping address
- ✅ Order history with status tracking (Pending → Shipped → Delivered)
- ✅ Wishlist (add/remove products)
- ✅ Responsive dark-themed UI with glassmorphism

### Admin Features
- ✅ Dashboard with revenue, orders, users, products stats
- ✅ CRUD product management (create, edit, delete)
- ✅ View all orders with customer details
- ✅ Update order status (Pending/Shipped/Delivered/Cancelled)

### Technical Features
- ✅ Layered architecture (Controller → Service → Repository)
- ✅ DTO pattern with manual mapping
- ✅ Global exception handling with consistent error responses
- ✅ Spring Security with role-based access (USER, ADMIN)
- ✅ Pagination & sorting for product listing
- ✅ Input validation with Jakarta annotations
- ✅ Lazy-loaded React routes (code splitting)
- ✅ Axios interceptors for token management
- ✅ Protected & admin-only routes

---

## 🛠️ Setup Instructions

### Prerequisites

- **Java 17+** (JDK)
- **Maven 3.8+**
- **Node.js 18+** and npm
- **MySQL 8** (running on port 3306)

---

### 1️⃣ Database Setup

```bash
# Option A: Let Hibernate auto-create tables (default, no action needed)
# Just ensure MySQL is running and a root user exists with password 'root'

# Option B: Manually create schema
mysql -u root -p < database/schema.sql
```

> The app uses `spring.jpa.hibernate.ddl-auto=update`, so tables are auto-created on first run. A `DataSeeder` also auto-creates an admin user and 12 sample products.

---

### 2️⃣ Backend Setup (Spring Boot)

```bash
cd backend

# Update database credentials in src/main/resources/application.properties if needed:
# spring.datasource.username=root
# spring.datasource.password=root

# Build and run
mvn clean install -DskipTests
mvn spring-boot:run
```

Backend will start at **http://localhost:8080**

---

### 3️⃣ Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will start at **http://localhost:5173**

> The Vite dev server proxies `/api` requests to `http://localhost:8080` automatically.

---

### 4️⃣ Docker Setup (Optional)

```bash
# From the project root
docker-compose up --build
```

This starts MySQL, backend (port 8080), and frontend (port 80).

---

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@ecommerce.com | admin123 |
| **User** | Register a new account | — |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|---------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login (returns JWT) |

### Products
| Method | Endpoint | Access | Description |
|--------|---------|--------|-------------|
| GET | `/api/products?page=0&size=12&sortBy=price&direction=asc` | Public | List products (paginated) |
| GET | `/api/products/{id}` | Public | Product details |
| GET | `/api/products/search?keyword=headphones` | Public | Search products |
| GET | `/api/products/filter?category=Electronics&keyword=wireless` | Public | Filter products |
| GET | `/api/products/categories` | Public | All category names |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/{id}` | Admin | Update product |
| DELETE | `/api/products/{id}` | Admin | Delete product |

### Cart
| Method | Endpoint | Access | Description |
|--------|---------|--------|-------------|
| GET | `/api/cart` | User | View cart |
| POST | `/api/cart/add` | User | Add item `{ productId, quantity }` |
| PUT | `/api/cart/update/{itemId}?quantity=3` | User | Update quantity |
| DELETE | `/api/cart/remove/{itemId}` | User | Remove item |
| DELETE | `/api/cart/clear` | User | Clear cart |

### Orders
| Method | Endpoint | Access | Description |
|--------|---------|--------|-------------|
| POST | `/api/orders` | User | Place order `{ shippingAddress }` |
| GET | `/api/orders` | User | My orders |
| GET | `/api/orders/{id}` | User | Order details |

### Wishlist
| Method | Endpoint | Access | Description |
|--------|---------|--------|-------------|
| GET | `/api/wishlist` | User | View wishlist |
| POST | `/api/wishlist/{productId}` | User | Add to wishlist |
| DELETE | `/api/wishlist/{productId}` | User | Remove from wishlist |
| GET | `/api/wishlist/check/{productId}` | User | Check if in wishlist |

### Admin
| Method | Endpoint | Access | Description |
|--------|---------|--------|-------------|
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| GET | `/api/admin/orders?page=0&size=20` | Admin | All orders |
| PUT | `/api/admin/orders/{id}/status` | Admin | Update status `{ status: "SHIPPED" }` |

---

## 📬 Postman Testing

### Step 1: Register
```
POST http://localhost:8080/api/auth/register
Body (JSON): { "name": "John", "email": "john@test.com", "password": "password123" }
```

### Step 2: Login
```
POST http://localhost:8080/api/auth/login
Body (JSON): { "email": "john@test.com", "password": "password123" }
→ Copy the "token" from response
```

### Step 3: Use Token
```
For all authenticated requests, add header:
Authorization: Bearer <your-jwt-token>
```

### Step 4: Add to Cart
```
POST http://localhost:8080/api/cart/add
Header: Authorization: Bearer <token>
Body (JSON): { "productId": 1, "quantity": 2 }
```

### Step 5: Place Order
```
POST http://localhost:8080/api/orders
Header: Authorization: Bearer <token>
Body (JSON): { "shippingAddress": "123 Main St, San Francisco, CA 94105" }
```

---

## 🏗️ Architecture Overview

```
┌─────────────┐     HTTP/JSON     ┌──────────────────────────────────┐
│   React UI  │ ◄───────────────► │      Spring Boot REST API        │
│  (Vite SPA) │   JWT Bearer      │                                  │
└─────────────┘                   │  Controller → Service → Repo     │
                                  │         ↕                        │
                                  │    Spring Security (JWT)         │
                                  │         ↕                        │
                                  │   MySQL (JPA/Hibernate)          │
                                  └──────────────────────────────────┘
```

### Key Design Patterns
- **Layered Architecture**: Controller → Service → Repository (separation of concerns)
- **DTO Pattern**: Entities never exposed directly to API consumers
- **Repository Pattern**: Spring Data JPA abstracts database operations
- **Context API**: Centralized state for auth and cart in React
- **Interceptor Pattern**: Axios request/response interceptors for JWT

---

## 🎓 Interview Preparation

### Key Concepts to Explain

**1. JWT Authentication Flow**
1. User sends email/password to `/api/auth/login`
2. Server validates credentials, generates JWT with user email as subject
3. Client stores token in localStorage and sends it as `Authorization: Bearer <token>` header
4. `JwtAuthenticationFilter` intercepts requests, validates token, and sets `SecurityContext`
5. Spring Security checks role-based access for each endpoint

**2. Spring Security Configuration**
- Stateless session management (no server-side sessions)
- BCrypt password encoder for secure password storage
- Role-based authorization with `hasRole("ADMIN")`
- Custom `UserDetailsService` loading users from database

**3. Database Relationships**
- `User` ↔ `Cart`: OneToOne (each user has one cart)
- `Cart` ↔ `CartItem`: OneToMany (cart has many items)
- `CartItem` ↔ `Product`: ManyToOne (item references a product)
- `User` ↔ `Order`: OneToMany (user can have many orders)
- `Order` ↔ `OrderItem`: OneToMany (order has many items)
- `OrderItem` stores price snapshot (price at time of order)

**4. REST API Design**
- Proper HTTP methods (GET for read, POST for create, PUT for update, DELETE for remove)
- Pagination for list endpoints (`Page<T>` from Spring Data)
- Search and filter with query parameters
- Consistent error response format via `@ControllerAdvice`

**5. React Architecture**
- Functional components with hooks (`useState`, `useEffect`, `useContext`)
- Context API for global state (auth, cart)
- Protected routes using route guards
- Lazy loading with `React.lazy()` and `Suspense`
- Axios interceptors for automatic token attachment and 401 handling

### Common Interview Questions

**Q: How does JWT authentication work in your project?**
A: User logs in → server validates credentials and generates a signed JWT containing the user's email and expiry → client stores it in localStorage → on every request, an Axios interceptor attaches the token as a Bearer header → server-side `JwtAuthenticationFilter` validates the token and sets the security context.

**Q: How do you handle authorization (role-based access)?**
A: Spring Security's `SecurityFilterChain` defines URL-level access rules. Admin-only endpoints require `hasRole("ADMIN")`. The user's role is stored in the database and included in the `UserDetails` object loaded by `CustomUserDetailsService`.

**Q: How does the cart-to-order flow work?**
A: When a user places an order, the `OrderService` validates stock for all cart items → creates an `Order` with `OrderItem`s (snapshotting current prices) → decrements product stock → clears the cart. This happens in a single `@Transactional` method.

**Q: How do you handle errors globally?**
A: A `@RestControllerAdvice` class (`GlobalExceptionHandler`) catches exceptions like `ResourceNotFoundException`, `BadRequestException`, validation errors, and returns a consistent `ApiError` JSON response with timestamp, status, message, and details.

**Q: Why use DTOs instead of returning entities directly?**
A: To avoid exposing internal database structure, prevent circular references in JSON serialization (e.g., User ↔ Cart), control which fields are included in responses, and decouple the API contract from the persistence layer.

---

## 📜 License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).

---

Built with ❤️ using React & Spring Boot
