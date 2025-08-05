import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/auth/login", { email, password });

      localStorage.setItem("authToken", data.token);
      toast.success("Login successful!");

      setTimeout(() => navigate("/"), 1800);
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
      toast.error(error.response?.data?.error || "Login failed");
      setTimeout(() => setError(""), 4500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-xl rounded-lg flex max-w-4xl w-full overflow-hidden">
        
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-6 text-right text-sm text-gray-500">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </div>

          <h2 className="text-2xl font-semibold mb-1">Login to Your Account</h2>
          <p className="text-sm text-gray-500 mb-6">Please login to continue</p>

          <form onSubmit={loginHandler} className="space-y-5">
            {error && (
              <div className="text-sm text-red-500 bg-red-100 p-2 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="example@gmail.com"
                className="w-full px-4 py-2 border border-gray-300 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="6+ strong character"
                className="w-full px-4 py-2 border border-gray-300 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            <div className="text-right text-sm">
              <Link to="/forgotpassword" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition font-semibold"
            >
              Login
            </button>
          </form>
        </div>

        {/* Banner Section */}
        <div className="hidden md:flex items-center justify-center w-1/2 bg-gray-200">
          <img src="login.png" alt="Login" className="w-80" />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LoginScreen;
