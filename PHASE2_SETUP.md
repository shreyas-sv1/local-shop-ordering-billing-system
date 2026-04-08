# 🚀 Phase 2: Backend Integration – Quick Start

## Overview

Phase 2 connects your React frontend to a Node.js/Express backend with MySQL database. The system now stores products and orders permanently.

---

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ Node.js (v14+) installed
- ✅ MySQL Server running
- ✅ The frozen frontend from Phase 1

---

## 🗄️ Step 1: Database Setup (5 minutes)

### Option A: Using MySQL Command Line

```bash
mysql -u root -p < backend/database.sql
```

### Option B: Using MySQL Workbench

1. Open **MySQL Workbench**
2. Create new connection (if needed)
3. Click **File → Open SQL Script**
4. Select `backend/database.sql`
5. Click the lightning bolt icon to execute
6. You should see: `Query OK` messages

### Option C: Manual Setup

1. Open MySQL Command Line or Workbench
2. Run these commands:

```sql
CREATE DATABASE grocery_shop_db;
USE grocery_shop_db;

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  price INT
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  total_amount INT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  product_id INT,
  quantity INT,
  price INT,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO products (name, price) VALUES
('Milk (1L)', 50),
('Bread', 40),
('Eggs (1 piece)', 6),
('Rice (1kg)', 70),
('Tomato (1kg)', 30),
('Onion (1kg)', 35);
```

### ✅ Verify Installation

```sql
USE grocery_shop_db;
SELECT * FROM products;
```

You should see 6 products.

---

## ⚙️ Step 2: Backend Setup (5 minutes)

### 1. Navigate to Backend

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This installs: express, mysql2, cors, body-parser, dotenv

### 3. Create `.env` File

**Windows (PowerShell):**
```powershell
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

### 4. Edit `.env` File

Open `.env` with your editor and update with your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=grocery_shop_db
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Note:** If you set no password for MySQL, leave `DB_PASSWORD` empty.

### 5. Start Backend Server

**Option A: Development (with auto-reload)**
```bash
npm run dev
```

**Option B: Production**
```bash
npm start
```

You should see:
```
🚀 Grocery Shop Backend Server Started
📍 Server: http://localhost:5000
📊 API: http://localhost:5000/api
```

✅ **Backend is running!**

---

## 🎨 Step 3: Frontend Setup (2 minutes)

### 1. Navigate to Frontend

**Open a NEW Terminal/PowerShell window:**

```bash
cd ..
```

### 2. Frontend is Already Updated

The frontend files have been updated to fetch from the backend automatically. No changes needed!

### 3. Start Frontend

```bash
npm start
```

You should see:
```
On Your Network: http://localhost:3000
Compiled successfully!
```

✅ **Frontend is running!**

---

## 🧪 Step 4: Test the Integration

### Using the Web App

1. Open browser: `http://localhost:3000`
2. Click **"Add to Cart"** for any product
3. Click **"Proceed to Checkout"**
4. You should see: `Order Placed Successfully! Order ID: 1`
5. ✅ Order was saved to the database!

### Verify in Database

```sql
USE grocery_shop_db;
SELECT * FROM orders;
SELECT * FROM order_items;
```

You should see your order!

---

## 🔌 Testing API with Postman (Optional)

### 1. Download Postman
- Go to https://www.postman.com/downloads/
- Download and install

### 2. Test Endpoints

#### Get All Products
```
Method: GET
URL: http://localhost:5000/api/products
```

#### Create Order
```
Method: POST
URL: http://localhost:5000/api/orders

Body (JSON):
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 5 }
  ]
}
```

#### Get All Orders
```
Method: GET
URL: http://localhost:5000/api/orders
```

---

## 📁 Complete Project Structure

```
shop/
├── src/                          (Frontend - React)
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── ProductCard.js
│   │   └── Cart.js
│   ├── pages/
│   │   ├── Home.js              (✨ Updated to fetch from backend)
│   │   └── Checkout.js
│   ├── styles/
│   └── App.js
│
├── backend/                      (✨ NEW - Backend Server)
│   ├── server.js                (Express server)
│   ├── db.js                    (MySQL connection)
│   ├── package.json             (Dependencies)
│   ├── .env.example
│   ├── database.sql             (Database schema)
│   ├── README.md
│   │
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   │
│   └── controllers/
│       ├── productController.js
│       └── orderController.js
│
├── package.json                 (Frontend deps)
├── README.md
└── QUICK_START.md
```

---

## 🔄 Data Flow

### Before (Phase 1 - Frontend Only)
```
React App → localStorage
```

### After (Phase 2 - Full Stack)
```
React App → Express Backend → MySQL Database
```

**User Journey:**
1. User adds items to cart (frontend state)
2. User clicks "Proceed to Checkout"
3. Frontend sends cart to backend API
4. Backend calculates total and validates products
5. Backend creates order in MySQL
6. Backend returns Order ID to frontend
7. Frontend shows confirmation to user

---

## 🚀 Running Both Servers

You need **two terminal windows**:

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
npm start
# App running on http://localhost:3000
```

---

## ✨ Key Features Now Working

✅ **Products loaded from MySQL database**  
✅ **Orders saved permanently**  
✅ **Real-time price calculation on backend**  
✅ **Order tracking with Order ID**  
✅ **REST API for future admin dashboard**  
✅ **CORS enabled for frontend-backend communication**  

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Backend won't start** | Check MySQL is running, verify .env credentials |
| **"Cannot GET /api/products"** | Make sure backend server is running (npm run dev) |
| **"CORS error"** | Verify FRONTEND_URL in backend/.env is correct |
| **Frontend shows "Loading..."** | Check browser console (F12) for error messages |
| **"Database not found"** | Run database.sql to create tables |
| **Port 5000 already in use** | Change PORT in .env or kill the process |

---

## 📊 API Response Format

All responses include:
```json
{
  "success": true/false,
  "data": { ... },
  "message": "Description"
}
```

---

## 🎯 What's Next?

Phase 3 features:
- User authentication (login/signup)
- Admin dashboard
- Payment gateway integration
- Order history
- Product search and filters

---

**Status:** Phase 2 ✅ Complete  
**Frontend & Backend:** Connected & Running  
**Database:** MySQL with sample data  
**Time to Setup:** ~15 minutes  

Happy coding! 🎉
