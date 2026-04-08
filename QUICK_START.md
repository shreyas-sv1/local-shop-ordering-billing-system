# 🚀 Quick Start Guide

## Set Up the Project (5 minutes)

### Step 1: Open Terminal in Project Folder
Navigate to the `shop` directory:
```bash
cd c:\Users\Arunkumar\Desktop\shop
```

### Step 2: Install Dependencies
```bash
npm install
```
This will download and install all required packages (React, ReactDOM, and build tools).

### Step 3: Start the Development Server
```bash
npm start
```

### Step 4: View in Browser
- Browser will automatically open `http://localhost:3000`
- If not, manually open that URL

---

## 📱 Testing the Application

### Add Items to Cart
1. Click "Add to Cart" on any product
2. See the cart count increase in the navbar
3. Item appears in the cart sidebar

### Manage Cart
- Use **+** and **-** buttons to adjust quantities
- Click **Remove** to delete items
- Total price updates automatically

### Place an Order
1. Click **"Proceed to Checkout"** button
2. See order confirmation alert
3. Check browser console (F12) to see order details logged
4. Open DevTools → Application → LocalStorage to see saved order

---

## 📂 Project Structure

```
shop/
├── package.json          ← Project config & dependencies
├── README.md             ← Full documentation
├── QUICK_START.md        ← This file
├── .gitignore
│
├── public/
│   └── index.html        ← HTML template
│
└── src/
    ├── index.js          ← React entry point
    ├── App.js            ← Main component
    │
    ├── components/
    │   ├── Navbar.js     ← Top navigation bar
    │   ├── ProductCard.js ← Product display card
    │   └── Cart.js       ← Cart sidebar
    │
    ├── pages/
    │   ├── Home.js       ← Main shopping page
    │   └── Checkout.js   ← Checkout page
    │
    ├── data/
    │   └── products.js   ← Product list (static data)
    │
    └── styles/
        ├── index.css     ← Global styles
        ├── App.css
        ├── Navbar.css
        ├── ProductCard.css
        ├── Cart.css
        ├── Home.css
        └── Checkout.css
```

---

## 🎨 Key Features Implemented

✅ **Product Grid** - Clean, responsive product display  
✅ **Add to Cart** - Instant cart updates  
✅ **Cart Management** - Adjust quantities, remove items  
✅ **Dynamic Pricing** - Real-time total calculation  
✅ **Order Storage** - Saved to localStorage  
✅ **Responsive Design** - Works on all devices  
✅ **Modern UI** - Gradient buttons, smooth animations  

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Dependencies not found | Run `npm install` again |
| Port 3000 busy | Run `npm start -- --port 3001` |
| Module errors | Delete `node_modules`, run `npm install` |
| Blank page | Press F5 to refresh, check console for errors |

---

## 📝 Next Steps (Phase 2)

- Connect to backend API
- Add user authentication
- Implement real payment gateway
- Add order history
- Admin dashboard

---

**Status:** Phase 1 ✅ Complete  
**Ready to Run:** Yes  
**Time to Start:** < 5 minutes
