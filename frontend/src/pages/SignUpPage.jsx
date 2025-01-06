import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import kep from "../assets/izelito.png";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";

const SignUpPage = () => {
  const { signup, loading } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [isLowerCase, setIsLowerCase] = useState(false);
  const [isNumber, setIsNumber] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);

  const navigate = useNavigate();

  const validatePassword = useCallback(() => {
    setIsLengthValid(password.length >= 8);
    setIsUpperCase(/[A-Z]/.test(password));
    setIsLowerCase(/[a-z]/.test(password));
    setIsNumber(/[0-9]/.test(password));
  }, [password]);
  
  useEffect(() => {
    validatePassword();
  }, [validatePassword]);

  const handleSignup = async (e) => {
    e.preventDefault();
    await signup(email, password, firstName, lastName);
    navigate("/verify-email");
  };

  const getStyle = (isValid) => {
    return isValid ? "text-green-500" : "text-gray-500";
  };


  return (
    <div className="flex justify-center items-center h-screen">
      {/* Image */}
      <div className="lg:w-1/2 h-screen hidden lg:block relative overflow-hidden">
        <img
          src={kep}
          alt="kep"
          className="object-contain h-max absolute top-1/2 transform -translate-y-1/2 left-1/3 z-0"
        />
      </div>

      {/* Form */}
      <div className="lg:p-24 bg-white md:p-52 sm:20 p-8 w-full lg:w-1/2 xl:w-3/4 h-screen flex flex-col justify-center items-center -10">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-3 text-black">
            Create your Reent account
          </h2>
          <p className="text-base text-gray-500 mb-4">
            You already have an account?{" "}
            <Link to={"/login"} className="underline hover:text-gray-400">
              Login
            </Link>
          </p>

          <form onSubmit={handleSignup}>
            <div className="w-full flex flex-row gap-6">
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                label="First Name"
                required
              />
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                label="Last Name"
                required
              />
            </div>

            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              required
            />

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              required
            />

            <div className="w-full flex justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <IconCheck
                    stroke={2}
                    size={20}
                    className={getStyle(isUpperCase)}
                  />
                  <p className={getStyle(isUpperCase)}>Contains uppercase</p>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck
                    stroke={2}
                    size={20}
                    className={getStyle(isLowerCase)}
                  />
                  <p className={getStyle(isLowerCase)}>Contains lowercase</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <IconCheck
                    stroke={2}
                    size={20}
                    className={getStyle(isNumber)}
                  />

                  <p className={getStyle(isNumber)}>Contains numbers</p>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck
                    stroke={2}
                    size={20}
                    className={getStyle(isLengthValid)}
                  />

                  <p className={getStyle(isLengthValid)}>
                    Minimum 8 characters
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              className="mt-5 w-full py-3 px-4 bg-blue-500 text-white font-bold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 flex items-center justify-center disabled:bg-blue-300"
              type="submit"
              disabled={
                !isUpperCase || !isLowerCase || !isNumber || !isLengthValid
              }
              whileHover={!(!isUpperCase || !isLowerCase || !isNumber || !isLengthValid) && { scale: 1.02 }}
              whileTap={!(!isUpperCase || !isLowerCase || !isNumber || !isLengthValid) && { scale: 0.98 }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <IconLoader2 stroke={2} />
                </motion.div>
              ) : (
                "Sign Up"
              )}
            </motion.button>
            <p className="text-gray-400 text-sm text-center mt-2">
              By clicking on the Sign Up button you accept all{" "}
              <b>Terms & Policy</b>.{" "}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
