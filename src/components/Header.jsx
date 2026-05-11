function Header({ cartCount, onCartOpen }) {
  return (
    <header>
      <h2>Simba Supermarket</h2>

      {/* Step 13 — cart button lives in header, state lives in App */}
      <button className="cart-btn" onClick={onCartOpen}>
        🛒 Cart ({cartCount})
      </button>
    </header>
  );
}

export default Header;