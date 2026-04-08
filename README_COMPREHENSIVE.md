# 🛒 Local Shop - Ordering & Billing System

A modern, full-stack grocery shop application with order management, real-time billing, and admin dashboard. Built with React, Node.js, and MySQL for demonstration and portfolio purposes.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-Latest-green)
![MySQL](https://img.shields.io/badge/MySQL-5.7+-orange)

---

## ✨ Features

### 🛍️ Customer Features
- **User Authentication** - Secure signup/login with JWT tokens
- **Product Browsing** - Search and filter products by category
- **Shopping Cart** - Add/remove items with quantity management
- **Order Placement** - Quick checkout process
- **Order History** - View all past orders with status tracking
- **Bill Viewing** - Download PDF invoices
- **Toast Notifications** - Real-time feedback for actions

### 👨‍💼 Admin Features
- **Admin Dashboard** - Order statistics and overview
- **Order Management** - View and update order statuses
- **Bill Generation** - Create and customize item-wise bills
- **Product Management** - Add, edit, delete products
- **Order Tracking** - Real-time status updates

### 🎨 UI/UX Enhancements
- **Loading Spinners** - Animated loaders for async operations
- **Empty States** - Engaging placeholders for empty content
- **Responsive Design** - Works seamlessly on desktop, tablet, mobile
- **Dark/Light Theme** - Beautiful gradient backgrounds
- **Real-time Search** - Instant product filtering

---

## 🏗️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **React Router DOM** - Client-side routing
- **HTML2PDF** - PDF invoice generation
- **CSS3** - Custom styling (no Bootstrap)
- **Context API** - State management

### Backend
- **Node.js + Express.js** - Server framework
- **MySQL 5.7+** - Database
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin handling
- **dotenv** - Environment management

### Database
- **4 Tables**: users, products, orders, bills, order_items
- **Relationships**: Foreign keys and constraints
- **Timestamps**: Created_at and updated_at fields

---

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MySQL** (v5.7 or higher)
- **Git**

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/shreyas-sv1/local-shop-ordering-billing-system.git
cd local-shop-ordering-billing-system
```

### 2. Set Up Database
```bash
# Open MySQL and run the database setup
mysql -u root -p < backend/database.sql

# Or manually:
# 1. Create database: CREATE DATABASE grocery_shop_db;
# 2. Run the SQL file contents
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MySQL credentials
nano .env
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=yourpassword
# DB_NAME=grocery_shop_db
# PORT=5000
# JWT_SECRET=your-secret-key-here

# Start backend server
npm start
# Server runs on http://localhost:5000
```

### 4. Frontend Setup
```bash
# From project root (go back one level)
cd ..

# Install dependencies
npm install

# Start React development server
npm start
# App opens on http://localhost:3000
```

---

## 🔐 Default Accounts

### Admin Account
- **Email**: admin@localshop.com
- **Password**: admin123

*Note: Create new accounts via signup page*

---

## 📚 API Documentation

### Authentication Endpoints

#### Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "data": {
    "userId": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "token": "eyJhbGc..."
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "data": {
    "userId": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "customer",
    "token": "eyJhbGc..."
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

### Products Endpoints

#### Get All Products
```
GET /api/products

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Milk (1L)",
      "price": 50,
      "category": "Dairy"
    }
  ]
}
```

### Orders Endpoints

#### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "items": [
    { "product_id": 1, "quantity": 2 }
  ]
}

Response (201):
{
  "success": true,
  "orderId": 1,
  "totalAmount": 100
}
```

#### Get All Orders
```
GET /api/orders

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "total_amount": 100,
      "status": "pending",
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

#### Update Order Status (Admin)
```
PUT /api/orders/:id/status
Content-Type: application/json

{
  "status": "accepted"
}
```

#### Generate Bill (Admin)
```
POST /api/orders/:id/generate-bill
Content-Type: application/json

{
  "items": [
    { "name": "Milk", "quantity": 2, "price": 50 }
  ]
}
```

---

## 📁 Project Structure

```
local-shop-ordering-billing-system/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── server.js
│   ├── db.js
│   ├── database.sql
│   └── package.json
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Cart.js
│   │   ├── ProductCard.js
│   │   ├── ProductSearch.js
│   │   ├── Loader.js
│   │   ├── EmptyState.js
│   │   └── CustomerBill.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── OrderHistory.js
│   │   ├── Login.js
│   │   └── Signup.js
│   ├── admin/
│   │   ├── AdminPanel.js
│   │   ├── Dashboard.js
│   │   ├── Orders.js
│   │   ├── Products.js
│   │   └── BillGenerator.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   ├── ToastContext.js
│   │   └── styles/
│   ├── styles/
│   │   ├── App.css
│   │   ├── Auth.css
│   │   └── ...
│   ├── App.js
│   └── index.js
├── public/
├── .env.example
├── package.json
└── README.md
```

---

## 🎯 Usage Examples

### For Customers
1. **Sign Up** - Create new account
2. **Browse Products** - Use search and filters
3. **Add to Cart** - Click "Add to Cart" button
4. **Checkout** - Proceed to order
5. **Track Order** - View order history
6. **Download Bill** - Get PDF invoice

### For Admin
1. **Login** - Use admin credentials
2. **View Dashboard** - See orders and stats
3. **Manage Orders** - Update status
4. **Generate Bills** - Create and customize bills
5. **Manage Products** - Add/edit/delete items

---

## 🔄 Workflow Diagram

```
Customer                    Frontend                Backend               Database
   |                           |                        |                      |
   |---signup/login----------->|                        |                      |
   |                           |---verify JWT---------->|                      |
   |                           |<--auth response--------|                      |
   |                           |                        |---store user------>|
   |<--redirect to home--------|                        |                      |
   |                           |                        |                      |
   |---browse products-------->|---GET /products------->|---query DB-------->|
   |<--show products-----------|<--products------------|<--return data------|
   |                           |                        |                      |
   |---search/filter---------->|---filter client-side-->|                      |
   |<--filtered results--------|                        |                      |
   |                           |                        |                      |
   |---add to cart------------>|(localStorage)         |                      |
   |                           |                        |                      |
   |---checkout--------------->|---POST /orders-------->|---create order-->|
   |<--order created-----------|<--order ID------------|<--return ID------|
   |                           |                        |---insert items--->|
   |                           |                        |                      |
   |---view orders------------>|---GET /orders-------->|---query all------->|
   |<--show order list---------|<--orders-------------|<--return data------|
   |                           |                        |                      |
   |---view bill--------------->|---GET /bill---------->|---query bill------->|
   |<--show invoice------------|<--bill data----------|<--return data------|
   |                           |                        |                      |
   |---download PDF---------->|---html2pdf JS-------->|                      |
   |<--PDF file----------------|                        |                      |
   
