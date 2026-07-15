import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dbConnect from "./config/db.js";

import authRoute from "./routes/authRoutes.js";
import tractorRoute from "./routes/tractorRoutes.js";
import bookingRoute from "./routes/bookingRoutes.js";
import productRoute from "./routes/productRoutes.js";
import cartRoute from "./routes/cartRoutes.js";
import adminRoute from "./routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());


// ==========================================
// ROUTES
// ==========================================

app.use("/auth", authRoute);
app.use("/admin", adminRoute);
app.use("/tractor", tractorRoute);
app.use("/booking", bookingRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);


// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
    try {
        await dbConnect();

        app.listen(PORT, () => {
            console.log(
                `Server is Running at ${PORT}`
            );
        });

    } catch (error) {
        console.log(
            "Failed to start server:",
            error.message
        );

        process.exit(1);
    }
};

startServer();