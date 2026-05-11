import { useState } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import "./App.css";
import products from "./data/products";

function App() {
  // Step 6: featured toggle
  const [showSpecial, setShowSpecial] = useState(false);

  // Step 8: search query — lifted state
  const [query, setQuery] = useState("");

  // Step 7: add to cart handler
  function handleAddToCart(product) {
    console.log("Added:", product.name);
  }

  // Step 8: filter products by name, case-insensitive
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Header />
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
    </>
  );
}

export default App;