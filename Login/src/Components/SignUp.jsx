import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Component/SignUp.module.css";
import { useCart } from "../context/CartContext";

const SignUp = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [message, setMessage] = useState("");

    const { setUser, setFetching } = useCart();
    const navigate = useNavigate();

    const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const securityRegex = /^[a-zA-Z\s]+$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        

        if (!usernameRegex.test(userName)) {
            return setMessage(
                "Username must be at least 3 characters and contain only letters & numbers."
            );
        }

        if (!passwordRegex.test(password)) {
            return setMessage(
                "Password must be minimum 6 characters with at least 1 uppercase letter and 1 number."
            );
        }

        if (!phoneRegex.test(phone)) {
            return setMessage("Phone number must be exactly 10 digits.");
        }

        if (!emailRegex.test(email)) {
            return setMessage("Please enter a valid email address.");
        }

        if (!address.trim()) {
            return setMessage("Address cannot be empty.");
        }

        if (!securityRegex.test(securityAnswer)) {
            return setMessage(
                "Security answer must contain only letters."
            );
        }


        try {
            const response = await fetch(
                "http://localhost:8080/practice/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userName,
                        password,
                        phone,
                        email,
                        address,
                        securityAnswer,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);

                setUser(userName);
                setFetching(true);

                localStorage.setItem("token", data.token);

                navigate("/login");
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Error submitting form");
            }
        } catch (error) {
            setMessage("Server error. Please try again later.");
            console.error(error);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Signup Form</h2>

            {message && <p className={styles.error}>{message}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>
                
                {/* Username */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Username:</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className={styles.input}
                        placeholder="Enter your username"
                        required
                    />
                </div>

                {/* Password */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {/* Phone */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Phone:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => {
                            const onlyNumbers = e.target.value.replace(/\D/g, "");
                            setPhone(onlyNumbers);
                        }}
                        className={styles.input}
                        placeholder="Enter your phone number"
                        maxLength={10}
                        required
                    />
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                {/* Address */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Address:</label>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={styles.textarea}
                        placeholder="Enter your address"
                        required
                    />
                </div>

                {/* Security Question */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        What is your pet's name?
                    </label>
                    <input
                        type="text"
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                        className={styles.input}
                        placeholder="Answer the security question"
                        required
                    />
                </div>

                <button type="submit" className={styles.button}>
                    Submit
                </button>
            </form>

            <div className={styles.login}>
                <Link to="/login" className={styles.link}>
                    Already have an account? Login
                </Link>
            </div>
        </div>
    );
};

export default SignUp;
