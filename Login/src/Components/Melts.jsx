import React, { useState, useEffect } from "react";
import styles from "../Component/Melts.module.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router";

const Melts = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const { setFetching, menuVersion } = useCart();

    useEffect(() => {
        const fetchMelts = async () => {
            try {
                const response = await fetch('http://localhost:8080/practice/melts', {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching melts data:", error);
            }
        };
        fetchMelts();
    }, [menuVersion]); // re-runs whenever admin adds a new item

    const handleSubmit = async (melt) => {
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
                    img: melt.img,
                    prices: melt.prices,
                    tittle: melt.tittle,
                    menu: melt.menu,
                    calories: melt.calories,
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
            {data.map((melt) => (
                <div key={melt._id} className={styles.card}>
                    <img src={melt.img} alt={melt.tittle} className={styles.image} />
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <h3 className={styles.title}>{melt.tittle}</h3>
                            {melt.menu === "veg" && (
                                <img src="https://img.icons8.com/color/48/vegetarian-food-symbol.png" alt="veg" style={{ width: "20px", height: "20px" }} />
                            )}
                            {melt.menu === "non-veg" && (
                                <img src="https://img.icons8.com/?size=100&id=61082&format=png&color=000000" alt="non-veg" style={{ width: "20px", height: "20px" }} />
                            )}
                        </div>
                        <p className={styles.calories}>{melt.calories}</p>
                        <p className={styles.description}>{melt.description}</p>
                        <p className={styles.price}>Price: ₹{melt.prices}</p>
                        <button className={styles.addBtn} onClick={() => handleSubmit(melt)}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Melts;
