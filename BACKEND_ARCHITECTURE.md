# Backend Architecture & API Documentation

Complete documentation for the Grocery Shop Backend system.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React Frontend)                   │
│                  http://localhost:3000                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/JSON
                         │
┌────────────────────────▼────────────────────────────────────┐
│              API Server (Express.js)                         │
│                 http://localhost:5000                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Routes & Middleware                  │ │
│  │  • CORS enabled for localhost:3000                     │ │
│  │  • Body parser for JSON                                │ │
│  │  • Request logging                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                         │                                    │
│  ┌──────────────────────┼──────────────────────────────────┐ │
│  │                      ▼                                  │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │    Controllers (Business Logic)                    │ │ │
│  │  │ • productController.js                             │ │ │
│  │  │ • orderController.js                               │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                      │                                  │ │
│  │  ┌────────────────────▼───────────────────────────────┐ │ │
│  │  │        MySQL Connection Pool (db.js)               │ │ │
│  │  │ • Max 10 simultaneous connections                  │ │ │
│  │  │ • Connection pooling for performance               │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  └                                                          │ │
└────────────────────────┬────────────────────────────────────┘
                         │
                    SQL Queries
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  MySQL Database                             │
│            grocery_shop_db (localhost:3306)                 │
│                                                              │
│        ┌─────────────┐  ┌──────────────┐  ┌────────────┐   │
│        │  products   │  │    orders    │  │order_items │   │
│        ├─────────────┤  ├──────────────┤  ├────────────┤   │
│        │ id (PK)     │  │ id (PK)      │  │ id (PK)    │   │
│        │ name        │  │ total_amount │  │ order_id   │   │
│        │ price       │  │ status       │  │ product_id │   │
│        │ created_at  │  │ created_at   │  │ quantity   │   │
│        │             │  │ updated_at   │  │ price      │   │
│        └─────────────┘  └──────────────┘  └────────────┘   │
│              │                  │               │            │
│              └──────────────────┼───────────────┘            │
│                                 │                            │
│                        Foreign Key References               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema Details

### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- Primary Key: `id` (auto-increment)

**Sample Data:**
| id | name | price |
|----|------|-------|
| 1 | Milk (1L) | 50 |
| 2 | Bread | 40 |
| 3 | Eggs (1 piece) | 6 |
| 4 | Rice (1kg) | 70 |
| 5 | Tomato (1kg) | 30 |
| 6 | Onion (1kg) | 35 |

---

### Orders Table
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  total_amount INT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Statuses:**
- `pending` - Order received, not yet processed
- `confirmed` - Order confirmed (future)
- `shipped` - Order shipped (future)
- `delivered` - Order delivered (future)

---

### Order_Items Table
```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

**Why separate table?**
- Normalizes data (no data duplication)
- Stores price at time of order (price can change later)
- Allows multiple items per order
- Enables order history

---

## 🔌 Complete API Reference

### Products API

#### 1. Get All Products
```
GET /api/products
```

**cURL:**
```bash
curl http://localhost:5000/api/products
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Milk (1L)",
      "price": 50,
      "created_at": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Bread",
      "price": 40,
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "message": "Products fetched successfully"
}
```

---

#### 2. Get Single Product
```
GET /api/products/:id
```

**Example:**
```bash
curl http://localhost:5000/api/products/1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Milk (1L)",
    "price": 50,
    "created_at": "2024-01-15T10:00:00.000Z"
  },
  "message": "Product fetched successfully"
}
```

**If not found (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

#### 3. Add Product (Admin)
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

**Response (201):**
```json
{
  "success": true,
  "message": "Product added successfully",
  "productId": 7
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "message": "Name and price are required"
}
```

---

### Orders API

#### 1. Create Order
```
POST /api/orders
```

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 5
    }
  ]
}
```

**Processing Steps:**
1. Validate all product IDs exist
2. Calculate total amount
3. Create order in `orders` table
4. Insert items in `order_items` table
5. Use database transaction (rollback on error)

