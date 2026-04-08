import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import './styles/App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="App">
      <Navbar cartCount={cartCount} />
      <main className="main-content">
        <Home />
      </main>
    </div>
  );
}

export default App;
