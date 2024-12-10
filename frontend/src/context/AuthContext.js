import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const API_URL = "http://localhost:5000/api/auth";
const APP_API_URL = "http://localhost:5000/api/app";
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState([]);

    // checkAuth - hitelesítés ellenőrzése
    const checkAuth = async () => {
        setIsCheckingAuth(true);
        setError(null); // Nullázzuk a hibát
        setMessage(null); // Nullázzuk az üzenetet
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            setUser(response.data.user);
            setIsAuthenticated(true);
            setError(null); // Töröljük a hibát sikeres válasz esetén
            setMessage(response.data.message);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            setError("Error checking authentication"); // Hiba, ha nem sikerült ellenőrizni a hitelesítést
        } finally {
            setIsCheckingAuth(false);
        }
    };

    const getPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${APP_API_URL}/all-ad`);
            setPost(response.data.posts);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message || "Error getting posts");
            setLoading(false);
        }
    };

    // login - bejelentkezés
    const login = async (email, password) => {
        setLoading(true);
        setError(null); // Nullázzuk a hibát
        setMessage(null); // Nullázzuk az üzenetet
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            setUser(response.data.user);
            setIsAuthenticated(true);
            setMessage(response.data.message);
            setError(null); // Töröljük a hibát sikeres bejelentkezésnél
            setLoading(false);
        } catch (error) {
            // Ha hiba van, ellenőrizzük a válasz részleteit
            if (error.response) {
                setError(error.response.data.message || "Error logging in"); // Az API hibaüzenete
            } else {
                setError("Error logging in"); // Általános hiba
            }
            setLoading(false);
        }
    };

    // logout - kijelentkezés
    const logout = async () => {
        setError(null); // Nullázzuk a hibát
        setMessage(null); // Nullázzuk az üzenetet
        try {
            const response = await axios.post(`${API_URL}/logout`);
            setUser(null);
            setIsAuthenticated(false);
            setMessage(response.data.message);
            setError(null); // Töröljük a hibát sikeres kijelentkezésnél
        } catch (error) {
            // Ha hiba van, ellenőrizzük a válasz részleteit
            if (error.response) {
                setError(error.response.data.message || "Error logging out"); // Az API hibaüzenete
            } else {
                setError("Error logging out"); // Általános hiba
            }
        }
    };

    const signup = async (email, password, firstname, lastname) => {
        setLoading(true);
        setError(null);
        setMessage(null);
        setUser(null);
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, firstname, lastname });
            console.log(response);
            setUser(response.data.user);
            setIsAuthenticated(true);
            setMessage(response.data.message);
            setError(null);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.response.data.message || "Error signing up");
        }
    };

    const verifyEmail = async (code) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            setUser(response.data.user);
            setIsAuthenticated(true);
            setLoading(false);
            setError(null);
            return response.data;
        } catch (error) {
            setError(error.response.data.message || "Error verifying email");
            setLoading(false);
            throw error;
        }
    };

    useEffect(() => {
        checkAuth(); // Ellenőrizzük a felhasználó hitelesítését, amikor az alkalmazás betöltődik
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isCheckingAuth,
                error,
                message,
                loading,
                login,
                logout,
                checkAuth,
                signup,
                verifyEmail,
                getPosts,
                post,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
