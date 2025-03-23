import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";
import { motion } from "framer-motion";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import Notfound from "./pages/404";
import UploadPage from "./pages/UploadPage";
import PostPage from "./pages/PostPage";
import { IconLoader2 } from "@tabler/icons-react";

function App() {
    const { isAuthenticated, isCheckingAuth, error, message, user } = useAuth();

    useEffect(() => {
        if (error) {
            toast.error(error, { duration: 4000 });
        }
        if (message) {
            toast.success(message, { duration: 4000 });
        }
    }, [error, message]);

    if (isCheckingAuth)
        return (
            <div className="flex justify-center items-center h-screen">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    <IconLoader2 stroke={2} color="black" />
                </motion.div>
            </div>
        );

    return (
        <div className="h-screen bg-gray-100">
            <Toaster position="bottom-right" reverseOrder={false} />

            <Routes>
                {/* Auth */}
                <Route path="/" element={isAuthenticated && user ? <HomePage /> : <Navigate to="/login" replace />} />
                <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
                <Route path="/verify-email" element={isAuthenticated && !user?.isVerified ? <EmailVerificationPage /> : <Navigate to="/" replace />} />
                <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" replace />} />

                {/* Application */}
                <Route path="/upload" element={isAuthenticated ? <UploadPage /> : <Navigate to="/login" replace />} />
                <Route path="/post/:id" element={isAuthenticated ? <PostPage /> : <Navigate to="/login" replace />} />

                {/* 404 Page */}
                <Route path="*" element={<Notfound />} />
            </Routes>
        </div>
    );
}

export default App;
