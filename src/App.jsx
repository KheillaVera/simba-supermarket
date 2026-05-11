import { useState, useEffect } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import CartModal from "./components/CartModal";
import "./App.css";
import products from "./data/products";

function App() {
  // Step 6: featured toggle
  const [showSpecial, setShowSpecial] = useState(false);

  // Step 8: search query — lifted state
  const [query, setQuery] = useState("");

  // Step 14: hydrate cart from localStorage on first render.
  // The function passed to useState runs once — if the key exists we parse
  // it, otherwise we start with an empty array.
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("simba-cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      // JSON.parse can throw if the value is somehow corrupted
      return [];
    }
  });

  // Step 13: modal open/close
  const [cartOpen, setCartOpen] = useState(false);

  // Step 14: keep localStorage in sync every time cart changes.
  // useEffect re-runs whenever [cart] changes — covers add, remove, qty bump.
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

  // Step 13: total item count for the header badge
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      {/* Step 13 — pass cartCount + open handler to Header */}
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <Hero />

      {/* Step 6 — Today's Special toggle */}
      <button
        className="special-btn"
        onClick={() => setShowSpecial(!showSpecial)}
      >
        {showSpecial ? "Hide Today's Special" : "Show Today's Special"}
      </button>

      {showSpecial && (
        <ProductList
          products={[products[0]]}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Step 8 — search with lifted state */}
      <SearchBar value={query} onChange={setQuery} />

      {/* Step 10 — empty state when filter has no matches */}
      {filteredProducts.length === 0 ? (
        <div className="empty">
          <p>No products match your search.</p>
          <button className="clear-btn" onClick={() => setQuery("")}>
            Clear search
          </button>
        </div>
      ) : (
        <ProductList
          products={filteredProducts}
          onAddToCart={handleAddToCart}
        />
      )}

      <Footer />

      {/* Step 13 — modal rendered via portal, only mounted when open */}
      {cartOpen && (
        <CartModal cart={cart} onClose={() => setCartOpen(false)} />
      )}
    </>
  );
}

export default App;