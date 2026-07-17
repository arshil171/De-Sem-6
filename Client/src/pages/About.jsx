import React from 'react'
import { Link } from 'react-router'
import {
  Tractor, Users, ShieldCheck, Star,
  MapPin, Phone, Mail, ArrowRight,
  Wheat, TrendingUp, Clock, CheckCircle2
} from 'lucide-react'
import logo from '../assets/images/Logo.png'

const About = () => {

  const stats = [
    { number: '5,000+', label: 'Farmers Served',    icon: <Users className="w-5 h-5" />     },
    { number: '1,200+', label: 'Tractors Listed',   icon: <Tractor className="w-5 h-5" />   },
    { number: '50+',    label: 'Districts Covered', icon: <MapPin className="w-5 h-5" />     },
    { number: '4.8★',   label: 'Average Rating',    icon: <Star className="w-5 h-5" />       },
  ]

  const team = [
    { name: 'Arshil Gondaliya',   role: 'Full Stack Developer',  initial: 'A' },
    { name: 'Param Shah', role: 'Full Stack Developer ',     initial: 'P' },
    { name: 'Ruchit Tank', role: 'Frontend Developer',    initial: 'R' },
    { name: 'Piyush Viruniya', role: 'UI/UX Designer',        initial: 'P' },
  ]

  const values = [
    {
      icon: <ShieldCheck className="w-7 h-7 text-yellow-400" />,
      title: 'Trust & Safety',
      desc: 'Every driver is verified and every transaction is secured. We put farmer safety first in everything we build.',
    },
    {
      icon: <TrendingUp className="w-7 h-7 text-yellow-400" />,
      title: 'Farmer Empowerment',
      desc: 'We believe technology should work for farmers — not the other way around. Simple, fast, and affordable.',
    },
    {
      icon: <Clock className="w-7 h-7 text-yellow-400" />,
      title: 'Instant Access',
      desc: 'Book a tractor in minutes, not days. Real-time availability so you never miss your planting or harvest window.',
    },
    {
      icon: <CheckCircle2 className="w-7 h-7 text-yellow-400" />,
      title: 'Quality Assured',
      desc: 'Ratings and reviews from the farming community ensure you always get the best equipment and drivers.',
    },
  ]

  const timeline = [
    { year: '2023', title: 'Founded',       desc: 'FarmTrac started as a final year project with a mission to digitize farm equipment access.' },
    { year: '2024', title: 'First 100',     desc: 'Reached 100 farmers and 50 drivers across Ahmedabad and surrounding districts.' },
    { year: '2024', title: 'Marketplace',   desc: 'Launched the product marketplace for seeds, fertilizers, tools and equipment.' },
    { year: '2025', title: 'Pan Gujarat',   desc: 'Expanded to 50+ districts across Gujarat with 1200+ tractors on the platform.' },
  ]

  return (
    <div className="bg-[#0a150a] text-green-100 min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1200] border border-yellow-800/60 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">
              Our Story
            </span>
          </div>

          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="FarmTrac"
              className="w-24 h-24 object-contain drop-shadow-2xl"
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
            About <span className="text-yellow-400">FarmTrac</span>
          </h1>
          <p className="text-green-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            FarmTrac is India's smart tractor booking platform — connecting farmers
            with trusted equipment owners and verified drivers across Gujarat and beyond.
            We're making modern farming accessible to everyone.
          </p>

          <Link
            to="/tractors"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] font-extrabold text-sm rounded-xl transition-colors"
          >
            <Wheat className="w-4 h-4" />
            Explore Tractors
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-green-900/40 bg-[#0d1a0d]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-green-900/20 rounded-2xl overflow-hidden border border-green-900/30">
            {stats.map(({ number, label, icon }) => (
              <div key={label} className="bg-[#0d1a0d] py-8 px-4 text-center flex flex-col items-center gap-2">
                <div className="text-yellow-700">{icon}</div>
                <p className="text-yellow-400 text-2xl font-black">{number}</p>
                <p className="text-green-600 text-xs tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-3">Our Mission</p>
              <h2 className="text-3xl font-black text-white mb-5 leading-tight">
                Empowering Every Farmer<br />
                with <span className="text-yellow-400">Smart Technology</span>
              </h2>
              <p className="text-green-400 text-base leading-relaxed mb-5">
                India has over 140 million farming households, yet access to modern
                equipment remains a challenge for small and marginal farmers. FarmTrac
                bridges this gap by creating a marketplace where farmers can instantly
                find and book the right tractor for the right job.
              </p>
              <p className="text-green-500 text-sm leading-relaxed mb-8">
                For tractor owners and drivers, we provide a platform to earn more by
                listing their equipment, managing bookings, and growing their business —
                all from a single dashboard.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/register?role=farmer"
                  className="px-5 py-2.5 bg-green-800 hover:bg-green-700 text-yellow-300 font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
                >
                  <Users className="w-4 h-4" /> Join as Farmer
                </Link>
                <Link
                  to="/register?role=driver"
                  className="px-5 py-2.5 bg-yellow-700 hover:bg-yellow-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
                >
                  <Tractor className="w-4 h-4" /> Join as Driver
                </Link>
              </div>
            </div>

            {/* Mission visual cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: '🌾', title: 'For Farmers',  desc: 'Browse, book, and track equipment instantly from your phone.' },
                { emoji: '🚜', title: 'For Drivers',  desc: 'List your tractor, set your price, accept bookings on the go.' },
                { emoji: '📦', title: 'Marketplace',  desc: 'Buy seeds, fertilizers, tools and farming equipment.' },
                { emoji: '⭐', title: 'Rated & Safe', desc: 'Community ratings ensure only the best drivers get booked.' },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="bg-[#111f11] border border-[#1f3a1f] hover:border-yellow-800/60 rounded-2xl p-5 transition-all">
                  <span className="text-3xl mb-3 block">{emoji}</span>
                  <h3 className="text-white font-bold text-sm mb-1.5">{title}</h3>
                  <p className="text-green-600 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ── */}
      <section className="py-20 bg-[#0d1a0d] border-t border-green-900/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-3">What We Stand For</p>
            <h2 className="text-3xl font-black text-white">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="bg-[#111f11] border border-[#1f3a1f] hover:border-yellow-800/50 rounded-2xl p-6 flex flex-col gap-4 transition-all group">
                <div className="w-14 h-14 bg-[#1a2e1a] border border-[#2d4a2d] group-hover:border-yellow-800/50 rounded-xl flex items-center justify-center transition-colors">
                  {icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                  <p className="text-green-600 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20 border-t border-green-900/40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-3">How We Got Here</p>
            <h2 className="text-3xl font-black text-white">Our Journey</h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-[#1f3a1f]" />
            <div className="space-y-8">
              {timeline.map(({ year, title, desc }, i) => (
                <div key={i} className="relative flex items-start gap-6 pl-6">
                  {/* Dot */}
                  <div className="absolute left-0 w-16 flex justify-center">
                    <div className="w-4 h-4 rounded-full bg-yellow-600 border-4 border-[#0a150a] shrink-0 mt-1" />
                  </div>
                  {/* Year badge */}
                  <div className="w-14 shrink-0 pt-0.5">
                    <span className="text-yellow-500 text-xs font-black">{year}</span>
                  </div>
                  {/* Content */}
                  <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-5 flex-1">
                    <h3 className="text-white font-bold text-base mb-1.5">{title}</h3>
                    <p className="text-green-600 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 bg-[#0d1a0d] border-t border-green-900/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-3">The Builders</p>
            <h2 className="text-3xl font-black text-white">Meet the Team</h2>
            <p className="text-green-500 text-sm mt-3 max-w-md mx-auto">
              Final year Computer Engineering students from GTU building real solutions for real farmers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map(({ name, role, initial }) => (
              <div key={name} className="bg-[#111f11] border border-[#1f3a1f] hover:border-yellow-800/50 rounded-2xl p-6 text-center flex flex-col items-center gap-4 transition-all group">
                <div className="w-20 h-20 rounded-full bg-yellow-700 flex items-center justify-center text-[#0a150a] text-3xl font-black group-hover:bg-yellow-600 transition-colors">
                  {initial}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">{name}</h3>
                  <p className="text-green-500 text-xs mt-1">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-20 border-t border-green-900/40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-3">Get In Touch</p>
            <h2 className="text-3xl font-black text-white">Contact Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              { icon: <MapPin className="w-6 h-6 text-yellow-400" />, label: 'Address',  value: 'Ahmedabad, Gujarat, India' },
              { icon: <Phone className="w-6 h-6 text-yellow-400" />,  label: 'Phone',    value: '+91 98765 43210' },
              { icon: <Mail className="w-6 h-6 text-yellow-400" />,   label: 'Email',    value: 'support@farmtrac.com' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-[#1a2e1a] border border-[#2d4a2d] rounded-xl flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <p className="text-[#4b6b4b] text-xs uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-green-300 text-sm font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-[#1a1200] border border-yellow-900/40 rounded-2xl p-8 text-center">
            <h3 className="text-white font-black text-xl mb-3">Ready to Get Started?</h3>
            <p className="text-yellow-700 text-sm mb-6">
              Join thousands of farmers and drivers already using FarmTrac across Gujarat.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register?role=farmer"
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-[#0a150a] font-extrabold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Wheat className="w-4 h-4" /> Register as Farmer
              </Link>
              <Link
                to="/register?role=driver"
                className="px-6 py-3 bg-[#111f11] border border-green-700 hover:border-green-500 text-green-300 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Tractor className="w-4 h-4" /> Register as Driver
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About