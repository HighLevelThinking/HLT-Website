import Header from "../Header";
import Footer from "../Footer";

function ProductList({ products:Ob }) {
  return (
    <div className="product-container">
      <h2>🛒 Product Catalog</h2>
      <ul>
        {/* The .map() function iterates over the array */}
        {products.map(product => (
          // For each item, return a JSX element (e.g., an <li>).
          // **The 'key' prop is mandatory for list items in React.**
          <li key={product._id}>
            <strong>ID:</strong> {product._id} | 
            <strong> Name:</strong> {product.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Products() {

  return (
    <>
      <Header />

      <div>
        <h1 className={"top-title"}>HLM Products</h1>
        <div className={"centered"}>
            <h2>Wooden Items</h2>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Products;