# Phase 3: Admin Dashboard & Order Management Setup Guide

## Overview
Phase 3 adds a complete Admin Dashboard that allows the shop owner to:
- View business metrics and statistics
- Manage customer orders with a 5-step workflow
- Manage products (Add, Edit, Delete)
- Monitor sales and order status in real-time

## Project Structure

### New Admin Components (src/admin/)
```
src/admin/
├── AdminPanel.js           # Main admin container component
├── AdminNavbar.js          # Navigation bar with tab switching
├── Dashboard.js            # Business metrics & statistics
├── Orders.js               # Order management interface
├── Products.js             # Product CRUD management
└── styles/
    ├── AdminPanel.css      # Main admin panel styling
    ├── AdminNavbar.css     # Navigation styling
    ├── Dashboard.css       # Dashboard statistics styling
    ├── Orders.css          # Orders management styling
    └── Products.css        # Products management styling
```

### Modified Frontend Files
- **src/App.js**: Added `isAdminMode` state and toggle functionality
- **src/components/Navbar.js**: Added Admin button (👨‍💼) to access admin mode
- **src/styles/Navbar.css**: Updated with admin button styling

### Backend Extensions
- **backend/controllers/orderController.js**: 
  - `updateOrderStatus()`: Update order status with validation
  - `getOrdersStats()`: Fetch dashboard statistics
- **backend/controllers/productController.js**:
  - `updateProduct()`: Update existing product
  - `deleteProduct()`: Delete product from inventory
- **backend/routes/orderRoutes.js**:
  - `PUT /api/orders/:id/status`: Update order status
  - `GET /api/orders/stats/all`: Get dashboard statistics
- **backend/routes/productRoutes.js**:
  - `PUT /api/products/:id`: Update product
  - `DELETE /api/products/:id`: Delete product

## Quick Start

### 1. Start the Backend Server
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

### 2. In a new terminal, Start the Frontend
```bash
npm start
# Frontend runs on http://localhost:3000
```

### 3. Access Admin Dashboard
- Click the **👨‍💼 Admin** button in the navbar
- This will toggle to admin mode with the Dashboard, Orders, and Products sections

### 4. Exit Admin Mode
- Click **🚪 Exit Admin** button in the admin navbar
- Returns to customer shopping interface

## Features

### Dashboard Tab 📈
Displays real-time business metrics:
- **Total Orders**: Number of orders placed
- **Total Revenue**: Sum of all order amounts
- **Order Status Breakdown**: Count of orders in each status
  - Pending (🟡)
  - Accepted (🔵)
  - Preparing (🟡)
  - Ready (🟢)
  - Completed (✅)

### Orders Tab 📦
Order management interface with two-column layout:

**Left Panel - Orders Table:**
- Lists all orders with ID, amount, status, and date
- Click any order to view its details

**Right Panel - Order Details:**
- Shows selected order items with quantities and prices
- **Status Dropdown**: Update order status through validated workflow
- Valid status transitions: pending → accepted → preparing → ready → completed
- All changes are saved immediately to the backend

### Products Tab 🛒
Product inventory management with:

**Product Grid:**
- Displays all products with name and price
- Edit and Delete buttons on each product card

**Add Product Form:**
- Click "Add Product" button
- Fill in product name and price
- Saves to database immediately

**Edit Product Form:**
- Click "Edit" on any product
- Update name and price
- Changes saved to database

**Delete Product:**
- Click "Delete" on any product
- Product removed from inventory
- Updates backend database

## API Endpoints (New/Modified for Phase 3)

### Order Management
```
GET    /api/orders                    # Get all orders
GET    /api/orders/:id                # Get order with items
POST   /api/orders                    # Create new order
PUT    /api/orders/:id/status         # Update order status ★ NEW
GET    /api/orders/stats/all          # Get dashboard stats ★ NEW
GET    /api/orders/stats/count        # Get orders count
```

### Product Management
```
GET    /api/products                  # Get all products
GET    /api/products/:id              # Get product by ID
POST   /api/products                  # Add new product
PUT    /api/products/:id              # Update product ★ NEW
DELETE /api/products/:id              # Delete product ★ NEW
```

