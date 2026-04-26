import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import logo from "../assets/images/Logo.png";

const ForgotPassword = () => {
  const [step, setStep]  = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const BASE = import.meta.env.VITE_BASE_URL;

  // ── Step 1: Send OTP ─────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError(""); setSuccess("");
    if (!email.trim()) return setError("Please enter your email address.");

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE}/auth/forgotPassword`,
        { email },
        { withCredentials: true }
      );
      setSuccess(res.data.message || "OTP sent to your email!");
      setTimeout(() => { setSuccess(""); setStep(2); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: OTP input handlers ───────────────────────────────────
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = [...otp];
    pasted.split("").forEach((char, i) => { updated[i] = char; });
    setOtp(updated);
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const otpNumber = otp.join("");
    if (otpNumber.length < 6) return setError("Please enter the complete 6-digit OTP.");

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE}/auth/checkOtp`,
        { otpNumber },
        { withCredentials: true }
      );    
      setSuccess(res.data.message || "OTP verified!");
      setTimeout(() => { setSuccess(""); setStep(3); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ───────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!password.trim())         return setError("Please enter a new password.");
    if (password.length < 6)      return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE}/auth/passwordChange`,
        { email, password },
        { withCredentials: true }
      );
      setSuccess(res.data.message || "Password updated successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step config ──────────────────────────────────────────────────
  const steps = [
    { id: 1, label: "Email" },
    { id: 2, label: "Verify OTP" },
    { id: 3, label: "New Password" },
  ];

  const stepSubtitle = {
    1: "Enter your registered email address",
    2: `Check your inbox for the 6-digit code`,
    3: "Create a strong new password",
  };

  return (
    <div className="min-h-screen bg-[#0a150a] flex items-center justify-center p-4">

      {/* Gold top bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-yellow-600 z-50" />

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src={logo} alt="FarmTrac" className="h-20 w-20 object-contain drop-shadow-2xl" />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#111f11] border border-[#1f3a1f] rounded-3xl overflow-hidden shadow-2xl">

          {/* Header */}
          <div className="bg-[#162716] px-8 pt-8 pb-6 border-b border-[#1f3a1f]">

            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 bg-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <KeyRound className="w-7 h-7 text-[#0a150a]" />
              </div>
            </div>

            <h1 className="text-yellow-400 text-2xl font-extrabold text-center tracking-wide">
              Forgot Password?
            </h1>
            <p className="text-[#6b8f6b] text-sm text-center mt-1.5">
              {stepSubtitle[step]}
            </p>

            {/* Step Indicator */}
            <div className="flex items-center justify-center mt-6 gap-2">
              {steps.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      step > s.id
                        ? "bg-yellow-600 text-[#0a150a]"
                        : step === s.id
                        ? "bg-yellow-600 text-[#0a150a] ring-4 ring-yellow-900"
                        : "bg-[#1f3a1f] text-[#4b6b4b] border border-[#2d4a2d]"
                    }`}>
                      {step > s.id
                        ? <CheckCircle2 className="w-4 h-4" />
                        : s.id}
                    </div>
                    <span className={`text-[10px] font-semibold tracking-wide ${
                      step === s.id ? "text-yellow-400" : step > s.id ? "text-yellow-700" : "text-[#4b6b4b]"
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-0.5 w-10 mb-5 rounded-full transition-all duration-500 ${
                      step > s.id ? "bg-yellow-600" : "bg-[#1f3a1f]"
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8">

            {/* Success */}
            {success && (
              <div className="mb-5 flex items-center gap-3 bg-[#162716] border border-green-800 text-green-400 text-sm px-4 py-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-yellow-500" />
                {success}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-5 bg-red-950 border border-red-900 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* ── STEP 1: Email ── */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 bg-[#0a150a] border-2 border-[#2d4a2d] focus-within:border-yellow-600 rounded-xl px-4 py-3.5 transition-colors duration-200">
                    <Mail className="w-5 h-5 text-[#6b8f6b] shrink-0" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm"
                    />
                    {email && <CheckCircle2 className="w-4 h-4 text-yellow-500 shrink-0" />}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-[#0a150a] font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  {loading
                    ? <span className="w-5 h-5 border-2 border-[#0a150a] border-t-transparent rounded-full animate-spin" />
                    : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>
                  }
                </button>

                <p className="text-center text-sm text-[#4b6b4b]">
                  Remember your password?{" "}
                  <Link to="/login" className="text-yellow-500 font-semibold hover:text-yellow-400 transition-colors">
                    Login
                  </Link>
                </p>
              </form>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <p className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-1 text-center">
                    Enter OTP
                  </p>
                  <p className="text-[#4b6b4b] text-xs text-center mb-5">
                    Sent to{" "}
                    <span className="text-yellow-500 font-semibold">{email}</span>
                  </p>

                  {/* OTP Boxes */}
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        className={`w-11 h-14 text-center text-xl font-extrabold rounded-xl border-2 outline-none transition-all duration-200 bg-[#0a150a] ${
                          digit
                            ? "border-yellow-600 text-yellow-400 bg-[#1a1200]"
                            : "border-[#2d4a2d] text-green-100 focus:border-yellow-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="w-full py-3.5 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-[#0a150a] font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  {loading
                    ? <span className="w-5 h-5 border-2 border-[#0a150a] border-t-transparent rounded-full animate-spin" />
                    : <><span>Verify OTP</span><ArrowRight className="w-4 h-4" /></>
                  }
                </button>

                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setOtp(["","","","","",""]); setError(""); }}
                    className="text-[#4b6b4b] hover:text-green-400 transition-colors"
                  >
                    ← Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-yellow-500 font-semibold hover:text-yellow-400 transition-colors"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 3: New Password ── */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">

                {/* New Password */}
                <div>
                  <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">
                    New Password
                  </label>
                  <div className="flex items-center gap-3 bg-[#0a150a] border-2 border-[#2d4a2d] focus-within:border-yellow-600 rounded-xl px-4 py-3.5 transition-colors duration-200">
                    <Lock className="w-5 h-5 text-[#6b8f6b] shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#6b8f6b] hover:text-yellow-400 transition-colors"
                    >
                      {showPassword
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength dots */}
                  {password && (
                    <div className="flex gap-1.5 mt-2">
                      <div className={`h-1 flex-1 rounded-full transition-colors ${password.length >= 6 ? "bg-yellow-600" : "bg-[#2d4a2d]"}`} />
                      <div className={`h-1 flex-1 rounded-full transition-colors ${/[A-Z]/.test(password) ? "bg-yellow-500" : "bg-[#2d4a2d]"}`} />
                      <div className={`h-1 flex-1 rounded-full transition-colors ${/[0-9!@#$%^&*]/.test(password) ? "bg-green-500" : "bg-[#2d4a2d]"}`} />
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">
                    Confirm Password
                  </label>
                  <div className={`flex items-center gap-3 bg-[#0a150a] border-2 rounded-xl px-4 py-3.5 transition-colors duration-200 ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-800 focus-within:border-red-600"
                      : confirmPassword && password === confirmPassword
                      ? "border-green-700 focus-within:border-green-500"
                      : "border-[#2d4a2d] focus-within:border-yellow-600"
                  }`}>
                    <Lock className="w-5 h-5 text-[#6b8f6b] shrink-0" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-[#6b8f6b] hover:text-yellow-400 transition-colors"
                    >
                      {showConfirm
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-red-500 text-xs mt-1.5">Passwords do not match</p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-green-500 text-xs mt-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Passwords match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-[#0a150a] font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  {loading
                    ? <span className="w-5 h-5 border-2 border-[#0a150a] border-t-transparent rounded-full animate-spin" />
                    : <><span>Reset Password</span><ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;