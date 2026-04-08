import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminPanel from './admin/AdminPanel';
import './styles/App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleAdminAccess = () => {
    setIsAdminMode(!isAdminMode);
  };

  if (isAdminMode) {
    return <AdminPanel onExit={handleAdminAccess} />;
  }

  return (
    <div className="App">
      <Navbar cartCount={cartCount} onAdminClick={handleAdminAccess} />
      <main className="main-content">
        <Home />
      </main>
    </div>
  );
}

export default App;
