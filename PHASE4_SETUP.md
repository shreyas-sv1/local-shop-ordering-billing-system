# Phase 4: Shop Owner Billing System Setup Guide

## Overview
Phase 4 implements a complete "Order First → Bill Later" billing system where the shop owner generates the final bill after reviewing a customer's order before the customer pays.

## 🎯 Workflow Overview

```
Customer Places Order
        ↓
Order Status: Pending
        ↓
Shop Owner Accepts Order
        ↓
Order Status: Accepted/Preparing
        ↓
Shop Owner Generates Bill
  (Can adjust quantities/prices)
        ↓
Order Status: Ready
        ↓
Customer Views Final Bill
        ↓
Order Status: Completed
```

## 🗄️ Database Changes

### Orders Table Updates
```sql
ALTER TABLE orders ADD COLUMN final_amount INT;
ALTER TABLE orders ADD COLUMN bill_generated BOOLEAN DEFAULT FALSE;
```

### New Bills Table
```sql
CREATE TABLE bills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL UNIQUE,
  final_amount INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

## ⚙️ Backend API Endpoints

### 1. Generate Bill (Admin)
```http
POST /api/orders/:id/generate-bill
```

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 50
    },
    {
      "product_id": 2,
      "quantity": 1,
      "price": 100
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bill generated successfully",
  "orderId": 1,
  "billId": 5,
  "finalAmount": 200
}
```

**Key Features:**
- Admin can modify quantities and prices
- Calculates final amount server-side (prevents frontend tampering)
- Updates order status to "ready"
- Sets `bill_generated` flag to true
- Creates bill record in bills table

### 2. Get Bill Preview (Admin)
```http
GET /api/orders/:id/bill-preview
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": 1,
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "name": "Milk",
        "quantity": 2,
        "price": 50,
        "subtotal": 100
      }
    ],
    "calculatedTotal": 200,
    "originalTotal": 200
  }
}
```

**Use Case:** Allows admin to preview items before generating final bill

### 3. Get Bill Details (Customer)
```http
GET /api/orders/:id/bill
```

**Response:**
```json
{
  "success": true,
  "data": {
    "billId": 5,
    "orderId": 1,
    "items": [
      {
        "product_id": 1,
        "name": "Milk",
        "quantity": 2,
        "price": 50,
        "subtotal": 100
      }
    ],
    "finalAmount": 200,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Use Case:** Customers view their final bill after shop generates it

## 🧾 Admin Side Features

### Bill Generator Modal
- **Location:** Admin Orders tab → Select order → "Generate Bill" button
- **Features:**
  - View all order items
  - Edit quantity per item
  - Edit unit price per item
  - Real-time total calculation
  - Generate button (disables if no items)
  - Cancel button to dismiss

### Integration with Orders
- "Generate Bill" button appears only if bill not yet generated
- Shows "Bill Generated" badge once bill is created
- New "Billed" column in orders table (Yes/No)
- Bill details shown in order details panel

### Order Details Updates
- Shows "Bill Generated" section with final amount
- Visual badge indicating bill status
- Generate Bill button available for unbilled orders

## 👤 Customer Side Features

### New "My Orders" Page
- **Access:** 📋 "My Orders" button in navbar
- **Displays:**
  - All customer orders in grid layout
  - Order ID, status, date, and amounts
  - Color-coded status badges
  - "View Bill" button for billed orders
  - "Waiting for bill..." notice for unbilled orders

### Bill Viewing Modal
- **Trigger:** Click "View Bill" on any billed order
- **Displays:**
  - Shop name and "Bill Receipt" header
  - Order ID and Bill ID
  - List of items with quantity, price, and subtotal
  - Final bill amount (prominently displayed)
  - Order date and timestamp
  - Print-friendly formatting

### Print Functionality
- Print bill as PDF receipt
- Professional print styling
- Hides modal controls when printing
- Receipt-style layout

## 📁 File Structure

### New Files Created
```
backend/controllers/orderController.js   (extended)
  - generateBill()
  - getBillDetails()
  - getBillPreview()

backend/routes/orderRoutes.js            (extended)
  - POST /:id/generate-bill
  - GET /:id/bill-preview
  - GET /:id/bill

src/admin/BillGenerator.js               (new)
  - Modal component for bill generation
  - Item editing (qty/price)
  - Real-time calculation
  - API integration

