import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  MessageCircle, X, Send, Bot, User, Loader2,
  Globe, Mic, MicOff, Volume2, VolumeX, ChevronDown,
  RefreshCw, AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// ── Rate limiting ─────────────────────────────────────────────
const RATE_LIMIT_MS  = 3000;   // min 3s between messages
const MAX_RETRIES    = 2;
const RETRY_DELAY_MS = 5000;

// ── Languages ─────────────────────────────────────────────────
const LANGUAGES = [
  { code: "en", label: "English",  speech: "en-IN" },
  { code: "hi", label: "हिंदी",    speech: "hi-IN" },
  { code: "gu", label: "ગુજરાતી",  speech: "gu-IN" },
  { code: "bn", label: "বাংলা",    speech: "bn-IN" },
  { code: "ta", label: "தமிழ்",    speech: "ta-IN" },
  { code: "te", label: "తెలుగు",   speech: "te-IN" },
  { code: "mr", label: "मराठी",    speech: "mr-IN" },
  { code: "kn", label: "ಕನ್ನಡ",    speech: "kn-IN" },
  { code: "pa", label: "ਪੰਜਾਬੀ",   speech: "pa-IN" },
  { code: "ur", label: "اردو",     speech: "ur-PK" },
];

// ── System prompts per role ───────────────────────────────────
const getSystemPrompt = (role) => {
  const base = `You are FarmBot, the official AI assistant for FarmTRAC — India's smart tractor booking platform.
Keep replies SHORT (max 3 sentences for voice). Be warm and helpful. Use ₹ for prices.
Always reply in the SAME language the user writes in.
Only answer FarmTRAC-related questions.

CRITICAL NAVIGATION RULE: When suggesting the user to visit a specific page, output EXACTLY this format: [NAVIGATE: Button Text](/path)
Examples:
- [NAVIGATE: Go to Tractors](/tractors)
- [NAVIGATE: My Bookings](/my-bookings)
- [NAVIGATE: Login](/login)
- [NAVIGATE: Driver Dashboard](/owner/dashboard)
- [NAVIGATE: Marketplace](/marketplace)`;

  const farmerPrompt = `${base}

YOU ARE HELPING A FARMER. Focus on:
1. BOOK TRACTOR → Tractors page → pick type (Ploughing/Harvesting/Seeding/Spraying) → fill location & hours → Confirm
2. MY BOOKINGS → track status: Pending → Accepted → Completed or Cancelled
3. MARKETPLACE → browse Seeds, Fertilizers, Tools, Equipment → Add to Cart
4. PAYMENT → Cart page → "Pay with Razorpay" → use UPI/card → get Order Success page
   Test card: 4111 1111 1111 1111 | CVV: any 3 digits | OTP: 1234 | Test UPI: success@razorpay
5. MY ORDERS → see all paid orders
6. FORGOT PASSWORD → email → OTP (check spam) → new password

COMMON ISSUES:
- Can't see tractors → must be logged in as Farmer
- Booking failed → tractor may no longer be available
- OTP not received → check spam, wait 2 min
- Payment failed → retry or use different method`;

  const driverPrompt = `${base}

YOU ARE HELPING A DRIVER/TRACTOR OWNER. Focus on:
1. DASHBOARD → "Dashboard" in navbar → see all your tractors
2. ADD TRACTOR → click "+ Add Tractor" → fill Name, Type, Price/hour, Location
3. EDIT/DELETE → on each tractor card → Edit or Delete buttons
4. AVAILABILITY → toggle each tractor Available/Unavailable on dashboard
5. BOOKINGS TAB → see incoming farmer booking requests → Accept or Reject
6. COMPLETE BOOKING → after job done → click "Mark as Completed"
7. ADD PRODUCT → "Add Product" in navbar → add to marketplace
8. EMAILS → you get email when farmer books your tractor

COMMON ISSUES:
- No bookings showing → check Bookings tab in Dashboard
- Can't add tractor → make sure you're logged in as Driver
- Toggle not working → refresh page and try again`;

  const adminPrompt = `${base}

YOU ARE HELPING AN ADMIN. Focus on:
1. ADMIN DASHBOARD → /admin/dashboard → see all stats (users, revenue, bookings, tractors)
2. MANAGE USERS → view all farmers and drivers → delete if needed
3. MANAGE BOOKINGS → see all bookings with status → update booking status
4. MANAGE TRACTORS → view all listed tractors → delete if needed
5. MANAGE PRODUCTS → add/edit/delete marketplace products
6. ANALYTICS → revenue, booking trends, user growth
7. PLATFORM STATS → total farmers, drivers, tractors, revenue from completed bookings

ADMIN POWERS:
- Can delete any user (except other admins)
- Can update any booking status
- Can manage all products in marketplace
- Can view full platform analytics`;

  if (role === "farmer") return farmerPrompt;
  if (role === "driver") return driverPrompt;
  if (role === "admin")  return adminPrompt;
  return `${base}

You are helping a guest user. Explain:
1. FarmTRAC connects farmers with tractor owners across India
2. Register as Farmer to book tractors and buy products
3. Register as Driver to list your tractor and earn money
4. Features: tractor booking, marketplace, Razorpay payments, AI chatbot
Encourage them to register!`;
};

