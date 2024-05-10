import "../../frontend/components/Navbar.css";
import React, { Component } from "react";
import { MenuItems } from "./MenuItems";
import { Link } from "react-router-dom";
import Seazone from "../../assets/Seazone.svg";
import "../../frontend/components/navscroll.js";

class Navbar extends Component {
    state = { clicked: false };
    handleClick = () => {
        this.setState({ clicked: !this.state.clicked });
    };


    render() {
        // Retrieve the full name from session storage
        // Retrieve the full name from session storage
        const storedFullName = sessionStorage.getItem('fullName');
        const storeduser_type = sessionStorage.getItem('user_type');
        const loginOrLogout = storedFullName ? 'Logout' : 'Login';
        var welcomeh2 = "";

        function checkLogin() {
            if (loginOrLogout === 'Logout') {
                sessionStorage.clear();
                window.location.href = '/';
            } else {
                window.location.href = "/login"
            }
        }

        

        function welcomeh() {
            if (storedFullName === null) {
                welcomeh2 = "";
            } else if (storeduser_type === "admin") {
                welcomeh2 = "Welcome Admin";
            }else{
                welcomeh2 = "Welcome Back!";
            }
        }

        return (
            <nav className="NavbarItems" id="navbar">
                <img src={Seazone} className="navbar-logo" alt="Seazone" />
                <div className="welcome-banner">
                    <h2>{welcomeh()} {welcomeh2}</h2>                    
                    <p>{storedFullName}</p>
                </div>

                <div className="menu-icons" onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>

                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu '}>
                    {MenuItems.map((item, index) => {
                        
                        return (
                            <li key={index}>
                                <Link className={item.cName} to={item.url}>
                                    <i className={item.icon}></i>{item.title}
                                </Link>
                            </li>
                        );
                    })}
                    <button className="button-primary">
                        <Link to="/dashboard">Dashboard</Link>
                    </button>
                    <button className="button-secondary">
                        <Link to="#" onClick={checkLogin}>
                            {loginOrLogout}
                        </Link>
                    </button>
                </ul>

            </nav>
        );
    }
}

export default Navbar;