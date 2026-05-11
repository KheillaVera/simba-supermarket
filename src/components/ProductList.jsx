import ProductCard from "./ProductCard";

function ProductList({ products, onAddToCart }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}        // ✅ always id, never index
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default ProductList;