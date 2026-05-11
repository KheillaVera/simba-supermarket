import { useState, useEffect } from "react";

const TestFunction = () => { // Components should start with a Capital Letter
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Fixed typo: "laoding" -> "loading"

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://192.168.1.95:5000/products");
                
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                // This runs whether the try succeeded OR the catch ran
                setLoading(false); 
            }
        };

        fetchProducts();
    }, []);

    // Remember to return your JSX here!
    return (
        <div>
            {loading ? <p>Loading...</p> : (
                <ul>    
                    {products.map(product => (
                        <li key={product.id}>{product.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TestFunction;