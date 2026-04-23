import React from "react";
import { Link } from "react-router";
import { MapPin, Phone, Mail } from "lucide-react";
import Logo from '../assets/images/Logo.png'

const Footer = () => {
  return (
    <footer className="bg-green-900 text-green-100">

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-green-800">

          {/* ── Brand Column ── */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-25 h-25 bg-none rounded-xl flex items-center justify-center">
                <img src={Logo} className="w-25 h-25" />
              </div>
              <span className="text-white text-xl font-bold tracking-wide">FarmTrac</span>
            </div>

            <p className="text-green-300 text-sm leading-relaxed mb-6 max-w-xs">
              Connecting farmers with trusted equipment and drivers across India.
              Smart farming starts here — book, manage, and grow with ease.
            </p>

            {/* Social Icons */}
            {/* Social Icons */}
<div className="flex gap-2.5">
  {[
    {
      label: "Facebook",
      path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    },
    {
      label: "Twitter",
      path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    },
    {
      label: "Instagram",
      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
    },
    {
      label: "LinkedIn",
      path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    },
  ].map(({ label, path }) => (
    <button
      key={label}
      aria-label={label}
      className="w-9 h-9 rounded-lg bg-green-900 hover:bg-yellow-600 border border-green-800 hover:border-yellow-500 flex items-center justify-center text-yellow-500 hover:text-white transition-all duration-300"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }}>
        <path d={path} />
      </svg>
    </button>
  ))}
</div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home",        to: "/home" },
                { label: "Tractors",    to: "/tractors" },
                { label: "Marketplace", to: "/marketplace" },
                { label: "My Bookings", to: "/my-bookings" },
                { label: "About Us",    to: "/about" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-green-300 hover:text-white text-sm flex items-center gap-2 group transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:bg-green-300 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── For Farmers / Drivers ── */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">
              Get Started
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Register as Farmer", to: "/register?role=farmer" },
                { label: "Register as Driver", to: "/register?role=driver" },
                { label: "Book a Tractor",     to: "/tractors" },
                { label: "Owner Dashboard",    to: "/owner/dashboard" },
                { label: "Add Your Tractor",   to: "/owner/add-tractor" },
                { label: "Forgot Password",    to: "/forgot-password" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-green-300 hover:text-white text-sm flex items-center gap-2 group transition-colors duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:bg-green-300 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact + Newsletter ── */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">
              Contact Us
            </h4>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                <span className="text-green-300 text-sm leading-relaxed">
                  Ahmedabad, Gujarat, India
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-green-300 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-green-300 text-sm">support@farmtrac.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-widest mb-2">
                Newsletter
              </p>
              <p className="text-green-400 text-xs mb-3">
                Get farming tips & updates in your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 min-w-0 bg-green-800 border border-green-700 focus:border-green-400 rounded-lg px-3 py-2 text-sm text-white placeholder-green-500 outline-none transition-colors duration-200"
                />
                <button className="bg-green-600 hover:bg-green-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-green-400 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} FarmTrac. All rights reserved. Empowering Smart Farming.
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "Privacy Policy",  to: "/privacy" },
              { label: "Terms of Service", to: "/terms" },
              { label: "Support",         to: "/support" },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-green-400 hover:text-white text-xs transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>

export default Footer;