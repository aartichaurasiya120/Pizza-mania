// Example: How to integrate order creation in your CheckOut component

import axios from 'axios';

// In your CheckOut.jsx component, after payment simulation:

const handlePlaceOrder = async () => {
    try {
        const token = localStorage.getItem('token'); // User token
        
        // Get cart items from your cart context/state
        // const cartItems = /* your cart items */;
        // const totalAmount = /* calculate total */;
        // const deliveryAddress = /* get from form */;

        const response = await axios.post(
            'http://localhost:8080/api/orders/create',
            {
                items: cartItems,
                totalAmount: totalAmount,
                deliveryAddress: deliveryAddress
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.data) {
            alert('Order placed successfully!');
            // Clear cart
            // Redirect to success page
        }
    } catch (error) {
        console.error('Order failed:', error);
        alert('Failed to place order');
    }
};

// Example cart items format:
/*
[
    {
        img: "/pizzas/margherita.jpg",
        tittle: "Margherita Pizza",
        calories: "250 cal",
        menu: "Pizza",
        prices: 299,
        count: 2
    }
]
*/
