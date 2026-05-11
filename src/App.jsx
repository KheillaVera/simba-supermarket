import { useState, useEffect } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import CartModal from "./components/CartModal";
import "./App.css";

// Step 15 — real mockapi.io endpoint
const API_URL =
  "https://6a017e1936fb6ad04de1049a.mockapi.io/api/v1/products";

// Real product images + inStock mapped by position
// mockapi generates fake data so we override image + inStock locally
const IMAGE_OVERRIDES = [
  { image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=300&fit=crop", inStock: true  }, // apples
  { image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop", inStock: true  }, // milk
  { image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop", inStock: true  }, // bread
  { image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=300&fit=crop", inStock: true  }, // mangoes
  { image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop", inStock: true  }, // tomatoes
  { image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=300&fit=crop", inStock: true  }, // rice
  { image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop", inStock: true  }, // eggs
  { image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop", inStock: true  }, // avocados
  { image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop", inStock: false }, // OJ
  { image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop", inStock: true  }, // bananas
  { image: "https://images.unsplash.com/photo-1488477181228-c84dde9b4ec4?w=400&h=300&fit=crop", inStock: false }, // yogurt
  { image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop", inStock: true  }, // spinach
];

function App() {
  const [showSpecial, setShowSpecial] = useState(false);
  const [query, setQuery]             = useState("");

  // Step 14: hydrate cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("simba-cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen]   = useState(false);

  // Step 15: async data states
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // Step 15: fetch on mount — only take first 12, merge real images
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Server error: ${res.status} ${res.statusText}`);

      const data = await res.json();

      // Take only 12 items, patch in our real images + inStock values
      const patched = data.slice(0, 12).map((item, i) => ({
        ...item,
        name:    item.name,
        price:   Math.floor(Math.random() * 4000) + 500, // RWF range
        image:   IMAGE_OVERRIDES[i]?.image   ?? item.image,
        inStock: IMAGE_OVERRIDES[i]?.inStock ?? true,
      }));

      setProducts(patched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Step 14: persist cart
  useEffect(() => {
    localStorage.setItem("simba-cart", JSON.stringify(cart));
  }, [cart]);

  // Step 13: add to cart
  function handleAddToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        { id: product.id, name: product.name, price: product.price, qty: 1 },
      ];
    });
  }

  // Step 8: filter
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  function renderCatalog() {
    if (loading) {
      return (
        <div className="spinner-wrap">
          <div className="spinner" aria-label="Loading products…" />
          <p className="spinner-text">Loading fresh products…</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-wrap">
          <p className="error-icon">🛒</p>
          <p className="error-title">Couldn't load products</p>
          <p className="error-msg">{error}</p>
          <button className="retry-btn" onClick={fetchProducts}>
            Try again
          </button>
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <div className="empty">
          <p>No products match your search.</p>
          <button className="clear-btn" onClick={() => setQuery("")}>
            Clear search
          </button>
        </div>
      );
    }

    return (
      <ProductList products={filteredProducts} onAddToCart={handleAddToCart} />
    );
  }

  return (
    <>
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <Hero />

      <button
        className="special-btn"
        onClick={() => setShowSpecial(!showSpecial)}
      >
        {showSpecial ? "Hide Today's Special" : "Show Today's Special"}
      </button>

      {showSpecial && !loading && !error && products.length > 0 && (
        <ProductList products={[products[0]]} onAddToCart={handleAddToCart} />
      )}

      <SearchBar value={query} onChange={setQuery} />

      {renderCatalog()}

      <Footer />

      {cartOpen && (
        <CartModal cart={cart} onClose={() => setCartOpen(false)} />
      )}
    </>
  );
}

export default App;