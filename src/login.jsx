import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../config/firebase";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const sendOtp = async () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      `+91${mobile}`,
      window.recaptchaVerifier
    );

    setConfirmation(confirmationResult);
  };

  const verifyOtp = async () => {
    const result = await confirmation.confirm(otp);
    const token = await result.user.getIdToken();

    // send token to backend
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    alert("Login success");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="bg-white p-6 rounded-xl w-80 shadow-xl">
        <h2 className="text-xl font-bold text-center mb-4">CMS Login</h2>

        {!confirmation ? (
          <>
            <input
              className="w-full border p-2 rounded mb-3"
              placeholder="Mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <button
              onClick={sendOtp}
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              className="w-full border p-2 rounded mb-3"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
