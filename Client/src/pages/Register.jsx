import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { CheckCircle2, Eye, EyeOff, Lock, Mail, User, Tractor, Phone } from "lucide-react";
import axios from "axios";

import signupImage from "../assets/images/signupImage.jpg";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phoneno: "",
    role: ""
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();

  const passwordChecks = {
    length: data.password.length >= 6,
    numberOrSymbol: /[0-9!@#$%^&*(),.?":{}|<>]/.test(data.password),
    upperLower: /[a-z]/.test(data.password) && /[A-Z]/.test(data.password),
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!handleError()) return;

    setLoading(true);
    setApiError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/register`,
        {
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phoneno,   // backend field is "phone"
          role: data.role
        },
        { withCredentials: true }
      );

      if (res.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Registration failed. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleError() {
    let obj = {};
    let val = true;

    if (!data.name.trim()) {
      val = false;
      obj.name = "Enter your full name";
    }

    if (!data.email.trim()) {
      val = false;
      obj.email = "Enter a valid email address";
    }

    if (!data.password.trim()) {
      val = false;
      obj.password = "Enter a valid password";
    } else if (data.password.length < 6) {
      val = false;
      obj.password = "Password must be at least 6 characters";
    }

    if (!data.phoneno.trim()) {
      val = false;
      obj.phoneno = "Enter a valid phone number";
    } else if (data.phoneno.length < 10) {
      val = false;
      obj.phoneno = "Phone number must be at least 10 digits";
    }

    if (!data.role) {
      val = false;
      obj.role = "Please select a role";
    }

    setFieldErrors(obj);
    return val;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50">
      <div className="relative w-full max-w-5xl my-8 bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left Section: Form */}
        <div className="p-8 sm:p-12 relative z-10">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <Tractor className="h-6 w-6 text-green-700" />
            <p>
              Already a farmer?{" "}
              <Link to="/Login" className="text-green-600 font-medium hover:underline">
                Log In
              </Link>
            </p>
          </div>

          <h2 className="text-4xl font-extrabold mt-8 text-gray-900">FarmTrac Signup</h2>
          <p className="text-gray-500 text-base mt-1">
            Access the best equipment for your fields instantly.
          </p>

          {/* API Error Banner */}
          {apiError && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {apiError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">

            {/* Name */}
            <div className="flex items-center gap-3 border-b-2 border-green-200 focus-within:border-green-600 transition duration-300 rounded-t-md p-1">
              <User className="h-5 w-5 text-green-700/60" />
              <input
                type="text"
                placeholder="Farm/Full Name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full py-2 outline-none placeholder-gray-400 text-gray-800 bg-white"
              />
              {data.name && !fieldErrors.name && <CheckCircle2 className="h-4 w-4 text-lime-500" />}
            </div>
            {fieldErrors.name && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
            )}

            {/* Email*/}
            <div className="flex items-center gap-3 border-b-2 border-green-200 focus-within:border-green-600 transition duration-300 rounded-t-md p-1">
              <Mail className="h-5 w-5 text-green-700/60" />
              <input
                type="email"
                placeholder="Email Address"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full py-2 outline-none placeholder-gray-400 text-gray-800 bg-white"
              />
              {data.email && !fieldErrors.email && <CheckCircle2 className="h-4 w-4 text-lime-500" />}
            </div>
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}

            {/* Phoneno */}
            <div className="flex items-center gap-3 border-b-2 border-green-200 focus-within:border-green-600 transition duration-300 rounded-t-md p-1">
              <Phone className="h-5 w-5 text-green-700/60" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={data.phoneno}
                onChange={(e) => setData({ ...data, phoneno: e.target.value })}
                className="w-full py-2 outline-none placeholder-gray-400 text-gray-800 bg-white"
              />
              {data.phoneno && !fieldErrors.phoneno && <CheckCircle2 className="h-4 w-4 text-lime-500" />}
            </div>
            {fieldErrors.phoneno && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.phoneno}</p>
            )}

            {/* Password */}
            <div className="flex items-center gap-3 border-b-2 border-green-200 focus-within:border-green-600 transition duration-300 rounded-t-md p-1">
              <Lock className="h-5 w-5 text-green-700/60" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="w-full py-2 outline-none placeholder-gray-400 text-gray-800 bg-white"
              />
              {showPassword ? (
                <EyeOff
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
            )}

            {/* Password Checks */}
            <ul className="mt-2 text-xs space-y-1 ml-8">
              <li className={`flex items-center gap-1 ${passwordChecks.length ? "text-green-600 font-medium" : "text-gray-500"}`}>
                {passwordChecks.length ? <CheckCircle2 className="w-3 h-3 text-lime-500" /> : <div className="w-3 h-3" />}
                At least 6 characters
              </li>
              <li className={`flex items-center gap-1 ${passwordChecks.numberOrSymbol ? "text-green-600 font-medium" : "text-gray-500"}`}>
                {passwordChecks.numberOrSymbol ? <CheckCircle2 className="w-3 h-3 text-lime-500" /> : <div className="w-3 h-3" />}
                At least one number or symbol
              </li>
              <li className={`flex items-center gap-1 ${passwordChecks.upperLower ? "text-green-600 font-medium" : "text-gray-500"}`}>
                {passwordChecks.upperLower ? <CheckCircle2 className="w-3 h-3 text-lime-500" /> : <div className="w-3 h-3" />}
                Lowercase and uppercase letters
              </li>
            </ul>

            {/* Role Selection  */}
            <div>
              <p className="text-sm text-gray-600 mb-2 font-medium">Select your role</p>
              <div className="flex items-center gap-8">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={data.role === "farmer"}
                      onChange={() =>
                        setData({ ...data, role: data.role === "farmer" ? "" : "farmer" })
                      }
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        data.role === "farmer"
                          ? "bg-green-600 border-green-600"
                          : "border-green-300 group-hover:border-green-500"
                      }`}
                    >
                      {data.role === "farmer" && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      data.role === "farmer" ? "text-green-700" : "text-gray-600"
                    }`}
                  >
                    Farmer
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={data.role === "driver"}
                      onChange={() =>
                        setData({ ...data, role: data.role === "driver" ? "" : "driver" })
                      }
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        data.role === "driver"
                          ? "bg-green-600 border-green-600"
                          : "border-green-300 group-hover:border-green-500"
                      }`}
                    >
                      {data.role === "driver" && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      data.role === "driver" ? "text-green-700" : "text-gray-600"
                    }`}
                  >
                    Driver
                  </span>
                </label>
              </div>
              {fieldErrors.role && (
                <p className="text-red-500 text-xs mt-2">{fieldErrors.role}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 w-full sm:w-auto rounded-full text-white font-semibold shadow-lg transition bg-green-600 hover:bg-green-700 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Creating Account..." : "Create FarmTrac Account"}
              </button>
              <span className="text-sm text-gray-500">or sign up with</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="h-15 w-15 rounded-full bg-gray-100 flex justify-center items-center text-red-600 shadow hover:shadow-md transition"
                >
                  <FcGoogle className="text-[35px]" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="relative p-0 bg-green-800 flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-full">
          <img
            src={signupImage}
            alt="Modern Green Tractor on a Farm Field"
            className="w-full h-full object-cover opacity-70"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/38761d/ffffff?text=Tractor+Booking" }}
          />
          <div className="absolute inset-0 bg-green-900/50 flex flex-col justify-center items-center p-8 text-white">
            <Tractor className="h-12 w-12 text-lime-300 mb-4 drop-shadow-lg" />
            <h3 className="text-4xl font-extrabold text-center drop-shadow-xl leading-tight">
              FarmTrac: Smart Equipment Access
            </h3>
            <p className="mt-4 text-center text-lg max-w-sm drop-shadow font-light">
              We connect farmers to dependable machinery, simplifying your planting and harvesting schedules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;