import React, { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

const data = {
    "India":{"Maharashtra":["Pune","Nashik","Mumbai","Nagpur","Ahilyanagar"],
             "Gujrat":["Surat","Ahmedabad","Gandhinagar"],
             "Karnataka":["Banglore","Mysore","Belgavi","Hubli"],
             "Goa":["Panjim","Ponda","Mapusa"]
    },
    "USA":{"Washington":["Olympia","Seattle"],
           "Texas":["Austin","Hostan"],
           "New York":["New York City", "Albany"]
    }
};

const Register = () => {
    let navigate = useNavigate();

    let initial = {
        name: "",
        email: "",
        password: "",
        country: "",
        state: "",
        city: ""
    };

    let reducer = (state, action) => {
        switch (action.key) {
            case 'updateState':
                return { ...state, [action.payload.name]: action.payload.value };
            case 'changeCountry':
                return { ...state, country: action.payload.value, state: "", city: "" };
            case 'changeState':
                return { ...state, state: action.payload.value, city: "" };
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

        if (state.name === "" || state.email === "" || state.password === "" || state.country === "" || state.state === "" || state.city === "") {
            alert("Please fill all the fields!");
            return;
        }

        let existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        let isEmailUsed = existingUsers.find((user) => user.email === state.email);
        if (isEmailUsed) {
            alert("This email is already registered!");
            return;
        }

        let newUser = {
            id: Date.now(),
            name: state.name,
            email: state.email,
            password: state.password,
            country: state.country,
            state: state.state,
            city: state.city
        };

        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        alert("Registration Successful!");
        navigate("/"); 
    };

    let availableCountries = Object.keys(data);
    let availableStates = state.country !== "" ? Object.keys(data[state.country]) : [];
    let availableCities = state.state !== "" ? data[state.country][state.state] : [];

    return (
        <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "400px" }}>
            <h2>Register</h2>
            
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={state.name} onChange={handleChange} placeholder="Name" style={{ display: "block", marginBottom: "10px", padding: "5px", width: "100%" }} />
                <input type="email" name="email" value={state.email} onChange={handleChange} placeholder="Email" style={{ display: "block", marginBottom: "10px", padding: "5px", width: "100%" }} />
                <input type="password" name="password" value={state.password} onChange={handleChange} placeholder="Password" style={{ display: "block", marginBottom: "10px", padding: "5px", width: "100%" }} />

                <select name="country" value={state.country} onChange={(e) => dispatch({ key: 'changeCountry', payload: e.target })} style={{ display: "block", marginBottom: "10px", padding: "5px", width: "100%" }}>
                    <option value="">Select Country</option>
                    {availableCountries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <select name="state" value={state.state} onChange={(e) => dispatch({ key: 'changeState', payload: e.target })} style={{ display: "block", marginBottom: "10px", padding: "5px", width: "100%" }}>
                    <option value="">Select State</option>
                    {availableStates.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select name="city" value={state.city} onChange={handleChange} style={{ display: "block", marginBottom: "10px", padding: "5px", width: "100%" }}>
                    <option value="">Select City</option>
                    {availableCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>

                <button type="submit" style={{ padding: "10px", backgroundColor: "blue", color: "white", cursor: "pointer", width: "100%", border: "none" }}>
                    Register
                </button>
            </form>
            
            <p style={{ marginTop: "20px" }}>
                Already have an account? 
                <button onClick={() => navigate("/")} style={{ marginLeft: "10px", padding: "5px", cursor: "pointer" }}>
                    Login Here
                </button>
            </p>
        </div>
    );
};

export default Register;