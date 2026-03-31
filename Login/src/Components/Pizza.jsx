import React, { useState, useEffect } from "react";
import styles from "../Component/Pizza.module.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router";

const PizzaCard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState({});
    const { setFetching, menuVersion } = useCart();

    useEffect(() => {
        const fetchPizzas = async () => {
            try {
                const response = await fetch('http://localhost:8080/practice/pizzas', {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const result = await response.json();
                setData(result);

                // Merge: keep existing selections, set default only for newly added pizzas
                setSelectedSizes((prev) => {
                    const merged = { ...prev };
                    result.forEach((pizza) => {
                        if (!merged[pizza._id]) {
                            const firstKey = Object.keys(pizza.prices)[0];
                            merged[pizza._id] = firstKey;
                        }
                    });
                    return merged;
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchPizzas();
    }, [menuVersion]); // re-runs whenever admin adds a new item

    const handleSubmit = async (pizza) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please Login First");
                navigate("/login");
                return;
            }
            const size  = selectedSizes[pizza._id];
            const price = pizza.prices[size];
            const response = await fetch('http://localhost:8080/practice/addcart', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    img: pizza.img,
                    prices: price,
                    tittle: pizza.tittle,
                    menu: pizza.menu,
                    calories: pizza.calories,
                }),
            });
            if (response.status === 401) navigate('/login');
            setFetching(true);
        } catch (error) {
            console.log("Error adding to cart:", error);
        }
    };

    const handleSizeChange = (id, size) => {
        setSelectedSizes({ ...selectedSizes, [id]: size });
    };

    return (
        <div className={styles.container}>
            {data.map((pizza) => (
                <div key={pizza._id} className={styles.card}>
                    <img src={pizza.img} alt={pizza.tittle} className={styles.image} />
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <h3 className={styles.title}>{pizza.tittle}</h3>
                            {pizza.menu === "veg" && (
                                <img src="https://img.icons8.com/color/48/vegetarian-food-symbol.png" alt="veg" style={{ width: "20px", height: "20px" }} />
                            )}
                            {pizza.menu === "non-veg" && (
                                <img src="https://img.icons8.com/?size=100&id=61082&format=png&color=000000" alt="non-veg" style={{ width: "20px", height: "20px" }} />
                            )}
                        </div>

                        <p className={styles.calories}>{pizza.calories}</p>
                        <p className={styles.description}>{pizza.description}</p>

                        <label htmlFor={`size-${pizza._id}`} style={{ marginRight: "10px" }}>
                            Select your size & crust
                        </label>
                        <select
                            id={`size-${pizza._id}`}
                            value={selectedSizes[pizza._id] || ''}
                            onChange={(e) => handleSizeChange(pizza._id, e.target.value)}
                            style={{ padding: "5px", borderRadius: "5px" }}
                        >
                            {Object.keys(pizza.prices).map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>

                        <p className={styles.price}>
                            Price: ₹{pizza.prices[selectedSizes[pizza._id]]}
                        </p>

                        <button className={styles.addBtn} onClick={() => handleSubmit(pizza)}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PizzaCard;
