import React, { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    let navigate = useNavigate();

    let initial = {
        email: "",
        password: ""
    };

    let reducer = (state, action) => {
        switch (action.key) {
            case 'updateState':
                return { ...state, [action.payload.name]: action.payload.value };
            default:
                return state;
        }
    };

    let [state, dispatch] = useReducer(reducer, initial);

    let handleChange = (e) => {
        dispatch({ key: "updateState", payload: e.target });
    };

    let handleSubmit = (e) => {
        e.preventDefault(); 

        if (state.email === "" || state.password === "") {
            alert("Please enter both email and password!");
            return;
        }

        let existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        let validUser = existingUsers.find(
            (user) => user.email === state.email && user.password === state.password
        );

        if (validUser) {
            localStorage.setItem("isAuthenticated", "true");
            navigate("/dashboard");
        } else {
            alert("Invalid Email or Password");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "400px" }}>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    name="email" 
                    value={state.email} 
                    onChange={handleChange} 
                    placeholder="Email" 
                    style={{ display: "block", marginBottom: "10px", padding: "5px", width: "100%" }} 
                />
                
                <input 
                    type="password" 
                    name="password" 
                    value={state.password} 
                    onChange={handleChange} 
                    placeholder="Password" 
                    style={{ display: "block", marginBottom: "10px", padding: "5px", width: "100%" }} 
                />

                <button type="submit" style={{ padding: "10px", backgroundColor: "green", color: "white", cursor: "pointer", border: "none", width: "100%" }}>
                    Login
                </button>
            </form>
            
            <p style={{ marginTop: "20px" }}>
                Don't have an account? 
                <button onClick={() => navigate("/register")} style={{ marginLeft: "10px", padding: "5px", cursor: "pointer" }}>
                    Register Here
                </button>
            </p>
        </div>
    );
};

export default Login;