src/admin/styles/BillGenerator.css       (new)

src/components/CustomerBill.js           (new)
  - Display bill to customer
  - Print functionality
  - Receipt formatting

src/components/styles/CustomerBill.css   (new)

src/pages/OrderHistory.js                (new)
  - Customer order history page
  - Order cards with status
  - Bill view buttons

src/styles/OrderHistory.css              (new)

src/admin/Orders.js                      (updated)
  - Integrated BillGenerator modal
  - Bill status indicators
  - Generate Bill button

src/admin/styles/Orders.css              (updated)
  - Styles for "Billed" column
  - Billing badge styles
  - Generate Bill button styles

src/components/Navbar.js                 (updated)
  - Added "My Orders" button
  - New onOrdersClick prop

src/styles/Navbar.css                    (updated)
  - Styles for "My Orders" button

src/App.js                               (updated)
  - Page routing (Home/Orders)
  - handleViewOrders function
  - OrderHistory page integration
```

### Modified Database
```
backend/database.sql
  - ALTER TABLE orders (added final_amount, bill_generated)
  - CREATE TABLE bills
```

## 🔄 Complete Workflow

### Shop Owner Perspective
1. **In Admin Panel → Orders Tab:**
   - View all pending/accepted orders
   - Click "View" on order to see details
   - Click "Generate Bill" button
   - BillGenerator modal opens

2. **In Bill Generator:**
   - Review all order items
   - Edit quantities if items unavailable/damaged
   - Edit prices if different from catalog
   - See real-time total calculation
   - Click "Generate Bill" to save

3. **After Bill Generation:**
   - Order status changes to "ready"
   - Bill badge shows in order card
   - Final amount displayed in order details
   - Customer can now view bill

### Customer Perspective
1. **Shopping:**
   - Browse and add items to cart
   - Place order
   - See order confirmation with Order ID

2. **View Order Status:**
   - Click "📋 My Orders" in navbar
   - See order card with current status
   - Status updates: Pending → Accepted → Preparing → Ready → Completed

3. **View Final Bill:**
   - Once status is "Ready", bill is generated
   - Click "View Bill" button on order card
   - Bill modal opens with receipt
   - Can print bill as PDF

## 💡 Key Security Features

### Backend Validation
- ✅ Server calculates final amount (prevents frontend tampering)
- ✅ Validates item quantities and prices
- ✅ Prevents duplicate billing (unique bill per order)
- ✅ Database transactions ensure data consistency
- ✅ Foreign key constraints maintain referential integrity

### Data Integrity
- ✅ Order items are replaced with final bill items
- ✅ Bill is immutable once generated
- ✅ Historical records maintained for audit
- ✅ Cascade delete prevents orphaned records

## 🎨 User Interface

### Design Highlights
- **Admin:** Dark blue gradient theme (consistent with Phase 3)
- **Customer:** Purple/blue gradient (consistent with Phase 1)
- **Bill:** Professional receipt-style layout
- **Responsive:** Works on desktop, tablet, and mobile
- **Icons:** Emoji for visual quick-scanning
- **Status Badges:** Color-coded (yellow/blue/green)

### Color Scheme
- Pending: 🟡 #FFA500
- Accepted: 🔵 #0066CC
- Preparing: 🟡 #FFA500
- Ready: 🟢 #27AE60
- Completed: 🔵 #007BFF
- Bill Ready: ✅ Green highlight

## 📊 Data Model

### Orders Table
```
id: int (PK)
total_amount: int (initial order total)
final_amount: int (after bill generation)
status: varchar (pending/accepted/preparing/ready/completed)
bill_generated: boolean (true when billed)
created_at: timestamp
updated_at: timestamp
```

### Bills Table
```
id: int (PK)
order_id: int (FK to orders, UNIQUE)
final_amount: int (final billed amount)
created_at: timestamp
updated_at: timestamp
```

### Order Items Table (Modified)
```
id: int (PK)
order_id: int (FK)
product_id: int (FK)
quantity: int (can be modified before billing)
price: int (can be modified before billing)
created_at: timestamp
```

## 🧪 Testing Checklist

### Admin Testing
- [ ] Navigate to Orders tab
- [ ] Click "View" on pending order
- [ ] See order items and total amount
- [ ] Click "Generate Bill" button
- [ ] Modal opens with bill preview
- [ ] Edit quantity on item
- [ ] See total recalculate
- [ ] Edit price on item
- [ ] See total recalculate again
- [ ] Click "Generate Bill" button
- [ ] Success message shows Bill ID and final amount
- [ ] Order status changes to "ready" in table
- [ ] "Billed: Yes" badge shows in orders table
- [ ] Bill section shows in order details
- [ ] "Generate Bill" button disappears (bill already generated)

### Customer Testing
- [ ] Create test order from customer
- [ ] See order in pending status
- [ ] Click "📋 My Orders" button
- [ ] OrderHistory page loads
- [ ] See order card with correct details
- [ ] "Waiting for bill..." notice shows
- [ ] Generate bill from admin
- [ ] Refresh page or come back
- [ ] "View Bill" button appears
- [ ] Click "View Bill"
- [ ] Bill modal opens with receipt
- [ ] All items and amounts correct
- [ ] Click "Print Bill"
- [ ] PDF print dialog opens
- [ ] Close bill modal
- [ ] Back on order history page

### API Testing
```bash
# Generate Bill
curl -X POST http://localhost:5000/api/orders/1/generate-bill \
  -H "Content-Type: application/json" \
  -d '{"items":[{"product_id":1,"quantity":2,"price":50}]}'

