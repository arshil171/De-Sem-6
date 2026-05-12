import React from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import {
  Search, Calendar, ShieldCheck, Tractor,
  Star, ArrowRight, MapPin, Clock, CheckCircle2
} from 'lucide-react'

const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: <Search className="w-6 h-6 text-yellow-400" />,
      title: 'Find Tractors Nearby',
      desc: 'Browse hundreds of tractors available near your location with real-time availability.',
    },
    {
      icon: <Calendar className="w-6 h-6 text-yellow-400" />,
      title: 'Instant Booking',
      desc: 'Schedule your equipment rental in minutes. No paperwork, no hassle.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-yellow-400" />,
      title: 'Verified Drivers',
      desc: 'Every driver is background-checked and rated by the farmer community.',
    },
    {
      icon: <Tractor className="w-6 h-6 text-yellow-400" />,
      title: 'All Equipment Types',
      desc: 'From ploughing to harvesting — find the right machine for every season.',
    },
  ]

  const stats = [
    { number: '5,000+', label: 'Farmers Served' },
    { number: '1,200+', label: 'Tractors Listed' },
    { number: '50+',    label: 'Districts Covered' },
    { number: '4.8★',   label: 'Average Rating' },
  ]

  const howItWorks = [
    { step: '01', title: 'Create Account',   desc: 'Sign up as a farmer or driver in under 2 minutes.' },
    { step: '02', title: 'Search Equipment', desc: 'Filter by location, type, and available dates.' },
    { step: '03', title: 'Book & Confirm',   desc: 'Instant booking confirmation sent to your phone.' },
    { step: '04', title: 'Start Farming',    desc: 'Driver arrives on time. You focus on your harvest.' },
  ]

  const testimonials = [
    { name: 'Ramesh Patel',   role: 'Wheat Farmer, Anand',     text: 'FarmTrac saved me 3 days of searching. Booked a tractor within minutes!', stars: 5 },
    { name: 'Suresh Yadav',   role: 'Tractor Owner, Mehsana',  text: 'My tractor is now earning money even when I am not using it. Great platform.', stars: 5 },
    { name: 'Kavita Sharma',  role: 'Cotton Farmer, Surat',    text: 'The drivers are professional and always on time. Highly recommended.', stars: 5 },
  ]

  return (
    <div className="bg-[#0a150a] text-green-100 min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a150a]" />

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-yellow-900/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-green-900/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#1a1200] border border-yellow-800 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">
              India's #1 Tractor Booking Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Smart Farming<br />
            Starts <span className="text-yellow-400">Right Here</span>
          </h1>

          <p className="text-green-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Connect with trusted tractor owners and verified drivers across India.
            Book equipment instantly, manage your farm efficiently.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <>
                <Link
                  to="/tractors"
                  className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] font-extrabold text-base rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  <Tractor className="w-5 h-5" />
                  Book a Tractor
                </Link>
                <Link
                  to="/my-bookings"
                  className="px-8 py-4 border-2 border-green-700 hover:border-green-500 text-green-300 hover:text-green-100 font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  My Bookings <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register?role=farmer"
                  className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] font-extrabold text-base rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  Register as Farmer
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/register?role=driver"
                  className="px-8 py-4 bg-green-800 hover:bg-green-700 border border-green-700 text-yellow-300 font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  Register as Driver
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 border-2 border-yellow-700 hover:border-yellow-500 text-yellow-400 font-bold text-base rounded-2xl flex items-center justify-center transition-colors duration-200"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-green-900/30 rounded-2xl overflow-hidden border border-green-900">
            {stats.map(({ number, label }) => (
              <div key={label} className="bg-[#111f11] py-6 px-4 text-center">
                <p className="text-yellow-400 text-2xl font-black">{number}</p>
                <p className="text-green-600 text-xs mt-1 tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 border-t border-green-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-3">Why FarmTrac</p>
            <h2 className="text-3xl font-black text-white">Everything You Need<br/>to Farm Smarter</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-[#111f11] border border-[#1f3a1f] hover:border-yellow-800 rounded-2xl p-6 transition-colors duration-300 group"
              >
                <div className="w-12 h-12 bg-[#1a2e1a] border border-[#2d4a2d] group-hover:border-yellow-800 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300">
                  {icon}
                </div>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-green-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 border-t border-green-900/50 bg-[#0d1a0d]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-3xl font-black text-white">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {howItWorks.map(({ step, title, desc }, i) => (
              <div key={step} className="relative">
                {/* Connector line */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-yellow-900 z-0" />
                )}
                <div className="relative z-10 bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-600 flex items-center justify-center text-[#0a150a] text-xl font-black mb-5">
                    {step}
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                  <p className="text-green-600 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 border-t border-green-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-3xl font-black text-white">Farmers Love FarmTrac</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, text, stars }) => (
              <div key={name} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-green-300 text-sm leading-relaxed mb-5 italic">"{text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-green-900">
                  <div className="w-9 h-9 rounded-full bg-yellow-700 flex items-center justify-center text-yellow-100 font-bold text-sm">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{name}</p>
                    <p className="text-green-600 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 border-t border-yellow-900/40 bg-[#1a1200]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Ready to Transform<br />Your Farm?
          </h2>
          <p className="text-yellow-700 text-base mb-8">
            Join thousands of farmers and drivers already using FarmTrac across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=farmer"
              className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              Get Started as Farmer <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register?role=driver"
              className="px-8 py-4 bg-green-800 hover:bg-green-700 text-yellow-300 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              Join as Driver <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10 text-green-700 text-xs">
            {['Free to join', 'No hidden charges', 'Cancel anytime'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-700" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home