// ── Fallback responses when API is down ──────────────────────
const FALLBACKS = {
  farmer: [
    "To book a tractor: go to Tractors page → choose type → fill location & hours → Confirm Booking.",
    "For payment issues: go to Cart → click Pay with Razorpay → use UPI success@razorpay for testing.",
    "To see your bookings: click 'My Bookings' in the navbar to track all your booking statuses.",
    "Forgot password? Click 'Forgot Password' on login page → enter email → enter OTP → set new password.",
  ],
  driver: [
    "To add a tractor: click 'Dashboard' → '+ Add Tractor' → fill Name, Type, Price, Location.",
    "To see booking requests: go to Dashboard → click 'Bookings' tab → Accept or Reject incoming requests.",
    "Toggle availability: on your Dashboard, click the toggle on each tractor card to set available/unavailable.",
    "To complete a booking: in Dashboard Bookings tab → click 'Mark as Completed' after the job is done.",
  ],
  admin: [
    "Admin dashboard at /admin/dashboard shows all platform stats including revenue and user counts.",
    "To manage products: go to /admin/products → Add, Edit, or Delete marketplace products.",
    "To manage users: go to /admin/users → view all farmers and drivers → delete if needed.",
    "To view all bookings: go to /admin/bookings → filter by status and search by farmer name.",
  ],
  guest: [
    "FarmTRAC connects farmers with tractor owners across India. Register as Farmer or Driver to get started!",
    "As a Farmer you can book tractors for Ploughing, Harvesting, Seeding, or Spraying.",
    "As a Driver you can list your tractor and earn money by accepting booking requests.",
  ],
};

// ── Greetings ─────────────────────────────────────────────────
const GREETINGS = {
  en: { farmer: "👋 Hello Farmer! I'm FarmBot. Ask me about booking tractors, payments, or marketplace!", driver: "👋 Hello Driver! I'm FarmBot. Ask me about managing your tractors, bookings, or earnings!", admin: "👋 Hello Admin! I'm FarmBot. Ask me about platform stats, users, or managing the system!", guest: "👋 Hello! I'm FarmBot — your FarmTRAC assistant. Ask me anything or register to get started!" },
  hi: { farmer: "👋 नमस्ते किसान भाई! मैं FarmBot हूँ। ट्रैक्टर बुकिंग, पेमेंट या बाज़ार के बारे में पूछें!", driver: "👋 नमस्ते ड्राइवर भाई! मैं FarmBot हूँ। ट्रैक्टर मैनेजमेंट या बुकिंग के बारे में पूछें!", admin: "👋 नमस्ते Admin! मैं FarmBot हूँ। प्लेटफॉर्म स्टैट्स या यूज़र मैनेजमेंट के बारे में पूछें!", guest: "👋 नमस्ते! मैं FarmBot हूँ। FarmTRAC के बारे में कुछ भी पूछें!" },
  gu: { farmer: "👋 નમસ્તે ખેડૂત ભાઈ! હું FarmBot છું। ટ્રેક્ટર બુકિંગ કે પેમેન્ટ વિશે પૂછો!", driver: "👋 નમસ્તે ડ્રાઇવર! હું FarmBot છું। ટ્રેક્ટર મેનેજ કે બુકિંગ વિશે પૂછો!", admin: "👋 નમસ્તે Admin! હું FarmBot છું। પ્લેટફોર્મ સ્ટેટ્સ વિશે પૂછો!", guest: "👋 નમસ્તે! હું FarmBot છું। FarmTRAC વિશે કંઈ પણ પૂછો!" },
};

const getGreeting = (lang, role) => {
  const g = GREETINGS[lang] || GREETINGS.en;
  return g[role] || g.guest;
};