## Order Status Workflow

The admin system uses a 5-step order workflow:

```
Pending (Customer just ordered)
   ↓
Accepted (Shop owner accepts the order)
   ↓
Preparing (Kitchen starts preparing)
   ↓
Ready (Order ready for pickup/delivery)
   ↓
Completed (Customer received the order)
```

## Frontend Mode Switching

The application now supports two modes:

### Customer Mode (Default)
- Browse products
- Add items to cart
- View cart and place orders
- Accessed when app starts

### Admin Mode
- Click 👨‍💼 Admin button in navbar
- Access Dashboard, Orders, and Products
- Manage business operations
- Click 🚪 Exit Admin to return to customer mode

**Note**: Currently no authentication - admin mode is accessed by button click. 
Future Phase (Phase 4) will add JWT authentication for security.

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(8, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Valid statuses: pending, accepted, preparing, ready, completed
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(8, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

## Styling & Theme

**Customer Interface** - Blue/Purple gradient:
- Primary gradient: `#667eea` → `#764ba2`
- Used in navbar and buttons

**Admin Interface** - Dark blue gradient:
- Primary gradient: `#1e3c72` → `#2a5298`
- Professional dark theme for admin charts and dashboards
- Color-coded status badges:
  - Pending: 🟡 #FFA500
  - Accepted: 🔵 #4299E1
  - Preparing: 🟡 #FFA500
  - Ready: 🟢 #38A169
  - Completed: ✅ #48BB78

**Responsive Design**:
- Desktop: Full layout with sidebars
- Tablet/Mobile (≤768px): Adjusted spacing and grid
- Media queries ensure usability across all devices

## Error Handling

The admin dashboard includes error handling for:
- Invalid order status values
- Missing products
- Network/API failures
- Invalid product data (missing name/price)
- Database errors

**User Feedback**:
- Alert messages for errors and success
- Loading states while fetching data
- Visual feedback on button clicks

## Testing the Admin Features

### Test Dashboard Stats
1. Create a few test orders from customer mode
2. Go to admin Dashboard
3. Verify stats are calculated and displayed
4. Place more orders and refresh dashboard to see updates

### Test Order Management
1. In Orders tab, select an order
2. Try changing the status from dropdown
3. Verify status changes persist (reload page)
4. Check that invalid statuses are rejected

### Test Product Management
1. In Products tab, click "Add Product"
2. Enter product name and price
3. Verify product appears in grid
4. Edit the product details
5. Delete the product and verify removal

## Known Limitations (Future Enhancements)

- ❌ No authentication (Phase 4: Add JWT)
- ❌ No user authorization (Phase 4: Add role-based access)
- ❌ No order notes/comments (Phase 4: Add messaging)
- ❌ No inventory tracking (Phase 4: Add stock management)
- ❌ No payment processing (Phase 4: Add Stripe integration)
- ❌ No email notifications (Phase 4: Add email alerts)
- ❌ No analytics/reports (Phase 4: Add advanced analytics)

## Troubleshooting

### Admin panel not loading
- Ensure backend server is running on `http://localhost:5000`
- Check browser console for API errors (F12)
- Verify all admin component files exist in `src/admin/`

### Can't update order status
- Check that backend is running
- Verify status value is valid (pending/accepted/preparing/ready/completed)
- Check browser network tab for failed requests

### Products not showing in admin
- Make sure backend has product data in database
- Run `npm run dev` in backend folder to start server
- Check that GET /api/products endpoint returns data

### Style issues in admin
- Verify all CSS files in `src/admin/styles/` exist
- Check that ClassNames match between JSX and CSS
- Clear browser cache (Ctrl+Shift+Delete) and reload

## Next Steps (Phase 4)

The next phase will add:
- User authentication (JWT tokens)
- Role-based access control (customer vs shop owner)
- Order confirmation emails
- Payment processing integration
- Advanced analytics dashboard
- Inventory management
- Customer order history

---

**Current Version**: Phase 3 ✅  
**Last Updated**: 2024  
**Status**: Admin Dashboard Complete
