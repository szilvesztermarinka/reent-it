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
    const [pending2FA, setPending2FA] = useState({
        isRequired: false,
        email: null,
    });

    const checkAuth = async () => {
        setIsCheckingAuth(true);
        setError(null);
        try {
            const response = await authAPI.get(`/check-auth`);
            setUser(response.data.user);
            setIsAuthenticated(true);
            setMessage(response.data.message);
        } catch (error) {
            resetAuthState();
        } finally {
            setIsCheckingAuth(false);
        }
    };

    const resetAuthState = () => {
        setUser(null);
        setIsAuthenticated(false);
        setPending2FA({ isRequired: false, email: null });
        setError(null);
        setMessage(null);
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authAPI.post("/login", { email, password });
            setPending2FA({
                isRequired: true,
                email: email,
            });

            console.log("asd: ", response.data.message);

            setIsAuthenticated(false);
            setMessage(response.data.message);
            return response.data;
        } catch (error) {
            handleAuthError(error, "Error logging in");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const verify2FA = async (code) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authAPI.post("/verify2fa", {
                email: pending2FA.email,
                code,
            });

            setUser(response.data.user);
            setIsAuthenticated(true);
            setPending2FA({ isRequired: false, email: null });
            return response.data;
        } catch (error) {
            handleAuthError(error, "Error verifying 2FA code");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setError(null);
        try {
            await authAPI.post("/logout");
            resetAuthState();
        } catch (error) {
            handleAuthError(error, "Error logging out");
        }
    };

    const signup = async (email, password, firstname, lastname) => {
        setLoading(true);
        try {
            const response = await authAPI.post("/signup", {
                email,
                password,
                firstname,
                lastname,
            });
            setUser(response.data.user);
            setIsAuthenticated(true);
            return response.data;
        } catch (error) {
            handleAuthError(error, "Error signing up");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const verifyEmail = async (code) => {
        setLoading(true);
        try {
            const response = await authAPI.post("/verify-email", { code });
            setUser(response.data.user);
            setIsAuthenticated(true);
            return response.data;
        } catch (error) {
            handleAuthError(error, "Error verifying email");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleAuthError = (error, defaultMessage) => {
        const errorMessage = error.response?.data?.message || defaultMessage;
        setError(errorMessage);
        setMessage(null);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isCheckingAuth,
                pending2FA,
                error,
                message,
                loading,
                login,
                logout,
                verify2FA,
                checkAuth,
                signup,
                verifyEmail,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
