import { createContext, useState, useContext } from "react";

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [fetching, setFetching]       = useState(true);
    const [user, setUser]               = useState("/0");
    const [menuVersion, setMenuVersion] = useState(0); // increments on every new item added
    const [cartItems, setCartItems]     = useState([]);

    const triggerMenuRefresh = () => setMenuVersion((v) => v + 1);

    // Wipes the shared MongoDB cart collection and resets frontend state.
    // Must be called AFTER the token is saved to localStorage.
    const clearCart = async (token) => {
        try {
            await fetch("http://localhost:8080/practice/addcart", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({}), // no tittle → backend runs deleteMany({})
            });
        } catch (err) {
            console.error("Error clearing cart:", err);
        }
        setCartItems([]);   // reset UI immediately
        setFetching(false); // prevent AddToCart from re-fetching stale data
    };

    const getUserName = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token');

            const response = await fetch('http://localhost:8080/practice/getauthenticate', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch username');
            const data = await response.json();
            setUser(data.userName);
        } catch (error) {
            console.log('Server side error:');
        }
    };

    return (
        <CartContext.Provider value={{
            fetching, setFetching,
            user, setUser, getUserName,
            menuVersion, triggerMenuRefresh,
            cartItems, setCartItems,
            clearCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};
