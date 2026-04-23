function ProductCard({ product, onAddToCart }) {
  const { image, name, price } = product;

  const formattedPrice = new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF"
  }).format(price);

  return (
    <div className="card">
  <img src={image} alt={name} />
  <div className="card-info">
    <h3>{name}</h3>
    <p className="price">$9.99</p>
  </div>
  <button className="add-btn">Add to Cart</button>
</div>
  );
}

export default ProductCard;