// ── Quick suggestions ─────────────────────────────────────────
const SUGGESTIONS = {
  farmer: {
    en: ["How to book a tractor?", "How to pay in cart?", "Track my booking status", "OTP not received"],
    hi: ["ट्रैक्टर कैसे बुक करें?", "कार्ट में पेमेंट कैसे करें?", "मेरी बुकिंग का स्टेटस", "OTP नहीं मिला"],
    gu: ["ટ્રેક્ટર કેવી રીતે બુક કરવું?", "કાર્ટમાં પેમેન્ટ કેવી રીતે?", "મારી બુકિંગ સ્ટેટસ", "OTP ન આવ્યો"],
  },
  driver: {
    en: ["How to add my tractor?", "How to accept bookings?", "Toggle tractor availability", "How to add a product?"],
    hi: ["ट्रैक्टर कैसे जोड़ें?", "बुकिंग कैसे स्वीकार करें?", "ट्रैक्टर उपलब्धता बदलें", "प्रोडक्ट कैसे जोड़ें?"],
    gu: ["ટ્રેક્ટર કેવી રીતે ઉમેરવું?", "બુકિંગ કેવી રીતે સ્વીકારવી?", "ઉપલબ્ધતા ટૉગલ કરો", "પ્રોડક્ટ કેવી રીતે ઉમેરવો?"],
  },
  admin: {
    en: ["View platform stats", "How to manage users?", "Manage products", "View all bookings"],
    hi: ["प्लेटफॉर्म स्टैट्स देखें", "यूज़र कैसे मैनेज करें?", "प्रोडक्ट मैनेज करें", "सभी बुकिंग देखें"],
    gu: ["પ્લેટફોર્મ સ્ટેટ્સ જુઓ", "યૂઝર કેવી રીતે મેનેજ?", "પ્રોડક્ટ મેનેજ", "બધી બુકિંગ જુઓ"],
  },
  guest: {
    en: ["What is FarmTrac?", "How to register as Farmer?", "How to register as Driver?", "What services are offered?"],
    hi: ["FarmTrac क्या है?", "किसान के रूप में कैसे पंजीकृत हों?", "ड्राइवर के रूप में कैसे पंजीकृत हों?"],
    gu: ["FarmTrac શું છે?", "ખેડૂત તરીકે કેવી રીતે નોંધણી?", "ડ્રાઇવર તરીકે કેવી રીતે નોંધણી?"],
  },
};

const getSuggestions = (role, lang) => {
  const r = SUGGESTIONS[role] || SUGGESTIONS.guest;
  return r[lang] || r.en;
};

