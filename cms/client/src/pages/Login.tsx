import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, setScopes } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

const handleLogin = async (event: React.FormEvent) => {
  event.preventDefault();

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/login/admin`,
      {
        email,
        password,
      }
    );

    const token = response.data.token;
    localStorage.setItem("authToken", token);

    const decoded = JSON.parse(atob(token.split(".")[1]));

    if (!decoded.scopes?.includes("admin")) {
      setError("You are not authorized as an admin.");
      localStorage.removeItem("authToken");
      return;
    }

    setScopes(decoded.scopes);
    setIsAuthenticated(true);
    setError(null);
    navigate("/home"); 
  } catch (err: any) {
    setError(err.response?.data?.message || "Login failed. Please try again.");
  }
};

  return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>
          {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
