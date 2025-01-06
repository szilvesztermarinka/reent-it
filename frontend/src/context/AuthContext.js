import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

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

    // checkAuth - hitelesítés ellenőrzése
    const checkAuth = async () => {
        setIsCheckingAuth(true);
        setError(null); // Nullázzuk a hibát
        setMessage(null); // Nullázzuk az üzenetet
        try {
            const response = await authAPI.get(`/check-auth`);
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

    // login - bejelentkezés
    const login = async (email, password) => {
        setLoading(true);
        setError(null); // Nullázzuk a hibát
        setMessage(null); // Nullázzuk az üzenetet
        try {
            const response = await authAPI
            .post('/login', { email, password });
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
            const response = await authAPI.post(`/logout`);
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
            const response = await authAPI.post(`/signup`, { email, password, firstname, lastname });
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
            const response = await authAPI.post(`/verify-email`, { code });
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
                verifyEmail
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
