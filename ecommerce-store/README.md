# 🛍️ ShopZone — Full-Stack E-Commerce Store

A complete e-commerce application with React frontend, Node.js/Express backend, MongoDB database, JWT authentication, role-based access control, shopping cart, and order management.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router v6, Axios |
| Backend | Node.js, Express 4, Mongoose |
| Database | MongoDB |
| Auth | JWT + bcryptjs |
| Styling | Pure CSS (no framework) |

## Features

### User Features
- ✅ User registration & login with JWT authentication
- 🛒 Shopping cart with add/remove/update quantity
- 🔍 Product search, filtering by category, sorting
- 📦 Product catalog with images, ratings, stock status
- 💳 Checkout with shipping address and payment method
- 📋 Order history and order tracking
- 👤 User profile management

### Admin Features (Role-Based Access)
- 📊 Admin dashboard with sales statistics
- 📦 Product management (CRUD operations)
- 📋 Order management with status updates
- 👥 User management with role assignment
- 📈 Low stock alerts
- 📊 Revenue and order analytics

## Project Structure

```
ecommerce-store/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Product.js         # Product schema
│   │   └── Order.js           # Order schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── products.js        # Product CRUD routes
│   │   ├── orders.js          # Order management routes
│   │   └── users.js           # User management routes
│   ├── middleware/
│   │   └── auth.js            # JWT & role-based auth
│   ├── server.js              # Express server
│   ├── seed.js                # Database seeding script
│   └── .env                   # Environment variables
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js       # Axios instance
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProductCard.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProductPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminProducts.jsx
    │   │       ├── AdminOrders.jsx
    │   │       └── AdminUsers.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)

### 1. Install MongoDB

**Windows:**
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Default connection: `mongodb://127.0.0.1:27017`

**Or use MongoDB Atlas (cloud):**
- Create free account at https://www.mongodb.com/cloud/atlas
- Create cluster and get connection string
- Update `MONGODB_URI` in `backend/.env`

### 2. Install Dependencies

```bash
# Backend
cd ecommerce-store/backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- **Admin user:** admin@store.com / admin123
- **Regular user:** user@store.com / user123
- **12 sample products** across various categories
- **1 sample order**

### 4. Start the Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### 5. Open the App

Navigate to **http://localhost:5173**

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@store.com | admin123 |
| User | user@store.com | user123 |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |

### Products (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List products (with filters) |
| GET | /api/products/:id | Get single product |
| GET | /api/products/categories | Get all categories |

### Products (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |

### Orders (User)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Create order |
| GET | /api/orders/my | Get user's orders |
| GET | /api/orders/my/:id | Get single order |

### Orders (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/orders | Get all orders |
| GET | /api/orders/:id | Get single order |
| PUT | /api/orders/:id/status | Update order status |
| GET | /api/orders/admin/stats | Get dashboard stats |

### Users (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List all users |
| PUT | /api/users/:id/role | Change user role |
| DELETE | /api/users/:id | Delete user |

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Features in Detail

### Shopping Cart
- Persistent cart (localStorage)
- Real-time price calculations
- Stock validation
- Free shipping over $50
- 8% tax calculation

### Order Management
- Auto-generated order numbers
- Multiple payment methods (Card, PayPal, COD)
- Order status tracking (pending → confirmed → processing → shipped → delivered)
- Stock deduction on order placement
- Stock restoration on cancellation

### Admin Dashboard
- Total revenue and order count
- Orders by status breakdown
- Low stock alerts
- Recent orders list
- Product, order, and user management

## License

MIT

## Author

Built with ❤️ using React, Node.js, Express, and MongoDB
