import React, { useState, useEffect } from 'react'; // 👈 Import hooks
import Header from "../Header";
import Footer from "../Footer";
import { getCookieValue, setCookieValue } from "../../../cookieFuncs";

// --- Types ---

interface Item {
    _id: number; // Item ID
    name: string;
    imageLink: string;
    description: string;
    usdCentsPrice: number;
}

interface ProductListProps {
    productsUrl: string;
}

// --- API Function (Optimized) ---

async function addToCart(itemId: number): Promise<boolean> {
    let cartId = Number(getCookieValue("cartId"));
    if (cartId == 0 || Number.isNaN(cartId)) {
      const response = await fetch("http://localhost:3000/get-cart");
      if (!response.ok || !response.body) {
        console.log("Could not get a cart");
        return false;
      }
      cartId = Number(await response.text());
      if (Number.isNaN(cartId)) {
        console.log("Server returned an invalid cart ID.");
        return false;
      }
      setCookieValue("cartId",cartId,14);
    }

    // Use environment variable or relative path in production
    const url = 'http://localhost:3000/add-to-cart'; 
    const data = {
        itemID: itemId,
        itemCount: 1,
        cartId: cartId
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // The key fix: Check response.ok for 2xx status codes
        // and check for the specific 201 status if required by your API.
        if (response.ok && response.status === 201) {
            return true;
        }

        // Handle other non-success status codes (e.g., 400, 404, 500)
        console.error(`Add to Cart failed with status: ${response.status}`);
        return false;

    } catch (error) {
        // Handle network errors (e.g., cannot connect to server)
        console.error('Error during POST request:', error);
        return false;
    }
}

// --- ProductList Component (Refactored to use State) ---

const ProductList: React.FC<ProductListProps> = ({ productsUrl }) => {
    // 1. Initialize state for data and loading/error status
    const [products, setProducts] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // New State: To store feedback (success/error) for a specific item
    // Key: itemId, Value: 'success' or 'error'
    const [feedback, setFeedback] = useState<Record<number, 'success' | 'error'>>({});

    // 2. Data Fetching Effect (Remains the same)
    useEffect(() => {
        // ... (fetchProducts function remains the same as in your original code)
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(productsUrl);

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }

                const data: Item[] = await response.json();
                setProducts(data);
            } catch (err: any) {
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
        setFeedback(prev => ({ ...prev, [itemId]: undefined }));

        const result = await addToCart(itemId);
        
        if (result) {
            setFeedback(prev => ({ ...prev, [itemId]: 'success' }));
            // Optional: Hide success message after a few seconds
            setTimeout(() => {
                setFeedback(prev => ({ ...prev, [itemId]: undefined }));
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

    // 5. Render the list (FIXED UI)
    return (
        <div className="product-container">
            <h2>🛒 Product List</h2>
            <ul>
                {products.map((item) => {
                    const itemFeedback = feedback[item._id];
                    return (
                        // Removed data-key attribute, not needed for React components
                        <li key={item._id}>
                            <img src={"./" + item.imageLink} /><br /><br />
                            <strong>{item.name}</strong> - {item.description} - ${item.usdCentsPrice / 100} <br /><br />
                            
                            <button onClick={() => handleClick(item._id)}>Add to cart</button>
                            
                            {/* Display feedback based on state */}
                            {itemFeedback === 'success' && (
                                <span className="success" style={{ color: 'green', marginLeft: '10px' }}>
                                    Added to cart!
                                </span>
                            )}
                            {itemFeedback === 'error' && (
                                <span className="error" style={{ color: 'red', marginLeft: '10px' }}>
                                    Could not add to cart
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

// --- Products Component (No changes needed) ---

function Products() {
    const apiUrl = "http://localhost:3000/get-items";

    return (
        <>
            <Header />
            <div>
                <h1 className={"top-title"}>HLM Products</h1>
                <div className={"centered"}>
                    <ProductList productsUrl={apiUrl} />
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Products;