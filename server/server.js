import dotenv from "dotenv";
dotenv.config();
import express from "express"
import dbConnect from "./config/db.js"
import cors from "cors";
import authRoute from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import tractorRoute from "./routes/tractorRoutes.js";
import bookingRoute from "./routes/bookingRoutes.js";


const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/auth", authRoute)
app.use("/tractorAdd", tractorRoute)
app.use("/bookingPage" , bookingRoute)

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server is Not Running");
        return;
    }
    dbConnect();
    console.log("Server is Running at", PORT);
}); 