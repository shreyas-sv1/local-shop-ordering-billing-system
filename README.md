# Grocery Shop Ordering System

A complete full-stack application for ordering groceries. Features a React frontend, Node.js/Express backend, and MySQL database.

## 📊 Project Phases

### ✅ Phase 1: Frontend Only (Complete)
- React-based UI
- Shopping cart system
- Client-side order management
- Responsive design

### ✅ Phase 2: Backend Integration (Complete)
- Node.js/Express server
- MySQL database integration
- RESTful APIs
- Permanent order storage

### 🔜 Phase 3: Advanced Features (Coming)
- User authentication & authorization
- Admin dashboard
- Payment gateway integration
- Order history & tracking

## ✨ Current Features (Phase 1 + Phase 2)

### Frontend
✅ **Product Listing** - Browse grocery items from database  
✅ **Shopping Cart** - Add/remove items, adjust quantities  
✅ **Dynamic Pricing** - Real-time total calculation  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Backend Integration** - Fetches products from API  

### Backend
✅ **REST API** - Complete CRUD endpoints for products & orders  
✅ **MySQL Database** - Permanent data storage  
✅ **Transaction Support** - Ensures data consistency  
✅ **Error Handling** - Comprehensive error responses  
✅ **CORS Enabled** - Frontend-backend communication  

## Project Structure

```
shop/
├── src/                                 (React Frontend)
│   ├── components/
│   │   ├── Navbar.js                  # Navigation header with cart count
│   │   ├── ProductCard.js             # Individual product card
│   │   └── Cart.js                    # Cart sidebar component
│   │
│   ├── pages/
│   │   ├── Home.js                    # Main shopping page (API integrated)
│   │   └── Checkout.js                # Checkout page
│   │
│   ├── data/
│   │   └── products.js                # Deprecated (now uses API)
│   │
│   ├── styles/
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── Navbar.css
│   │   ├── ProductCard.css
│   │   ├── Cart.css
│   │   ├── Home.css
│   │   └── Checkout.css
│   │
│   ├── App.js
│   └── index.js
│
├── backend/                             (Node.js/Express Backend)
│   ├── server.js                       # Express server
│   ├── db.js                           # MySQL connection pool
│   ├── package.json                    # Backend dependencies
│   ├── database.sql                    # Database schema
│   ├── .env.example                    # Environment template
│   ├── README.md                       # Backend documentation
│   │
│   ├── routes/
│   │   ├── productRoutes.js           # Product endpoints
│   │   └── orderRoutes.js             # Order endpoints
│   │
│   └── controllers/
│       ├── productController.js        # Product business logic
│       └── orderController.js          # Order business logic
│
├── package.json                        # Frontend dependencies
├── README.md                           # Main documentation
├── QUICK_START.md                      # Phase 1 quick start
├── PHASE2_SETUP.md                     # Phase 2 quick start
└── BACKEND_ARCHITECTURE.md             # Backend detailed docs
```

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or yarn
- **MySQL** (5.7 or higher)

### Quick Setup (15 minutes)

For a complete step-by-step guide, see **[PHASE2_SETUP.md](PHASE2_SETUP.md)**

#### 1. Database Setup
```bash
# Run this in MySQL (or use MySQL Workbench)
mysql -u root -p < backend/database.sql
```

#### 2. Backend Installation
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run dev
# Server runs on http://localhost:5000
```

#### 3. Frontend Installation (New Terminal)
```bash
npm install
npm start
# App opens at http://localhost:3000
```

---

## 🚀 Running the Application

You need **two terminal windows**:

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# ✅ Server running on http://localhost:5000
```

### Terminal 2 - Frontend  
```bash
npm start
# ✅ App running on http://localhost:3000
```

---

## 📱 Using the Application

1. **Browse Products** - All items load from MySQL database
2. **Add to Cart** - Click "Add to Cart" button
3. **Manage Cart** - Adjust quantities or remove items
4. **Place Order** - Click "Proceed to Checkout"
5. **Confirmation** - Order is saved to database with Order ID

