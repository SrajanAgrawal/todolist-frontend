import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// const baseUrl = 'https://todolist-backend-production-a752.up.railway.app';
const baseUrl = 'https://todolist-backend-production-a752.up.railway.app';



const Register = () => {

    const [error, setError] = useState(null); // error handling
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cnfpassword, setCnfPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showCnfPassword, setShowCnfPassword] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setError(null);
        }, 3000);

        return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount
    }, [error]);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleCnfPassword = () => {
        setShowCnfPassword(!showCnfPassword);
    };
    const handleButtonClick = async (e) => {
        e.preventDefault();
        // reqular expression for name validation
        const isValidName = /^[a-zA-Z0-9]+$/.test(name);
        // reqular expression for email validation
        const isValidEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        // reqular expression for password validation
        // const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/.test(password);

        if (!isValidName) {
            setError("Name should contain only alphabets and numbers");
        }
        else if (name.length < 3 || name.length > 20) {
            setError("Name should be between 3 to 20 characters");
        }
        else if (password.length < 6 || password.length > 20) {
            setError("Password Must be 6-20 characters long");
        }

        else if (password !== cnfpassword) {
            setError("Password and Confirm Password should be same");
        }
        else if (!isValidEmail) {
            setError("Email is not valid");
        }


        else {
            try {
                const data = {
                    name: name.toUpperCase(),
                    email: email,
                    password: password
                };
                console.log(name + " " + email + " " + password)
                console.log(data);
                const response = await fetch(`${baseUrl}/add`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Check if the request was successful (status code 2xx)
                if (response.ok) {
                    const data = await response.text(); // Assuming the response is text
                    console.log(data);
                    navigate("/login");
                } else {
                    // If the server returns an error status code
                    const errorResponse = await response.json();
                    console.log(errorResponse.message);
                    // const d = await response.text().message;
                    // console.log(d);
                    setError(errorResponse.message);
                    throw new Error(`User ALready Exists ${response.status} - ${response.statusText}`);
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
    };


    return (
        <div style={styles.container}>
            <form onSubmit={handleButtonClick} style={styles.form}>
                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}
                <div>
                    <div style={styles.label}>
                        <input style={styles.input} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Username" />
                    </div>
                    <div style={styles.label}>
                        <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    </div>
                    <div style={styles.label}>
                        <div style={styles.passwordContainer}>
                            <input
                                style={styles.input}
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                            <span style={styles.eyeIcon} onClick={handleTogglePassword}>
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </span>
                        </div>
                    </div>
                    <div style={styles.label}>
                        <div style={styles.passwordContainer}>
                            <input
                                style={styles.input}
                                type={showCnfPassword ? "text" : "password"}
                                value={cnfpassword}
                                onChange={(e) => setCnfPassword(e.target.value)}
                                placeholder="Confirm Password"
                            />
                            <span style={styles.eyeIcon} onClick={handleToggleCnfPassword}>
                                {showCnfPassword ? "👁️" : "👁️‍🗨️"}
                            </span>
                        </div>
                    </div>

                </div>

                {(!name || !email || !password || !cnfpassword) ? (
                    <button style={styles.disabledButton} disabled>Loading...</button>
                ) : (
                    <button style={styles.button} type="submit" onClick={handleButtonClick}>Login</button>
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
        // textAlign: "left",
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
        width: "250px",
        cursor: "pointer",
    },
    disabledButton: {
        backgroundColor: "#ccc",
        color: "#666",
        border: "none",
        borderRadius: "5px",
        padding: "10px",
        margin: "10px",
        width: "250px",
    },
    error: {
        color: "red",
        marginBottom: "10px",
    },
    label: {
        display: "flex",
        flexDirection: "row",
        // justifyContent: "space-between",
        // alignItems: "center",
        // border: "1px solid black",
    },
    passwordContainer: {
        position: "relative",
    },
    eyeIcon: {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
    },
};

export default Register;