import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      let userCredential;
      if (isRegister) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError(err.message.replace("Firebase:", ""));
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
            {isRegister
              ? "Create admin account"
              : "Login to manage events"}
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          placeholder="admin@example.com"
          className="w-full border rounded-xl px-3 py-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {loading
            ? "Please wait..."
            : isRegister
            ? "Create Account"
            : "Login"}
        </button>

        <p
          onClick={() => setIsRegister(!isRegister)}
          className="mt-6 text-sm text-center text-indigo-600 cursor-pointer hover:underline"
        >
          {isRegister
            ? "Already have an account? Login"
            : "New admin? Create account"}
        </p>
      </div>
    </div>
  );
}