# Get Bill Preview
curl http://localhost:5000/api/orders/1/bill-preview

# Get Bill Details
curl http://localhost:5000/api/orders/1/bill
```

## 🚀 Deployment Steps

1. **Update Database:**
   ```bash
   mysql -u root -p grocery_shop_db < backend/database.sql
   ```

2. **Restart Backend:**
   ```bash
   cd backend && npm run dev
   ```

3. **Ensure to Latest Code:**
   - All new files in src/admin/, src/components/, src/pages/
   - Updated files: src/App.js, src/components/Navbar.js, etc.

4. **Start Frontend:**
   ```bash
   npm start
   ```

5. **Test Workflow:**
   - Place order as customer
   - Generate bill as admin
   - View bill as customer

## 📝 Configuration

### API Base URL
Default: `http://localhost:5000`

To change, update all fetch calls in:
- `src/admin/BillGenerator.js`
- `src/components/CustomerBill.js`
- `src/pages/OrderHistory.js`
- `src/admin/Orders.js`

### Status Workflow
Valid statuses (change in orderController.js if needed):
```javascript
const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'completed'];
```

## 🔮 Future Enhancements (Phase 5)

- [ ] Add GST/tax calculation
- [ ] Add discount/coupon codes
- [ ] Add payment method selection
- [ ] Email bill to customer
- [ ] Print physical receipts
- [ ] Bill history and search
- [ ] Refund/adjustment notes
- [ ] Multi-item discount
- [ ] Loyalty points
- [ ] Estimated delivery time

## 🆘 Troubleshooting

### Frontend Issues

**Bill generator modal not opening:**
- Check console for errors (F12)
- Verify BillGenerator.js is imported in Orders.js
- Ensure all CSS files exist

**"View Bill" button not appearing:**
- Verify bill_generated field is TRUE in database
- Check that ORDER status is "ready" or "completed"
- Reload page to refresh data

**Orders not loading in customer page:**
- Ensure backend is running (`npm run dev` in backend folder)
- Check that GET /api/orders endpoint works
- Look at browser console for API errors

### Backend Issues

**Can't generate bill - "Bill already exists":**
- Bill was already generated for this order
- Try accessing /api/orders/:id/bill to verify

**Bill amount incorrect:**
- Check that prices in request match what you entered
- Verify database constraints aren't rejecting updates
- Check order_items table for correct values

**Database errors on bill generation:**
- Ensure bills table exists (run database.sql)
- Check that orders table has final_amount and bill_generated columns
- Verify foreign key constraints are correct

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review console errors and network tab
3. Verify database schema matches database.sql
4. Restart backend and frontend servers
5. Check that all files are created in correct locations

---

**Phase 4 Status:** ✅ Complete  
**Workflow Type:** Order First → Bill Later  
**Features:** Bill generation, customer bill viewing, print functionality  
**Security:** Server-side validation, transaction-based updates
