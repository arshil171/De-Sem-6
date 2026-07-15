import express from "express";

import {
    requireAuth,
    requireAdmin
} from "../middleware/authMiddleware.js";

import {
    validateObjectId
} from "../middleware/validateObjectId.js";

import {
    createProduct,
    deleteProduct,
    deleteUser,
    getAdminAnalytics,
    getAdminProfile,
    getAllBookings,
    getAllProducts,
    getAllTractors,
    getAllUsers,
    getBookingById,
    getDashboardStats,
    getProductById,
    getTractorById,
    getUserById,
    updateBookingStatus,
    updateProduct,
    updateTractorAvailability,
    updateUserRole
} from "../controllers/adminController.js";

const adminRoute = express.Router();


// ==========================================
// TEST ROUTE
// ==========================================

adminRoute.get(
    "/test",
    requireAuth,
    requireAdmin,
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Admin access successful"
        });
    }
);


// ==========================================
// ADMIN PROFILE
// ==========================================

adminRoute.get(
    "/me",
    requireAuth,
    requireAdmin,
    getAdminProfile
);


// ==========================================
// DASHBOARD
// ==========================================

adminRoute.get(
    "/dashboard",
    requireAuth,
    requireAdmin,
    getDashboardStats
);

adminRoute.get(
    "/analytics",
    requireAuth,
    requireAdmin,
    getAdminAnalytics
);


// ==========================================
// USER MANAGEMENT
// ==========================================

adminRoute.get(
    "/users",
    requireAuth,
    requireAdmin,
    getAllUsers
);

adminRoute.get(
    "/users/:id",
    requireAuth,
    requireAdmin,
    validateObjectId,
    getUserById
);

adminRoute.patch(
    "/users/:id/role",
    requireAuth,
    requireAdmin,
    validateObjectId,
    updateUserRole
);

adminRoute.delete(
    "/users/:id",
    requireAuth,
    requireAdmin,
    validateObjectId,
    deleteUser
);


// ==========================================
// BOOKING MANAGEMENT
// ==========================================

adminRoute.get(
    "/bookings",
    requireAuth,
    requireAdmin,
    getAllBookings
);

adminRoute.get(
    "/bookings/:id",
    requireAuth,
    requireAdmin,
    validateObjectId,
    getBookingById
);

adminRoute.patch(
    "/bookings/:id/status",
    requireAuth,
    requireAdmin,
    validateObjectId,
    updateBookingStatus
);


// ==========================================
// TRACTOR MANAGEMENT
// ==========================================

adminRoute.get(
    "/tractors",
    requireAuth,
    requireAdmin,
    getAllTractors
);

adminRoute.get(
    "/tractors/:id",
    requireAuth,
    requireAdmin,
    validateObjectId,
    getTractorById
);

adminRoute.patch(
    "/tractors/:id/availability",
    requireAuth,
    requireAdmin,
    validateObjectId,
    updateTractorAvailability
);


// ==========================================
// PRODUCT MANAGEMENT
// ==========================================

adminRoute.get(
    "/products",
    requireAuth,
    requireAdmin,
    getAllProducts
);

adminRoute.get(
    "/products/:id",
    requireAuth,
    requireAdmin,
    validateObjectId,
    getProductById
);

adminRoute.post(
    "/products",
    requireAuth,
    requireAdmin,
    createProduct
);

adminRoute.put(
    "/products/:id",
    requireAuth,
    requireAdmin,
    validateObjectId,
    updateProduct
);

adminRoute.delete(
    "/products/:id",
    requireAuth,
    requireAdmin,
    validateObjectId,
    deleteProduct
);


export default adminRoute;