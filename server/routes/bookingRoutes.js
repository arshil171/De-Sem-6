import express from "express";
import {
    createBooking,
    getDriverBooking,
    acceptBooking,
    rejectBooking,
    completeBooking
} from "../controllers/bookingController.js";

import { requireAuth, requireDriver } from "../middleware/authMiddleware.js";

const bookingRoute = express.Router();


// create booking 
bookingRoute.post("/create", requireAuth, createBooking);

//get Bookig
bookingRoute.get("/driver", requireAuth, requireDriver, getDriverBooking);

// accept booking 
bookingRoute.put("/accept/:id", requireAuth, requireDriver, acceptBooking);

// reject booking 
bookingRoute.put("/reject/:id", requireAuth, requireDriver, rejectBooking);

// complate Booking 
bookingRoute.put("/complete/:id", requireAuth, requireDriver, completeBooking);



export default bookingRoute;