import { useState, useEffect } from "react";
import axios from "axios";

export default function Register() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300);

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, timer]);



  const isValidMobile = (m) => /^[0-9]{10}$/.test(m);
  const isValidOtp = (o) => /^[0-9]{6}$/.test(o);
  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const isValidPassword = (p) =>
    p.length >= 8 && /[A-Za-z]/.test(p) && /[0-9]/.test(p);

  const sendOtp = async () => {
    if (!isValidMobile(mobile)) {
      setError("Enter a valid mobile number");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/send-otp`, {
        mobile,
        type: "register",
      });
      setStep(2);
      setTimer(300);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!isValidOtp(otp)) {
      setError("OTP must be 6 digits");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp`, {
        mobile,
        otp,
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    if (form.name.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (!isValidEmail(form.email)) {
      setError("Enter a valid email");
      return;
    }
    if (!isValidPassword(form.password)) {
      setError("Password must be 8+ chars with letters & numbers");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        { ...form, mobile }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", form.name);
      localStorage.setItem("userMobile", mobile);
      localStorage.setItem("userEmail", form.email);
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Registration failed");
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
            Create admin account
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {step === 1 && (
          <>
            <label className="block text-sm font-medium mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="10 digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border rounded-xl px-3 py-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
            >
              {loading ? "Please wait..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block text-sm font-medium mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-xl px-3 py-3 mb-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {timer > 0 && (
              <p className="text-sm text-gray-500 text-center mb-4">
                OTP expires in{" "}
                <span className="font-medium">
                  {Math.floor(timer / 60)}:
                  {String(timer % 60).padStart(2, "0")}
                </span>
              </p>
            )}
            <button
              onClick={verifyOtp}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
            >
              {loading ? "Please wait..." : "Verify OTP"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-xl px-3 py-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-xl px-3 py-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border rounded-xl px-3 py-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full border rounded-xl px-3 py-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={register}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
            >
              {loading ? "Please wait..." : "Create Account"}
            </button>
          </>
        )}

        <p className="mt-6 text-sm text-center text-indigo-600">
          Already have an account?{" "}
          <a href="/login" className="font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