// ════════════════════════════════════════════════════════════
export default function ChatBot() {
  const { user }                = useAuth();
  const role                    = user?.role || "guest";
  const navigate                = useNavigate();

  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [language, setLanguage] = useState("en");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [retryCount, setRetryCount]     = useState(0);
  const [quotaError, setQuotaError]     = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);

  // voice
  const [isListening, setIsListening]   = useState(false);
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [autoSpeak, setAutoSpeak]       = useState(true);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [interim, setInterim]           = useState("");

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setVoiceSupported("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interim]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      if (messages.length === 0) {
        setMessages([{ role: "bot", text: getGreeting(language, role) }]);
      }
    } else {
      stopListening();
      stopSpeaking();
    }
  }, [isOpen]);

  // Reset messages when role changes (e.g. after login)
  useEffect(() => {
    if (messages.length > 0) {
      setMessages([{ role: "bot", text: getGreeting(language, role) }]);
    }
  }, [role]);

  // ── TTS ──────────────────────────────────────────────────
  const speak = useCallback((text, langCode) => {
    if (!autoSpeak || !window.speechSynthesis) return;
    stopSpeaking();
    const clean = text.replace(/[👋🎤🔊💳🚜🌾⚠️✅❌]/gu, "").trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    const lang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];
    utterance.lang   = lang.speech;
    utterance.rate   = 0.92;
    utterance.pitch  = 1.05;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const match  = voices.find(v => v.lang.startsWith(langCode) || v.lang.toLowerCase().includes(langCode));
    if (match) utterance.voice = match;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend   = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [autoSpeak]);

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  // ── STT ──────────────────────────────────────────────────
  const startListening = () => {
    if (!voiceSupported || isListening) return;
    stopSpeaking();
    const SR  = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    recognitionRef.current = rec;
    const lang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
    rec.lang           = lang.speech;
    rec.continuous     = false;
    rec.interimResults = true;
    rec.onstart  = () => { setIsListening(true); setInterim(""); };
    rec.onresult = (e) => {
      let final = "", inter = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else inter += t;
      }
      if (inter) setInterim(inter);
      if (final) { setInterim(""); setInput(p => (p + " " + final).trim()); }
    };
    rec.onerror = (e) => {
      setIsListening(false); setInterim("");
      if (e.error === "not-allowed") alert("Microphone access denied.");
    };
    rec.onend = () => { setIsListening(false); setInterim(""); };
    rec.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterim("");
  };

  // ── Fallback response ─────────────────────────────────────
  const getFallbackResponse = () => {
    const fb = FALLBACKS[role] || FALLBACKS.guest;
    return fb[Math.floor(Math.random() * fb.length)];
  };

  // ── Send to Gemini with retry ─────────────────────────────
  const sendMessage = async (textOverride, attempt = 0) => {
    const text = (textOverride || input).trim();
    if (!text || loading) return;

    // Rate limiting
    const now = Date.now();
    if (now - lastMessageTime < RATE_LIMIT_MS) {
      setMessages(prev => [...prev, {
        role: "bot",
        text: "⏳ Please wait a moment before sending another message.",
        isWarning: true,
      }]);
      return;
    }
    setLastMessageTime(now);

    stopListening();
    if (attempt === 0) {
      setInput("");
      setInterim("");
      setMessages(prev => [...prev, { role: "user", text }]);
    }
    setLoading(true);
    setQuotaError(false);

    try {
      const history = messages
        .filter(m => !m.isError && !m.isWarning)
        .slice(-10) // keep last 10 messages to reduce token usage
        .map(m => ({
          role:  m.role === "bot" ? "model" : "user",
          parts: [{ text: m.text }],
        }));

      const systemPrompt = getSystemPrompt(role);

      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [...history, { role: "user", parts: [{ text }] }],
          generationConfig: {
            temperature:     0.7,
            maxOutputTokens: 250,  // reduced to save quota
          },
        }),
      });

      const data = await res.json();

      // Handle quota / rate limit errors
      if (data.error) {
        const code = data.error.code || data.error.status;
        const msg  = data.error.message || "";

        if ((res.status === 429 || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) && attempt < MAX_RETRIES) {
          // Auto retry after delay
          setMessages(prev => [...prev, {
            role: "bot",
            text: `⏳ AI is busy, retrying in ${RETRY_DELAY_MS / 1000}s... (${attempt + 1}/${MAX_RETRIES})`,
            isWarning: true,
          }]);
          setTimeout(() => sendMessage(text, attempt + 1), RETRY_DELAY_MS);
          return;
        }

        if (res.status === 429 || msg.includes("quota")) {
          setQuotaError(true);
          const fallback = getFallbackResponse();
          setMessages(prev => [...prev, {
            role: "bot",
            text: `⚠️ AI quota exceeded. Here's a quick answer:\n\n${fallback}\n\n_For more help, try again in a few minutes._`,
            isWarning: true,
          }]);
          return;
        }

        throw new Error(msg);
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
        || "Sorry, I couldn't understand. Please try again.";

      setRetryCount(0);
      setMessages(prev => [...prev, { role: "bot", text: reply }]);
      if (autoSpeak) setTimeout(() => speak(reply, language), 300);

    } catch (err) {
      console.error("ChatBot error:", err);

      if (attempt < MAX_RETRIES && !err.message?.includes("quota")) {
        setTimeout(() => sendMessage(text, attempt + 1), 2000);
        return;
      }

      setMessages(prev => [...prev, {
        role: "bot",
        text: "⚠️ Connection error. Check your internet and try again.",
        isError: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{ role: "bot", text: getGreeting(language, role) }]);
    setQuotaError(false);
  };

  const currentLang  = LANGUAGES.find(l => l.code === language);
  const suggestions  = getSuggestions(role, language);

  // Role badge for header
  const roleBadge = {
    farmer: { label: "🌾 Farmer Mode",  cls: "bg-green-900/60 text-green-300 border-green-800" },
    driver: { label: "🚜 Driver Mode",   cls: "bg-yellow-900/60 text-yellow-300 border-yellow-800" },
    admin:  { label: "⚙️ Admin Mode",    cls: "bg-red-900/60 text-red-300 border-red-800" },
    guest:  { label: "👤 Guest",         cls: "bg-[#1a2e1a] text-[#4b6b4b] border-[#2d4a2d]" },
  }[role];

  // Helper to render message with navigation buttons
  const renderMessageContent = (text, msgRole) => {
    // Regex to find [NAVIGATE: Text](/path)
    const regex = /\[NAVIGATE:\s*([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const label = match[1];
      const path = match[2];
      parts.push(
        <button
          key={match.index}
          onClick={() => {
            setIsOpen(false);
            navigate(path);
          }}
          className="flex items-center gap-2 mt-3 mb-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-[#080f08] text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95 group"
        >
          {label}
          <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
        </button>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return (
      <div className="whitespace-pre-wrap">
        {parts.map((part, i) => (typeof part === 'string' ? <span key={i}>{part}</span> : part))}
      </div>
    );
  };

  return (
    <>
      {/* ── Floating button ──────────────────────── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-yellow-600 hover:bg-yellow-500 text-[#080f08] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
        aria-label="Open FarmBot"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {isSpeaking && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#080f08] animate-pulse" />
        )}
        {quotaError && !isOpen && (
          <span className="absolute -top-1 -left-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-[#080f08]" />
        )}
      </button>

      {/* ── Chat window ──────────────────────────── */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[390px] flex flex-col bg-[#0c190c]/95 backdrop-blur-xl border border-[#3a5a3a]/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden"
          style={{ maxHeight: "640px", animation: "slideUp .2s ease-out" }}
        >
          {/* Voice overlay */}
          {isListening && (
            <div className="absolute inset-0 bg-[#080f08]/95 flex flex-col items-center justify-center z-20 rounded-2xl">
              <div className="relative flex items-center justify-center mb-8">
                {[1,2,3].map(i => (
                  <div key={i} className="absolute rounded-full border-2 border-yellow-500/40"
                    style={{ width:`${60+i*40}px`, height:`${60+i*40}px`,
                      animation:`ripple 1.5s ease-out ${i*.3}s infinite` }} />
                ))}
                <button onClick={stopListening}
                  className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center z-10 shadow-lg transition-colors">
                  <MicOff className="w-7 h-7 text-white" />
                </button>
              </div>
              <p className="text-yellow-400 font-bold text-base mb-1">Listening…</p>
              <p className="text-green-400 text-sm mb-4">{currentLang?.label}</p>
              {interim && (
                <div className="mx-6 px-4 py-3 bg-[#1a2e1a] rounded-xl text-green-200 text-sm text-center max-w-xs">
                  {interim}…
                </div>
              )}
              <p className="text-[#4b6b4b] text-xs mt-4">Tap button to stop</p>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#111f11] border-b border-[#2d4a2d] shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-yellow-600 rounded-xl flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-[#080f08]" />
                </div>
                {isSpeaking && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-[#111f11] animate-pulse" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold text-sm leading-none">FarmBot</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${roleBadge.cls}`}>
                    {roleBadge.label}
                  </span>
                </div>
                <p className="text-[10px] font-semibold flex items-center gap-1.5 mt-0.5">
                  {isSpeaking ? (
                    <><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"/><span className="text-green-400">Speaking…</span></>
                  ) : isListening ? (
                    <><span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"/><span className="text-red-400">Listening…</span></>
                  ) : quotaError ? (
                    <><span className="w-1.5 h-1.5 bg-orange-400 rounded-full"/><span className="text-orange-400">Limited mode</span></>
                  ) : (
                    <><span className="w-1.5 h-1.5 bg-green-400 rounded-full"/><span className="text-green-400">Online · Gemini AI</span></>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Clear chat */}
              <button
                onClick={clearChat}
                title="Clear chat"
                className="p-1.5 rounded-lg border bg-[#1a2e1a] border-[#2d4a2d] text-[#4b6b4b] hover:text-green-300 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Mute toggle */}
              <button
                onClick={() => { setAutoSpeak(a => !a); stopSpeaking(); }}
                title={autoSpeak ? "Mute voice" : "Enable voice"}
                className={`p-1.5 rounded-lg border text-xs transition-all ${
                  autoSpeak
                    ? "bg-green-900/40 border-green-800 text-green-400"
                    : "bg-[#1a2e1a] border-[#2d4a2d] text-[#4b6b4b]"
                }`}
              >
                {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Language picker */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(m => !m)}
                  className="flex items-center gap-1 px-2 py-1.5 bg-[#1a2e1a] hover:bg-[#243a24] border border-[#2d4a2d] rounded-lg text-green-300 text-[11px] font-semibold transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  {currentLang?.label}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-[#111f11] border border-[#2d4a2d] rounded-xl overflow-hidden z-30 w-36 shadow-xl max-h-56 overflow-y-auto">
                    {LANGUAGES.map(lang => (
                      <button key={lang.code}
                        onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                        className={`w-full text-left px-3 py-2.5 text-xs transition-colors ${
                          language === lang.code
                            ? "bg-yellow-600 text-[#080f08] font-bold"
                            : "text-green-300 hover:bg-[#1a2e1a]"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quota warning banner */}
          {quotaError && (
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-950/50 border-b border-orange-900/50">
              <AlertCircle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <p className="text-orange-300 text-[10px]">
                AI quota reached. Using offline answers. Full AI resumes in ~1 hour.
              </p>
            </div>
          )}

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ maxHeight: "400px" }}
            onClick={() => setShowLangMenu(false)}
          >
            {/* Suggestions */}  
            {messages.length === 1 && (
              <div className="space-y-1.5 mb-2">
                <p className="text-[#3a5a3a] text-[10px] font-bold uppercase tracking-widest">
                  Quick questions for {role}
                </p>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)}
                    className="w-full text-left px-3 py-2 bg-[#1a2e1a] hover:bg-[#243a24] border border-[#2d4a2d] hover:border-yellow-700 text-green-300 text-xs rounded-xl transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Chat messages */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "bot" && (
                  <div className="w-7 h-7 bg-yellow-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-[#080f08]" />
                  </div>
                )}
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-yellow-500 text-[#080f08] font-medium rounded-tr-sm"
                    : msg.isError
                    ? "bg-red-950/80 border border-red-900/50 text-red-300 rounded-tl-sm"
                    : msg.isWarning
                    ? "bg-orange-950/50 border border-orange-900/50 text-orange-200 rounded-tl-sm"
                    : "bg-[#1a2e1a]/80 border border-[#2d4a2d]/50 text-green-50 rounded-tl-sm"
                }`}>
                  {renderMessageContent(msg.text, msg.role)}
                  {msg.role === "bot" && !msg.isError && !msg.isWarning && (
                    <button onClick={() => speak(msg.text, language)}
                      className="ml-2 opacity-30 hover:opacity-80 transition-opacity" title="Read aloud">
                      <Volume2 className="w-3 h-3 inline" />
                    </button>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 bg-[#2d4a2d] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-green-400" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 bg-yellow-600 rounded-lg flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#080f08]" />
                </div>
                <div className="bg-[#1a2e1a] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0,150,300].map(d => (
                    <span key={d} className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay:`${d}ms` }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="p-3 bg-[#111f11] border-t border-[#2d4a2d] shrink-0">
            {interim && (
              <div className="mb-2 px-3 py-2 bg-[#1a2e1a] border border-yellow-800/50 rounded-xl text-yellow-300 text-xs italic">
                {interim}…
              </div>
            )}

            <div className="flex items-end gap-2 bg-[#0c190c] border-2 border-[#2d4a2d] focus-within:border-yellow-600 rounded-xl px-3 py-2 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={isListening ? "Listening… speak now" : `Ask FarmBot (${role} mode)…`}
                rows={1}
                className="flex-1 bg-transparent outline-none text-green-100 text-sm placeholder-[#4b6b4b] resize-none max-h-20"
                style={{ lineHeight: "1.5" }}
              />

              {voiceSupported && (
                <button
                  onClick={() => isListening ? stopListening() : startListening()}
                  disabled={loading}
                  title={isListening ? "Stop recording" : "Speak your question"}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all disabled:opacity-40 ${
                    isListening
                      ? "bg-red-600 hover:bg-red-500 text-white animate-pulse"
                      : "bg-[#1a2e1a] hover:bg-[#2d4a2d] border border-[#2d4a2d] text-green-400"
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              <button
                onClick={() => sendMessage()}
                disabled={(!input.trim() && !interim) || loading}
                className="w-8 h-8 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-[#080f08] rounded-lg flex items-center justify-center shrink-0 transition-colors"
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between mt-1.5 px-1">
              <p className="text-[#3a5a3a] text-[10px]">
                {voiceSupported ? "🎤 Voice + Text · Gemini AI" : "Powered by Google Gemini AI"}
              </p>
              {isSpeaking && (
                <button onClick={stopSpeaking} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">
                  Stop speaking
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(16px) scale(.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);   }
        }
        @keyframes ripple {
          0%   { transform:scale(.8); opacity:.8; }
          100% { transform:scale(1.6); opacity:0; }
        }
      `}</style>
    </>
  );
}