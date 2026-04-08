# Grocery Shop Backend Server

Express.js + MySQL backend for the grocery shop ordering system.

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (5.7 or higher)
- **npm** or **yarn**
- **Postman** (optional, for API testing)

## 🗄️ Database Setup

### Step 1: Create Database and Tables

1. Open **MySQL Command Line** or **MySQL Workbench**

2. Copy and paste the contents of `database.sql`:
   ```sql
   CREATE DATABASE IF NOT EXISTS grocery_shop_db;
   USE grocery_shop_db;
   
   CREATE TABLE products (
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     price INT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   CREATE TABLE orders (
     id INT PRIMARY KEY AUTO_INCREMENT,
     total_amount INT NOT NULL,
     status VARCHAR(50) DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   CREATE TABLE order_items (
     id INT PRIMARY KEY AUTO_INCREMENT,
     order_id INT NOT NULL,
     product_id INT NOT NULL,
     quantity INT NOT NULL,
     price INT NOT NULL,
     FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
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

3. Or run from terminal:
   ```bash
   mysql -u root -p < database.sql
   ```

### Step 2: Verify Installation

Run in MySQL:
```sql
USE grocery_shop_db;
SELECT * FROM products;
```

You should see 6 products listed.

---

## ⚙️ Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

This installs:
- `express` - Web framework
- `mysql2` - Database driver
- `cors` - Cross-origin requests
- `body-parser` - JSON parsing
- `dotenv` - Environment variables
- `nodemon` - Auto-reload (dev)

### Step 2: Configure Environment

1. Create `.env` file in `backend/` directory:

```bash
cp .env.example .env
```

2. Edit `.env` with your database credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=grocery_shop_db
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Step 3: Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

You should see:
```
🚀 Grocery Shop Backend Server Started
📍 Server: http://localhost:5000
```

---

## 📊 Database Schema

### Products Table
```
+-----------+-----------+--------+
| id (PK)   | name      | price  |
+-----------+-----------+--------+
| 1         | Milk      | 50     |
| 2         | Bread     | 40     |
| ...       | ...       | ...    |
+-----------+-----------+--------+
```

### Orders Table
```
+----+---------------+--------+-----------+
| id | total_amount  | status | created_at|
+----+---------------+--------+-----------+
| 1  | 150           | pending| timestamp |
+----+---------------+--------+-----------+
```

### Order_Items Table
```
+----+----------+------------+----------+-------+
| id | order_id | product_id | quantity | price |
+----+----------+------------+----------+-------+
| 1  | 1        | 1          | 2        | 50    |
| 2  | 1        | 3          | 5        | 6     |
+----+----------+------------+----------+-------+
```

---

## 🔌 API Endpoints

### Products

#### Get All Products
```
GET /api/products
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Milk (1L)", "price": 50 },
    { "id": 2, "name": "Bread", "price": 40 }
  ],
  "message": "Products fetched successfully"
}
```

#### Get Product by ID
```
GET /api/products/:id
```

**Example:**
```
GET /api/products/1
```

**Response:**
```json
{
  "success": true,
  "data": { "id": 1, "name": "Milk (1L)", "price": 50 },
  "message": "Product fetched successfully"
}
```

#### Add Product (Admin Only)
```
POST /api/products
```

**Request Body:**
```json
{
  "name": "Chicken (1kg)",
  "price": 250
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added successfully",
  "productId": 7
}
```

---

### Orders

#### Create Order
```
POST /api/orders
```

**Request Body:**
```json
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 5 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "orderId": 1,
  "totalAmount": 130
}
```

#### Get All Orders
```
GET /api/orders
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "total_amount": 130,
      "status": "pending",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "message": "Orders fetched successfully"
}
```

#### Get Order by ID with Items
```
GET /api/orders/:id
```

**Example:**
```
GET /api/orders/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "total_amount": 130,
    "status": "pending",
    "created_at": "2024-01-15T10:30:00.000Z",
    "items": [
      {
        "product_id": 1,
        "name": "Milk (1L)",
        "quantity": 2,
        "price": 50
      },
      {
        "product_id": 3,
        "name": "Eggs (1 piece)",
        "quantity": 5,
        "price": 6
      }
    ]
  },
  "message": "Order fetched successfully"
}
```

#### Get Orders Count
```
GET /api/orders/stats/count
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 42
  }
}
```

---

## 🧪 Testing with Postman

### 1. Import API Collection

Create a new Postman collection with these requests:

#### Get All Products
- **Method:** GET
- **URL:** `http://localhost:5000/api/products`

#### Create Order
- **Method:** POST
- **URL:** `http://localhost:5000/api/orders`
- **Body (JSON):**
  ```json
  {
    "items": [
      { "product_id": 1, "quantity": 2 },
      { "product_id": 2, "quantity": 1 }
    ]
  }
  ```

#### Get Order Details
- **Method:** GET
- **URL:** `http://localhost:5000/api/orders/1`

---

## 📁 Backend Structure

```
backend/
 ├── server.js                    # Express server setup
 ├── db.js                        # MySQL connection pool
 ├── package.json                 # Dependencies
 ├── .env.example                 # Environment template
 ├── .gitignore
 ├── README.md                    # This file
 ├── database.sql                 # Database initialization
 │
 ├── routes/
 │   ├── productRoutes.js       # Product endpoints
 │   └── orderRoutes.js         # Order endpoints
 │
 └── controllers/
     ├── productController.js    # Product logic
     └── orderController.js      # Order logic
```

---

## 🔄 Integration with Frontend

Update your React frontend to fetch from backend:

### Before (Static Data):
```javascript
import products from '../data/products.js';

useEffect(() => {
  setProducts(products);
}, []);
```

### After (Backend API):
```javascript
useEffect(() => {
  fetch('http://localhost:5000/api/products')
    .then(res => res.json())
    .then(data => setProducts(data.data))
    .catch(err => console.error(err));
}, []);
```

### Create Order:
```javascript
const handleCheckout = async (cartItems) => {
  const orderData = {
    items: cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity
    }))
  };
  
  const response = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  
  const result = await response.json();
  console.log('Order created:', result);
};
```

---

## 🚀 Running Both Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd ..
npm start
```

Both servers run on:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Can't connect to MySQL"** | Check DB credentials in `.env`, ensure MySQL is running |
| **"CORS error"** | Verify `FRONTEND_URL` in `.env` matches your React app URL |
| **"Module not found"** | Run `npm install` in backend folder |
| **"Port 5000 already in use"** | Change `PORT` in `.env` or kill the process |
| **"Tables don't exist"** | Run `database.sql` in MySQL to create schema |

---

## 📝 API Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Description"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Technical details"
}
```

---

## 🔐 Future Security Features

- User authentication (JWT)
- Admin authorization
- Input validation
- SQL injection prevention
- Rate limiting
- API key management

---

## 📊 Key Features

✅ RESTful API design  
✅ Database transaction support  
✅ Error handling  
✅ CORS enabled  
✅ Environment configuration  
✅ Request logging  
✅ Proper HTTP status codes  

---

**Status:** Phase 2 - Backend Complete ✅  
**Created:** April 2026  
**Version:** 1.0.0
