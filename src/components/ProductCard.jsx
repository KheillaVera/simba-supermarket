function ProductCard({ product, onAddToCart }) {
  const { image, name, price, inStock } = product;

  const formattedPrice = new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div className={`product-card ${!inStock ? "out-of-stock" : ""}`}>
      {/* Step 10 — red badge when out of stock */}
      {!inStock && <span className="badge-out-of-stock">Out of stock</span>}

      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p className="price">{formattedPrice}</p>

      {/* Step 10 — disabled when not in stock */}
      <button
        className="add-btn"
        onClick={() => onAddToCart(product)}
        disabled={!inStock}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;