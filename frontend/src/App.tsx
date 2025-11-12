// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import TOS from './pages/TermsOfService';
import Cart from './pages/Cart';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/terms-of-service" element={<TOS />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;

// Note: You would create the Home, About, and Contact components in separate files.