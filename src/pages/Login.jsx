import { useState } from "react";
import { signInWithEmailAndPassword, signInWithCustomToken } from "firebase/auth";
import { auth } from "../config/firebase";
import axios from "axios";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidMobile = (m) => /^[0-9]{10}$/.test(m);

  const submit = async () => {
    setError("");
    if (!mobile || !password) {
      setError("Mobile number and password are required");
      return;
    }

    if (!isValidMobile(mobile)) {
      setError("Enter a valid mobile number");
      return;
    }

    try {
      setLoading(true);

      // First, get user info from backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        { mobile, password }
      );

      const { email, isAdmin, user } = res.data;

      if (!email) {
        throw new Error("No email received from server");
      }

      console.log('Login response user data:', user);

      // Now verify password with Firebase using signInWithEmailAndPassword
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get ID token after successful authentication
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
      localStorage.setItem("userName", user?.name || "User");
      localStorage.setItem("userMobile", user?.mobile || mobile);
      localStorage.setItem("userEmail", user?.email || email);
      
      console.log('Stored in localStorage:', {
        userName: localStorage.getItem("userName"),
        userEmail: localStorage.getItem("userEmail"),
        userMobile: localStorage.getItem("userMobile")
      });

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.message || "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Event Platform CMS
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Login to manage events
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium mb-1">
          Mobile Number
        </label>
        <input
          type="tel"
          placeholder="10 digit mobile number"
          className="w-full border rounded-xl px-3 py-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <label className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full border rounded-xl px-3 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-xl font-semibold transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
        >
          {loading ? "Please wait..." : "Login"}
        </button>

        <p className="mt-6 text-sm text-center text-indigo-600">
          New admin?{" "}
          <a href="/register" className="font-semibold hover:underline">
            Create account
          </a>
        </p>

        <p className="mt-3 text-sm text-center text-gray-600">
          Forgot password?{" "}
          <a href="/change-password" className="font-semibold text-indigo-600 hover:underline">
            Reset here
          </a>
        </p>
      </div>
    </div>
  );
}
