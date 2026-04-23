import { useState } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import "./App.css";
import products from "./data/products";

function App() {
  // Step 6: featured toggle (still optional from previous step)
  const [showSpecial, setShowSpecial] = useState(false);

  // Step 8: search state
  const [query, setQuery] = useState("");

  // Step 7: add to cart handler (stub)
  function handleAddToCart(product) {
    console.log("Added:", product.name);
  }

  // Step 8: filtering
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Header />
      <Hero />

      {/* Step 6 button */}
      <button onClick={() => setShowSpecial(!showSpecial)}>
        Show Today's Special
      </button>

      {/* Step 6 conditional product */}
      {showSpecial && (
        <ProductList
          products={[products[0]]}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Step 8 search */}
      <SearchBar value={query} onChange={setQuery} />

      {/* Step 9 product catalog */}
      <ProductList
        products={filteredProducts}
        onAddToCart={handleAddToCart}
      />

      <Footer />
    </>
  );
}

export default App;