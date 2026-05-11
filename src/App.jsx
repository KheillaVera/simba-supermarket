import { useState, useEffect } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import CartModal from "./components/CartModal";
import "./App.css";

// Step 15 — paste your mockapi.io endpoint here after creating it
// e.g. "https://64a1b2c3d.mockapi.io/api/v1/products"
const API_URL = "https://YOUR_ID.mockapi.io/api/v1/products";

function App() {
  // Step 6: featured toggle
  const [showSpecial, setShowSpecial] = useState(false);

  // Step 8: search query — lifted state
  const [query, setQuery] = useState("");

  // Step 14: cart — hydrated from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("simba-cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Step 13: modal open/close
  const [cartOpen, setCartOpen] = useState(false);

  // Step 15: three states for async data
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // Step 15: fetch products from mockapi on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API_URL);

        // fetch() doesn't throw on 4xx/5xx — check manually
        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        // always stop the spinner whether it succeeded or failed
        setLoading(false);
      }
    }

    fetchProducts();
  }, []); // empty array = run once on mount only

  // Step 14: sync cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem("simba-cart", JSON.stringify(cart));
  }, [cart]);

  // Step 13: add to cart — bump qty if exists, else push new entry
  function handleAddToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [
        ...prev,
        { id: product.id, name: product.name, price: product.price, qty: 1 },
      ];
    });
  }

  // Step 8: filter products by name, case-insensitive
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  // Step 13: total item count for header badge
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // ── Render helpers ──────────────────────────────────────────

  // Step 15: spinner while loading
  function renderCatalog() {
    if (loading) {
      return (
        <div className="spinner-wrap">
          <div className="spinner" aria-label="Loading products…" />
          <p className="spinner-text">Loading fresh products…</p>
        </div>
      );
    }

    // Step 15: friendly error state with retry button
    if (error) {
      return (
        <div className="error-wrap">
          <p className="error-icon">🛒</p>
          <p className="error-title">Couldn't load products</p>
          <p className="error-msg">{error}</p>
          <button
            className="retry-btn"
            onClick={() => {
              setError(null);
              setLoading(true);
              fetch(API_URL)
                .then((r) => {
                  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
                  return r.json();
                })
                .then(setProducts)
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    // Step 10: empty search state
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
      <ProductList
        products={filteredProducts}
        onAddToCart={handleAddToCart}
      />
    );
  }

  return (
    <>
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <Hero />

      {/* Step 6 — Today's Special toggle */}
      <button
        className="special-btn"
        onClick={() => setShowSpecial(!showSpecial)}
      >
        {showSpecial ? "Hide Today's Special" : "Show Today's Special"}
      </button>

      {showSpecial && !loading && !error && products.length > 0 && (
        <ProductList
          products={[products[0]]}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Step 8 — search */}
      <SearchBar value={query} onChange={setQuery} />

      {/* Step 15 — loading / error / catalog */}
      {renderCatalog()}

      <Footer />

      {cartOpen && (
        <CartModal cart={cart} onClose={() => setCartOpen(false)} />
      )}
    </>
  );
}

export default App;