import React, { useState, useEffect } from 'react'; // 👈 Import hooks
import Header from "../Header";
import Footer from "../Footer";

// --- Types ---

interface Item {
    _id: number;
    name: string;
}

interface ProductListProps {
    productsUrl: string;
}

// --- ProductList Component (Synchronous) ---

const ProductList: React.FC<ProductListProps> = ({ productsUrl }) => {
  // 1. Initialize state for data and loading/error status
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Use useEffect for the side effect (data fetching)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(productsUrl);

        if (!response.ok) {
          // Check for HTTP errors (e.g., 404, 500)
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data: Item[] = await response.json();
        setProducts(data);
      } catch (err: any) {
        // Catch network errors (e.g., 'Failed to fetch')
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

        fetchProducts();
    }, [productsUrl]);

    // 3. HandleClick function (FIXED)
    const handleClick = async (itemId: number) => {
        // Clear previous feedback for this item immediately

        const result = await addToCart(itemId);
        
        if (result) {
            setFeedback(prev => ({ ...prev, [itemId]: 'success' }));
            // Optional: Hide success message after a few seconds
            setTimeout(() => {
            }, 3000);
        } else {
            setFeedback(prev => ({ ...prev, [itemId]: 'error' }));
        }
    };

    // 4. Handle loading and error states in the render output
    if (loading) {
        return <div className="centered">Loading products...</div>;
    }

  if (error) {
    return <div className="centered" style={{ color: 'red' }}>Error: {error}</div>;
  }

  // 4. Render the list once data is available
  return (
    <div className="product-container">
      <h2>🛒 Product List</h2>
      <ul>
        {products.map((item) => (
          <li key={item._id}>
            <strong>ID:</strong> {item._id} | 
            <strong> Name:</strong> {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Products Component ---

function Products() {

  // Define the product URL here
  const apiUrl = "http://localhost:3000/get-items";

  return (
    <>
      <Header />

      <div>
        <h1 className={"top-title"}>HLM Products</h1>
        <div className={"centered"}> 
            {/* Pass the URL as a prop */}
            <ProductList productsUrl={apiUrl} />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Products;