**Response (201):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "orderId": 42,
  "totalAmount": 130
}
```

**Calculation Example:**
```
Product 1: price=50 × quantity=2 = 100
Product 3: price=6 × quantity=5 = 30
Total: 100 + 30 = 130
```

**Validation Errors (400):**
```json
{
  "success": false,
  "message": "Product with ID 999 not found"
}
```

**Empty Cart (400):**
```json
{
  "success": false,
  "message": "Order must contain at least one item"
}
```

---

#### 2. Get All Orders
```
GET /api/orders
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "total_amount": 130,
      "status": "pending",
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "total_amount": 95,
      "status": "pending",
      "created_at": "2024-01-15T11:00:00.000Z"
    }
  ],
  "message": "Orders fetched successfully"
}
```

---

#### 3. Get Order Details
```
GET /api/orders/:id
```

**Example:**
```bash
curl http://localhost:5000/api/orders/1
```

**Response (200):**
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

**Not Found (404):**
```json
{
  "success": false,
  "message": "Order not found"
}
```

---

#### 4. Get Orders Count
```
GET /api/orders/stats/count
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalOrders": 42
  }
}
```

---

## 💾 Database Transactions

### Order Creation with Transaction

The `createOrder` function uses MySQL transactions to ensure data consistency:

```javascript
async createOrder(items) {
  try {
    await connection.beginTransaction();
    
    // 1. Validate products exist
    // 2. Calculate total
    // 3. Insert order
    // 4. Insert order_items
    
    await connection.commit();
  } catch (error) {
    await connection.rollback();
  }
}
```

**Benefits:**
- All-or-nothing insertion (atomicity)
- If any item fails, entire order is rolled back
- Prevents incomplete orders in database

---

## 🔄 Frontend Integration Examples

### React: Fetch Products

```javascript
import { useEffect, useState } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        products.map(p => <div key={p.id}>{p.name} - ₹{p.price}</div>)
      )}
    </div>
  );
}
```

### React: Create Order

```javascript
async function placeOrder(cartItems) {
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
  
  if (result.success) {
    console.log('Order created:', result.orderId);
    // Handle success
  } else {
    console.error('Order failed:', result.message);
    // Handle error
  }
}
```

---

## 🔒 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "User-friendly message",
  "error": "Technical error details (dev mode)"
}
```

### Common Status Codes
- `200` - Success (GET)
- `201` - Created (POST)
- `400` - Bad request (validation error)
- `404` - Resource not found
- `500` - Server error

---

## ⚡ Performance Optimizations

### Connection Pooling
```javascript
const pool = mysql.createPool({
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});
```

**Benefits:**
- Reuses connections
- Reduces connection overhead
- Better throughput under load

### Indexed Queries
All queries use indexed columns:
- `products.id` (Primary Key)
- `orders.id` (Primary Key)
- Foreign keys automatically indexed

---

## 🔐 Security Considerations (Future)

### Implemented
- Parameterized queries (prevent SQL injection)
- CORS enabled (only from frontend)

### To Implement
- Input validation
- Rate limiting
- JWT authentication
- Password hashing
- HTTPS/TLS

---

## 📈 Monitoring & Logging

### Current Logging
```javascript
console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
```

### Request Flow Example
```
2024-01-15T10:30:00.000Z - POST /api/orders
Creating order for user...
Validating 2 products...
✅ Order created with ID: 42
Total amount: ₹130
```

---

## 🧪 Testing Scenarios

### Scenario 1: Happy Path
```
1. GET /api/products → Returns 6 products
2. POST /api/orders with valid items → Order ID: 1
3. GET /api/orders/1 → Returns complete order
```

### Scenario 2: Invalid Product
```
1. POST /api/orders with product_id: 999
2. Error: "Product with ID 999 not found"
3. Order NOT created
```

### Scenario 3: Empty Cart
```
1. POST /api/orders with items: []
2. Error: "Order must contain at least one item"
```

---

## 📝 SQL Queries Used

### Get Products
```sql
SELECT * FROM products;
```

### Create Order
```sql
INSERT INTO orders (total_amount, status) VALUES (130, 'pending');
-- Returns order ID
INSERT INTO order_items (order_id, product_id, quantity, price) 
VALUES (1, 1, 2, 50);
```

### Get Order with Items
```sql
SELECT * FROM orders WHERE id = 1;
SELECT oi.*, p.name FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id = 1;
```

---

## 🚀 Deployment (Future)

### Production Checklist
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS
- [ ] Add authentication/authorization
- [ ] Set up logging service (e.g., Winston)
- [ ] Add monitoring (e.g., New Relic)
- [ ] Database backups
- [ ] Rate limiting
- [ ] API versioning (/api/v1/)

---

**Backend Version:** 1.0.0  
**Last Updated:** April 2026  
**Status:** Phase 2 Complete ✅
