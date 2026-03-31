import React, { useState, useEffect } from "react";
import styles from "../Component/Sides.module.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router";

const Pastas = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const { setFetching, menuVersion } = useCart();

    useEffect(() => {
        const fetchPastas = async () => {
            try {
                const response = await fetch('http://localhost:8080/practice/pastas', {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchPastas();
    }, [menuVersion]); // re-runs whenever admin adds a new item

    const handleSubmit = async (pasta) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please Login First");
                navigate("/login");
                return;
            }
            const response = await fetch('http://localhost:8080/practice/addcart', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    img: pasta.img,
                    prices: pasta.prices,
                    tittle: pasta.tittle,
                    menu: pasta.menu,
                    calories: pasta.calories,
                }),
            });
            if (response.status === 401) navigate('/login');
            setFetching(true);
        } catch (error) {
            console.log("Error adding to cart:", error);
        }
    };

    return (
        <div className={styles.container}>
            {data.map((pasta) => (
                <div key={pasta._id} className={styles.card}>
                    <img src={pasta.img} alt={pasta.tittle} className={styles.image} />
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <h3 className={styles.title}>{pasta.tittle}</h3>
                            {pasta.menu === "veg" && (
                                <img src="https://img.icons8.com/color/48/vegetarian-food-symbol.png" alt="veg" style={{ width: "20px", height: "20px" }} />
                            )}
                            {pasta.menu === "non-veg" && (
                                <img src="https://img.icons8.com/?size=100&id=61082&format=png&color=000000" alt="non-veg" style={{ width: "20px", height: "20px" }} />
                            )}
                        </div>
                        <p className={styles.calories}>{pasta.calories}</p>
                        <p className={styles.description}>{pasta.description}</p>
                        <p className={styles.price}>Price: ₹{pasta.prices}</p>
                        <button className={styles.addBtn} onClick={() => handleSubmit(pasta)}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Pastas;
