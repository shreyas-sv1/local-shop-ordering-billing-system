# Grocery Shop Ordering System - Frontend

A fully functional React-based frontend for a grocery shop ordering system where customers can browse items, add them to a cart, and place orders.

## Features

✅ **Product Listing** - Browse 6 grocery items with prices  
✅ **Shopping Cart** - Add/remove items, adjust quantities  
✅ **Dynamic Pricing** - Real-time total calculation  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Order Persistence** - Orders saved to localStorage  
✅ **Console Logging** - Order details logged for debugging  

## Project Structure

```
src/
 ├── components/
 │    ├── Navbar.js          # Navigation header with cart count
 │    ├── ProductCard.js     # Individual product card
 │    └── Cart.js            # Cart sidebar component
 │
 ├── pages/
 │    ├── Home.js            # Main shopping page
 │    └── Checkout.js        # Checkout page (future use)
 │
 ├── data/
 │    └── products.js        # Static product data
 │
 ├── styles/
 │    ├── index.css          # Global styles
 │    ├── App.css            # App layout
 │    ├── Navbar.css         # Navigation styles
 │    ├── ProductCard.css    # Product card styles
 │    ├── Cart.css           # Cart styles
 │    ├── Home.css           # Home page layout
 │    └── Checkout.css       # Checkout styles
 │
 ├── App.js                  # Main App component
 └── index.js                # React entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd shop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Application

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Open your browser:**
   - The app will automatically open at `http://localhost:3000`
   - If not, manually navigate to that URL

## How to Use

### Adding Items to Cart
1. Browse the product grid on the home page
2. Click "Add to Cart" on any product
3. Watch the cart count in the navbar increase

### Managing Cart Items
- **Increase Quantity:** Click the "+" button
- **Decrease Quantity:** Click the "-" button
- **Remove Item:** Click the "Remove" button

### Placing an Order
1. Click "Proceed to Checkout" in the cart sidebar
2. Review the order summary
3. An alert confirms the order was placed
4. Order details are:
   - Saved to `localStorage` (accessible via browser DevTools)
   - Logged to browser console
5. Cart is cleared after order placement

## Products Available

| Product | Price |
|---------|-------|
| Milk (1L) | ₹50 |
| Bread | ₹40 |
| Eggs (1 piece) | ₹6 |
| Rice (1kg) | ₹70 |
| Tomato (1kg) | ₹30 |
| Onion (1kg) | ₹35 |

## Technology Stack

- **React** - UI library
- **CSS3** - Styling with gradients and animations
- **React Hooks** - State management (useState)
- **localStorage** - Client-side data persistence

## Features to Note

### State Management
- Uses React's `useState` hook for cart management
- No external state management library required
- Local state updates trigger instant UI re-renders

### Data Persistence
- Orders are saved to browser's `localStorage`
- Retrieve last order: Open DevTools → Storage → localStorage
- Key: `lastOrder`

### Responsive Design
- Mobile-first approach
- Grid layout adapts to screen size
- Touch-friendly button sizes
- Works on all modern browsers

### Styling Highlights
- Modern gradient backgrounds
- Smooth hover animations
- Box shadows for depth
- Media queries for responsive breakpoints

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

### Port 3000 already in use
```bash
npm start -- --port 3001
```

### Module not found error
```bash
npm install
```

### Clear cache and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

## Development

### Redux migration (future)
The current hook-based state can be easily migrated to Redux when connecting to backend.

### API Integration (Phase 2)
Replace static `products.js` data with API calls:
```javascript
useEffect(() => {
  fetch('/api/products')
    .then(res => res.json())
    .then(data => setProducts(data));
}, []);
```

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, check the console and DevTools for error messages.

---

**Created:** April 2026  
**Version:** 1.0.0 - Phase 1 Complete