---

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Add new product (admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order with items
- `GET /api/orders/stats/count` - Get total orders

See **[BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md)** for detailed API documentation.

---

## 💾 Database Schema

### Products Table
```sql
id (Primary Key)
name (VARCHAR 100)
price (INT)
created_at (TIMESTAMP)
```

### Orders Table
```sql
id (Primary Key)
total_amount (INT)
status (VARCHAR 50)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Order_Items Table
```sql
id (Primary Key)
order_id (Foreign Key → orders.id)
product_id (Foreign Key → products.id)
quantity (INT)
price (INT)
```

## Technology Stack Details

### Frontend Features
- **React Hooks** - useState, useEffect for state management
- **Fetch API** - Native HTTP client for API calls
- **Responsive CSS** - Mobile-first approach with media queries
- **Error Handling** - Loading states and error messages
- **Real-time Updates** - Instant cart updates on product interactions

### Backend Features
- **Express Middleware** - CORS, body-parser, request logging
- **MySQL Connection Pool** - Up to 10 simultaneous connections
- **Database Transactions** - Atomic order creation
- **Error Handling** - Comprehensive error responses
- **RESTful Architecture** - Standard HTTP methods and status codes

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Future Enhancements

- Backend API integration
- User authentication
- Payment gateway integration
- Order history/tracking
- Product search and filters
- Admin dashboard
- Real product images
- Inventory management

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **Backend won't start** | Check MySQL is running, verify .env credentials |
| **"Cannot GET /api/products"** | Ensure backend server is running (npm run dev) |
| **"CORS error"** | Verify FRONTEND_URL in backend/.env matches frontend URL |
| **"Port 5000 already in use"** | Change PORT in backend/.env or kill the process |
| **"Port 3000 already in use"** | Run `npm start -- --port 3001` |
| **"Database not found"** | Run `mysql -u root -p < backend/database.sql` |
| **Frontend shows "Loading..."** | Check browser console (F12) for errors |

---

## 📊 Performance Considerations

### Database Optimization
- Primary key indexes for fast lookups
- Foreign key relationships for data integrity
- Connection pooling for efficient resource usage
- Parameterized queries to prevent SQL injection

### Frontend Optimization
- Component-based architecture
- Efficient re-renders with React hooks
- CSS Grid for responsive layouts
- Lazy loading for better UX

---

## 🔐 Security Features

### Implemented
- Parameterized SQL queries (SQL injection prevention)
- CORS enabled for specific origin
- Environment variables for sensitive data
- HTTP status code best practices

### Planned (Phase 3)
- User authentication with JWT
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS/TLS encryption

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **QUICK_START.md** | Phase 1 frontend setup (5 minutes) |
| **PHASE2_SETUP.md** | Phase 2 complete setup (15 minutes) |
| **BACKEND_ARCHITECTURE.md** | Detailed backend architecture & API reference |
| **backend/README.md** | Backend-specific documentation |

---

## 🚀 Next Steps (Phase 3)

- [ ] User registration and login
- [ ] Admin dashboard for order management
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Email notifications for orders
- [ ] Product search and filtering
- [ ] User profile and order history
- [ ] Inventory management
- [ ] Real product images with CDN
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

## License

This project is open source and available for educational purposes.

---

## Support

For detailed documentation:

1. **Frontend Issues** - Check [QUICK_START.md](QUICK_START.md)
2. **Setup Issues** - Check [PHASE2_SETUP.md](PHASE2_SETUP.md)
3. **API Issues** - Check [BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md)
4. **Backend Issues** - Check [backend/README.md](backend/README.md)
5. **Browser Console** - Check errors with F12 → Console tab

---

## 📈 Project Statistics

- **Frontend Files:** 13
- **Backend Files:** 7
- **Database Tables:** 3
- **API Endpoints:** 8
- **Total Lines of Code:** 2000+

---

## 👥 Contributing

This is an educational project. Feel free to fork, modify, and learn!

---

**Status:** Phase 2 ✅ Complete  
**Frontend:** React with API integration  
**Backend:** Node.js/Express with MySQL  
**Last Updated:** April 2026  
**Version:** 2.0.0 - Phase 2 Complete