Admin                       Frontend                Backend               Database
   |                           |                        |                      |
   |---click admin------------>|                        |                      |
   |<--show admin panel--------|                        |                      |
   |                           |                        |                      |
   |---view dashboard-------->|---GET /stats---------->|---aggregate------->|
   |<--show stats-------------|<--statistics----------|<--return data------|
   |                           |                        |                      |
   |---select order---------->|(local state)           |                      |
   |                           |                        |                      |
   |---update status---------->|---PUT /status-------->|---update order---->|
   |<--status updated---------|<--success------------|<--confirm----------|
   |                           |                        |                      |
   |---generate bill---------->|---POST /bill---------->|---create bill---->|
   |<--bill editor modal-------|                        |<--return bill------|
   |                           |                        |                      |
   |---edit items/prices------>|(modal state)          |                      |
   |                           |                        |                      |
   |---finalize bill---------->|---POST /generate-bill->|---save bill------->|
   |<--bill created!-----------|<--success------------|<--return billID----|
```

---

## 🛠️ Development

### Available Scripts

**Frontend** (from root directory):
```bash
npm start           # Start React dev server
npm run build       # Build for production
npm test           # Run tests
```

**Backend** (from backend directory):
```bash
npm start           # Start Express server
npm run dev        # Start with nodemon (auto-reload)
```

### Environment Variables

Create `.env` file in backend directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=grocery_shop_db
PORT=5000
JWT_SECRET=your_super_secret_key_change_this_in_production
FRONTEND_URL=http://localhost:3000
```

---

## 📱 Responsive Design

- **Desktop** (1024px+) - Full layout with sidebar
- **Tablet** (768px-1024px) - Optimized spacing
- **Mobile** (< 768px) - Stacked layout, touch-friendly

All components tested on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs encryption
- **CORS Protection** - Cross-origin validation
- **Input Validation** - Server-side validation
- **Environment Variables** - Sensitive data protection
- **Database Constraints** - Foreign keys and unique constraints

---

## 📈 Performance Optimizations

- **React.useMemo** - Memoized computed values
- **Lazy Loading** - Components load on demand
- **CSS Animations** - GPU-accelerated transforms
- **Efficient Querying** - Optimized MySQL queries
- **Minimal Dependencies** - Only essential packages

---

## 🐛 Known Issues & Limitations

1. **No Email Verification** - Signup doesn't verify emails
2. **No Payment Integration** - Billing is demonstration only
3. **No SMS Notifications** - Orders aren't notified via SMS
4. **Single Server** - No load balancing or clustering
5. **No Database Replication** - Single database instance
6. **No Caching** - Every request hits the database

*These are intended for portfolio demonstration*

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the build/ folder to Vercel or Netlify
```

### Backend (Heroku/Railway)
```bash
# Create Procfile in backend directory
echo "web: node server.js" > Procfile

# Push to Heroku
git push heroku main
```

### Database (AWS RDS / Azure Database)
- Create MySQL instance in your cloud provider
- Update .env with cloud database credentials
- Run database.sql migration

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 💬 Support & Contact

- **Issues** - GitHub Issues
- **Email** - shreyas-sv1@github.com
- **Portfolio** - [Your Portfolio Link]

---

## 🎓 Learning Resources

This project demonstrates:
- Full-stack web development
- React hooks and Context API
- Express.js REST APIs
- MySQL database design
- JWT authentication
- Responsive CSS
- Building for production

Perfect for portfolio or interview preparation!

---

## 📝 Changelog

### V1.0.0 (Current)
- ✅ Complete user authentication system
- ✅ Product search and filtering
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ Bill generation with PDF export
- ✅ Admin dashboard
- ✅ Toast notifications
- ✅ Loading states and empty states
- ✅ Fully responsive design

---

## 🎉 Acknowledgments

- React documentation
- Express.js guides
- MySQL community
- Open source community

---

**Made with ❤️ for portfolio and learning purposes**

Last Updated: April 2024
