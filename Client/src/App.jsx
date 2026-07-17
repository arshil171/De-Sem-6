import React from "react";
import { Route, Routes } from "react-router";

import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Home           from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import TractorList    from "./pages/TractorList";
import BookTractor    from "./pages/BookTractor";
import MyBookings     from "./pages/MyBookings";
import Marketplace    from "./pages/Marketplace";
import Cart           from "./pages/Cart";
import OwnerDashboard from "./owner/OwnerDashboard";
import AddTractor     from "./owner/AddTractor";
import AddProduct     from "./owner/AddProduct";
import AdminDashboard from "./admin/AdminDashboard";  
import Navbar         from "./components/Navbar";
import Footer         from "./components/Footer";
import About from "./pages/About";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders    from "./pages/MyOrders";

const Layout = ({ children }) => (
  <><Navbar />{children}<Footer /></>
);

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"            element={<Login />} />
      <Route path="/register"         element={<Register />} />
      <Route path="/forgot-password"  element={<ForgotPassword />} />

      {/* With Navbar + Footer */}
      <Route path="/"                 element={<Layout><Home /></Layout>} />
      <Route path="/home"             element={<Layout><Home /></Layout>} />
      <Route path="/tractors"         element={<Layout><TractorList /></Layout>} />
      <Route path="/book-tractor/:id" element={<Layout><BookTractor /></Layout>} />
      <Route path="/my-bookings"      element={<Layout><MyBookings /></Layout>} />
      <Route path="/marketplace"      element={<Layout><Marketplace /></Layout>} />
      <Route path="/cart"             element={<Layout><Cart /></Layout>} />
      <Route path="/about"            element={<Layout><About /></Layout>} />

      {/* Driver */}
      <Route path="/owner/dashboard"   element={<Layout><OwnerDashboard /></Layout>} />
      <Route path="/owner/add-tractor" element={<Layout><AddTractor /></Layout>} />
      <Route path="/owner/add-product" element={<Layout><AddProduct /></Layout>} />

      {/* Admin */}
      <Route path="/admin/dashboard"   element={<AdminDashboard />} />

      <Route path="/order-success/:id" element={<Layout><OrderSuccess /></Layout>} />
      <Route path="/my-orders"         element={<Layout><MyOrders /></Layout>} />
    </Routes>
  );
};

export default App;