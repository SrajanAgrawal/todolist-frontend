import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'

const Login = () => {
    const baseUrl = 'https://todolist-backend-production-a752.up.railway.app';
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setError(null);
        }, 3000);

        return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount
    }, [error]);

    const userLoginButtonHandler = async (e) => {
        e.preventDefault();
        const isValidEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        if (!isValidEmail) {
            setError("Invalid email");
            return;
        }
        try {
            const data = {
                email: email,
                password: password
            };
            const response = await fetch(`${baseUrl}/login`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data1 = await response.text();
                const decodedToken = jwtDecode(data1);
                localStorage.setItem('token', data1);
                navigate("/dashboard", { state: { name: decodedToken.sub } });
            } else {
                const data1 = await response.json();
                setError(data1.message);
                throw new Error(`${data1.message}`);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={userLoginButtonHandler} style={styles.form}>
                {error && <div style={styles.error}>{error}</div>}
                <input style={styles.input} required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input style={styles.input} required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                {(!email || !password) ? (
                    <button style={styles.disabledButton} disabled>Loading...</button>
                ) : (
                    <button style={styles.button} type="submit" onClick={userLoginButtonHandler}>Login</button>
                )}
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    input: {
        outline: "none", // Remove outline
        border: "none",
        borderBottom: "1px solid #ccc", // Initial border style
        borderRadius: "0", // Remove border-radius to avoid rounded corners
        padding: "10px",
        margin: "10px",
        width: "300px",
        transition: "border-bottom 0.3s ease", // Add transition for smooth effect


    },
    button: {
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        padding: "10px",
        margin: "10px",
        width: "200px",
        cursor: "pointer",
    },
    disabledButton: {
        backgroundColor: "#ccc",
        color: "#666",
        border: "none",
        borderRadius: "5px",
        padding: "10px",
        margin: "10px",
        width: "200px",
    },
    error: {
        color: "red",
        marginBottom: "10px",
    },
};

export default Login;
