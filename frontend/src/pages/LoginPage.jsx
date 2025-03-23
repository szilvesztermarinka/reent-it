import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import kep from "../assets/izelito.png";
import { useAuth } from "../context/AuthContext";
import { IconLoader2 } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
    const { t } = useTranslation();
    const { login, loading, verify2FA } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [show2FA, setShow2FA] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await login(email, password);
            if (response?.requires2FA) {
                setShow2FA(true);
            }
            setName(response?.name);
            console.log(response)
        } catch (error) {
            console.error("Login error:", error);
        }
        setIsSubmitting(false);
    };

    const handle2FASubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await verify2FA(code);
        } catch (error) {
            console.error("2FA error:", error);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="flex justify-center items-center h-screen">
            {/* Image */}
            <div className="lg:w-1/2 h-screen hidden lg:block relative overflow-hidden">
                <img src={kep} alt="kep" className="object-contain h-max absolute top-1/2 transform -translate-y-1/2 left-1/3 z-0" />
            </div>

            {/* Form */}
            <div className="lg:p-24 bg-white md:p-52 sm:20 p-8 w-full lg:w-1/2 xl:w-3/4 h-screen flex relative flex-col justify-center items-center -10">
                <img src="/logo.png" alt="logo" className="absolute top-8 left-8 w-16 aspect-square"/>
                <div className="max-w-md w-full">
                    {!show2FA ? (
                        <>
                            <h2 className="text-4xl font-bold mb-3 text-black">{t("sign_in")}</h2>
                            <p className="text-base text-gray-500 mb-4">
                                {t("dont_have_account")}{" "}
                                <Link to={"/signup"} className="underline hover:text-gray-400">
                                    {t("sign_up")}
                                </Link>
                            </p>

                            <form onSubmit={handleLogin}>
                                <Input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    label={t("email_address")}
                                />
                                <Input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    label={t("password")}
                                />

                                <div className="flex justify-between text-center">
                                    <div className="flex items-center">
                                        <input type="checkbox" id="rememberMe" className="w-4 h-4 bg-primary rounded" />
                                        <label htmlFor="rememberMe" className="ml-2 text-sm text-black">
                                            {t("remember_me")}
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <Link to={"/forgot-password"} className="text-sm text-black hover:underline">
                                            {t("forgot_password")}
                                        </Link>
                                    </div>
                                </div>

                                <motion.button
                                    className="mt-5 w-full py-3 px-4 bg-blue-500 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 flex justify-center items-center"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                            <IconLoader2 stroke={2} />
                                        </motion.div>
                                    ) : (
                                        t("login")
                                    )}
                                </motion.button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 className="text-4xl font-bold mb-3 text-black">{t("2fa_verification", {name: name})}</h2>
                            <p className="text-base text-gray-500 mb-4">
                                {t("2fa_email_sent")} <span className="font-semibold">{email}</span>
                            </p>

                            <form onSubmit={handle2FASubmit}>
                                <Input
                                    type="text"
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    label={t("verification_code")}
                                    placeholder="123456"
                                />

                                <motion.button
                                    className="mt-5 w-full py-3 px-4 bg-blue-500 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 flex justify-center items-center"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                            <IconLoader2 stroke={2} />
                                        </motion.div>
                                    ) : (
                                        t("verify")
                                    )}
                                </motion.button>
                            </form>

                            <button
                                onClick={() => setShow2FA(false)}
                                className="mt-4 text-blue-500 hover:text-blue-700 text-sm"
                            >
                                {t("back_to_login")}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;