import React, { useReducer, useEffect } from 'react';
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

const Dashboard = () => {
    let navigate = useNavigate();

    let initial = {
        list: [],
        filterCountry: "",
        filterState: "",
        filterCity: "",
        editId: null,
        editName: "",
        editCountry: "",
        editState: "",
        editCity: ""
    };

    let reducer = (state, action) => {
        switch (action.key) {
            case 'setList':
                return { ...state, list: action.payload };
            case 'deleteUser':
                return { ...state, list: action.payload };
            case 'updateState':
                return { ...state, [action.payload.name]: action.payload.value };
            case 'changeFilterCountry':
                return { ...state, filterCountry: action.payload.value, filterState: "", filterCity: "" };
            case 'changeFilterState':
                return { ...state, filterState: action.payload.value, filterCity: "" };
            case 'loadUserForEdit':
                return {
                    ...state,
                    editId: action.payload.id,
                    editName: action.payload.name,
                    editCountry: action.payload.country,
                    editState: action.payload.state,
                    editCity: action.payload.city
                };
            case 'clearEdit':
                return {
                    ...state,
                    editId: null,
                    editName: "",
                    editCountry: "",
                    editState: "",
                    editCity: ""
                };
            case 'changeEditCountry':
                return { ...state, editCountry: action.payload.value, editState: "", editCity: "" };
            case 'changeEditState':
                return { ...state, editState: action.payload.value, editCity: "" };
            default:
                return state;
        }
    };

    let [state, dispatch] = useReducer(reducer, initial);

    useEffect(() => {
        let isAuth = localStorage.getItem('isAuthenticated');
        if (!isAuth) {
            navigate("/");
            return;
        }

        let savedUsers = JSON.parse(localStorage.getItem('users')) || [];
        dispatch({ key: 'setList', payload: savedUsers });
    }, [navigate]);

    let handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate("/");
    };

    let handleDelete = (id) => {
        let confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            let filteredList = state.list.filter((user) => user.id !== id);
            dispatch({ key: 'deleteUser', payload: filteredList });
            localStorage.setItem('users', JSON.stringify(filteredList));
        }
    };

    let handleSaveUpdate = (e) => {
        e.preventDefault();
        
        let updatedList = state.list.map((user) => {
            if (user.id === state.editId) {
                return {
                    ...user,
                    name: state.editName,
                    country: state.editCountry,
                    state: state.editState,
                    city: state.editCity
                };
            }
            return user;
        });

        localStorage.setItem('users', JSON.stringify(updatedList));
        dispatch({ key: 'setList', payload: updatedList });
        dispatch({ key: 'clearEdit' }); 
        alert("User Updated Successfully!");
    };

    let editStates = state.editCountry !== "" ? Object.keys(data[state.editCountry] || {}) : [];
    let editCities = state.editState !== "" && data[state.editCountry] ? data[state.editCountry][state.editState] || [] : [];

    let filterCountries = Object.keys(data);
    let filterStates = state.filterCountry !== "" ? Object.keys(data[state.filterCountry] || {}) : [];
    let filterCities = state.filterState !== "" && data[state.filterCountry] ? data[state.filterCountry][state.filterState] || [] : [];

    let filteredUsers = state.list.filter((user) => {
        let matchCountry = state.filterCountry === "" || user.country === state.filterCountry;
        let matchState = state.filterState === "" || user.state === state.filterState;
        let matchCity = state.filterCity === "" || user.city === state.filterCity;
        return matchCountry && matchState && matchCity;
    });

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>User Dashboard</h2>
                <button onClick={handleLogout} style={{ padding: "8px 15px", backgroundColor: "red", color: "white", border: "none", cursor: "pointer" }}>
                    Logout
                </button>
            </div>

            <hr style={{ margin: "20px 0" }} />

            {state.editId !== null && (
                <div style={{ border: "2px solid green", padding: "15px", marginBottom: "20px", backgroundColor: "#e6ffe6" }}>
                    <h3>Edit User: {state.editName}</h3>
                    <form onSubmit={handleSaveUpdate} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <input type="text" name="editName" value={state.editName} onChange={(e) => dispatch({ key: "updateState", payload: e.target })} style={{ padding: "5px" }} />
                        
                        <select name="editCountry" value={state.editCountry} onChange={(e) => dispatch({ key: 'changeEditCountry', payload: e.target })} style={{ padding: "5px" }}>
                            {Object.keys(data).map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <select name="editState" value={state.editState} onChange={(e) => dispatch({ key: 'changeEditState', payload: e.target })} style={{ padding: "5px" }}>
                            <option value="">Select State</option>
                            {editStates.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <select name="editCity" value={state.editCity} onChange={(e) => dispatch({ key: "updateState", payload: e.target })} style={{ padding: "5px" }}>
                            <option value="">Select City</option>
                            {editCities.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <button type="submit" style={{ padding: "5px 10px", backgroundColor: "green", color: "white", cursor: "pointer", border: "none" }}>Save</button>
                        <button type="button" onClick={() => dispatch({ key: 'clearEdit' })} style={{ padding: "5px 10px", cursor: "pointer" }}>Cancel</button>
                    </form>
                </div>
            )}

            <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
                <b>Filter By: </b>
                <select name="filterCountry" value={state.filterCountry} onChange={(e) => dispatch({ key: 'changeFilterCountry', payload: e.target })} style={{ padding: "5px" }}>
                    <option value="">All Countries</option>
                    {filterCountries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                <select name="filterState" value={state.filterState} onChange={(e) => dispatch({ key: 'changeFilterState', payload: e.target })} style={{ padding: "5px" }}>
                    <option value="">All States</option>
                    {filterStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                <select name="filterCity" value={state.filterCity} onChange={(e) => dispatch({ key: "updateState", payload: e.target })} style={{ padding: "5px" }}>
                    <option value="">All Cities</option>
                    {filterCities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                        <th style={{ border: "1px solid #ccc", padding: "10px" }}>Name</th>
                        <th style={{ border: "1px solid #ccc", padding: "10px" }}>Email</th>
                        <th style={{ border: "1px solid #ccc", padding: "10px" }}>Country</th>
                        <th style={{ border: "1px solid #ccc", padding: "10px" }}>State</th>
                        <th style={{ border: "1px solid #ccc", padding: "10px" }}>City</th>
                        <th style={{ border: "1px solid #ccc", padding: "10px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "10px", border: "1px solid #ccc" }}>
                                    No users found matching filters
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td style={{ border: "1px solid #ccc", padding: "10px" }}>{user.name}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "10px" }}>{user.email}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "10px" }}>{user.country}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "10px" }}>{user.state}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "10px" }}>{user.city}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                                        <button 
                                            onClick={() => dispatch({ key: 'loadUserForEdit', payload: user })} 
                                            style={{ marginRight: "5px", padding: "5px", cursor: "pointer", backgroundColor: "#e6f2ff", border: "1px solid blue" }}
                                        >
                                            Update
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleDelete(user.id)} 
                                            style={{ padding: "5px", cursor: "pointer", backgroundColor: "#ffcccc", border: "1px solid red" }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;