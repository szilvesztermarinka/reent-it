import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";
import EmailVerificationPage from "./pages/EmailVerificationPage";

function App() {
    const { isAuthenticated, isCheckingAuth, error, message, user} = useAuth();

    useEffect(() => {
        if (error) {
            toast.error(error, { duration: 4000 });
        }
        if (message) {
            toast.success(message, { duration: 4000 });
        }
    }, [error, message]);

    if (isCheckingAuth) return <div>Loading...</div>;

    return (
        <div className="h-screen bg-gray-200">
            <Toaster position="bottom-right" reverseOrder={false} />

            <Routes>
                <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} />
                <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
                <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" replace />} />
                <Route path="/verify-email" element={!isAuthenticated ? <LoginPage /> : user?.isVerified ? <Navigate to="/" replace /> : <EmailVerificationPage />} />

                {/* 404 Page */}
                <Route path="*" element="404" />
            </Routes>
        </div>
    );
}

export default App;
