import bookingModel from "../models/bookingModel.js";
import tractorModel from "../models/tractorModel.js";
import { sendEmail } from "../utils/sendEmail.js";


// create booking from farmer to tractor onwebkittransitionend(driver)
export const createBooking = async (req, res) => {
    try {
        const { tractorId, hours, serviceType, farmLocation } = req.body;


        if (!tractorId || !hours || !serviceType || !farmLocation) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (hours <= 0) {
            return res.status(400).json({
                success: false,
                message: "Hours must be greater than 0",
            });
        }

        const tractor = await tractorModel
            .findById(tractorId)
            .populate("driverId", "name email");

        if (!tractor) {
            return res.status(404).json({
                success: false,
                message: "Tractor not found",
            });
        }

        if (!tractor.availability) {
            return res.status(400).json({
                success: false,
                message: "Tractor is not available",
            });
        }

        const totalPrice = hours * tractor.pricePerHour;


        const booking = await bookingModel.create({
            farmerId: req.user._id,
            driverId: tractor.driverId._id,
            tractorId,
            hours,
            serviceType,
            farmLocation,
            totalPrice,
            status: "pending",
        });


        tractor.availability = false;
        await tractor.save();


        if (tractor.driverId?.email) {
            await sendEmail(
                tractor.driverId.email,
                "New Booking Request ",
                `Hello ${tractor.driverId.name}, you have received a new booking request.`
            );
        }


        res.status(201).json({
            success: true,
            message: "Booking created successfully & driver notified",
            data: booking,
        });

    } catch (error) {
        console.error("Create Booking Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};


// driver get booking from user 
export const getDriverBooking = async (req, res) => {
    try {
        // 1. Auth check
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        // 2. Fetch bookings
        const bookings = await bookingModel
            .find({
                driverId: req.user._id,
                status: "pending",
            })
            .populate("farmerId", "name phone email")
            .populate("tractorId", "name price image");


        if (!bookings || bookings.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No pending booking found",
                data: [],
            });
        }


        res.status(200).json({
            success: true,
            message: "Driver booking fetched successfully",
            count: bookings.length,
            data: bookings,
        });

    } catch (error) {
        console.error("Get Driver Bookings Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching bookings",
            error: error.message,
        });
    }
};


export const acceptBooking = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || !req.use._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            })
        }

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required",
            })
        }

        const booking = await bookingModel.findById(id).populate("farmerId", "name email").populate("tractorid", "name availability")

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking Not found"
            })
        }

        if (booking.driverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: `You are Not Allowed to  accept this booking`
            })
        }

        if (booking.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Booking already ${booking.status}`
            })
        }

        booking.status = "accepted";
        booking.acceptedAt = new Date()

        await booking.save()

        const tractor = await tractorModel.findById(booking.tractorId._id)

        if (tractor) {
            tractor.availability = false;
            await tractor.save()
        }

        if (booking.farmerId?.email) {
            await sendEmail(
                booking.farmerId.email,
                "Booking Accepted 🚜",
                `Hello ${booking.farmerId.name}, your booking has been accepted by the driver.`
            );
        }
        res.status(200).json({
            success: true,
            message: "Booking accepted successfully & farmer notified",
            data: booking,
        });

    } catch (error) {
        console.error("Accept Booking Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while accepting booking",
            error: error.message,
        });
    }
}


export const rejectBooking = async (req, res) => {
    try {
        const { id } = req.params

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized action",
            })
        }

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required",
            });
        }

        const booking = await bookingModel
            .findById(id)
            .populate("farmerId", "name email")
            .populate("tractorId", "name availability");


        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (booking.driverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to reject this booking",
            });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Booking already ${booking.status}`,
            });
        }

        booking.status = "cancelled";
        booking.rejectedAt = new Date();

        await booking.save();


        const tractor = await tractorModel.findById(booking.tractorId._id);
        if (tractor) {
            tractor.availability = true;
            await tractor.save();
        }


        if (booking.farmerId?.email) {
            await sendEmail(
                booking.farmerId.email,
                "Booking Rejected ❌",
                `Hello ${booking.farmerId.name}, your booking request has been rejected by the driver.`
            );
        }

        res.status(200).json({
            success: true,
            message: "Booking rejected successfully & farmer notified",
            data: booking,
        });
    } catch (error) {
        console.error("Reject Booking Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while rejecting booking",
            error: error.message,
        });
    }
}



import bookingModel from "../models/bookingModel.js";
import tractorModel from "../models/tractorModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const completeBooking = async (req, res) => {
    try {
        const { id } = req.params;

   
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required",
            });
        }

  
        const booking = await bookingModel
            .findById(id)
            .populate("farmerId", "name email")
            .populate("tractorId", "name");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (booking.driverId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to complete this booking",
            });
        }

       
        if (booking.status !== "accepted") {
            return res.status(400).json({
                success: false,
                message: `Cannot complete booking with status: ${booking.status}`,
            });
        }

      
        booking.status = "completed";
        booking.completedAt = new Date();

        await booking.save();

   
        const tractor = await tractorModel.findById(booking.tractorId._id);
        if (tractor) {
            tractor.availability = true;
            await tractor.save();
        }

        
        if (booking.farmerId?.email) {
            await sendEmail(
                booking.farmerId.email,
                "Booking Completed ✅",
                `Hello ${booking.farmerId.name}, your booking has been successfully completed. Thank you for using our service 🚜`
            );
        }

  
        res.status(200).json({
            success: true,
            message: "Booking completed successfully & farmer notified",
            data: booking,
        });

    } catch (error) {
        console.error("Complete Booking Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while completing booking",
            error: error.message,
        });
    }
};