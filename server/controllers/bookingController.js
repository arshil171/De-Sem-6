// import bookingModel from "../models/bookingModel.js";
// import tractorModel from "../models/tractorModel.js";
// import { sendEmail } from "../utils/sendEmail.js";


// // create booking from farmer to tractor onwebkittransitionend(driver)
// export const createBooking = async (req, res) => {
//     try {
//         const { tractorId, hours, serviceType, farmLocation } = req.body;


//         if (!tractorId || !hours || !serviceType || !farmLocation) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required",
//             });
//         }

//         if (hours <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Hours must be greater than 0",
//             });
//         }

//         const tractor = await tractorModel
//             .findById(tractorId)
//             .populate("driverId", "name email");

//         if (!tractor) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Tractor not found",
//             });
//         }

//         if (!tractor.availability) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Tractor is not available",
//             });
//         }

//         const totalPrice = hours * tractor.pricePerHour;


//         const booking = await bookingModel.create({
//             farmerId: req.user._id,
//             driverId: tractor.driverId._id,
//             tractorId,
//             hours,
//             serviceType,
//             farmLocation,
//             totalPrice,
//             pricePerHour: tractor.pricePerHour,
//             status: "pending",
//         });


//         tractor.availability = false;
//         await tractor.save();


//         if (tractor.driverId?.email) {
//             await sendEmail(
//                 tractor.driverId.email,
//                 "New Booking Request ",
//                 `Hello ${tractor.driverId.name}, you have received a new booking request.`
//             );
//         }


//         res.status(201).json({
//             success: true,
//             message: "Booking created successfully & driver notified",
//             data: booking,
//         });

//     } catch (error) {
//         console.error("Create Booking Error:", error);

//         res.status(500).json({
//             success: false,
//             message: "Server Error",
//             error: error.message,
//         });
//     }
// };


// // driver get booking from user 
// export const getDriverBooking = async (req, res) => {
//     try {
//         // 1. Auth check
//         if (!req.user || !req.user._id) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized access",
//             });
//         }

//         // 2. Fetch bookings
//         const bookings = await bookingModel
//             .find({
//                 driverId: req.user._id,
//                 status: "pending",
//             })
//             .populate("farmerId", "name phone email")
//             .populate("tractorId", "tractorName pricePerHour")


//         if (!bookings || bookings.length === 0) {
//             return res.status(200).json({
//                 success: true,
//                 message: "No pending booking found",
//                 data: [],
//             });
//         }


//         res.status(200).json({
//             success: true,
//             message: "Driver booking fetched successfully",
//             count: bookings.length,
//             data: bookings,
//         });

//     } catch (error) {
//         console.error("Get Driver Bookings Error:", error);

//         res.status(500).json({
//             success: false,
//             message: "Server error while fetching bookings",
//             error: error.message,
//         });
//     }
// };


// export const acceptBooking = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!req.user || !req.user._id) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized access",
//             })
//         }

//         if (!id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Booking ID is required",
//             })
//         }

//         const booking = await bookingModel.findById(id).populate("farmerId", "name email").populate("tractorId", "tractorName availability")

//         if (!booking) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Booking Not found"
//             })
//         }

//         if (booking.driverId.toString() !== req.user._id.toString()) {
//             return res.status(403).json({
//                 success: false,
//                 message: `You are Not Allowed to  accept this booking`
//             })
//         }

//         if (booking.status !== "pending") {
//             return res.status(400).json({
//                 success: false,
//                 message: `Booking already ${booking.status}`
//             })
//         }

//         booking.status = "accepted";
//         booking.acceptedAt = new Date()

//         await booking.save()

//         const tractor = await tractorModel.findById(booking.tractorId._id)

//         if (tractor) {
//             tractor.availability = false;
//             await tractor.save()
//         }

//         if (booking.farmerId?.email) {
//             await sendEmail(
//                 booking.farmerId.email,
//                 "Booking Accepted 🚜",
//                 `Hello ${booking.farmerId.name}, your booking has been accepted by the driver.`
//             );
//         }
//         res.status(200).json({
//             success: true,
//             message: "Booking accepted successfully & farmer notified",
//             data: booking,
//         });

//     } catch (error) {
//         console.error("Accept Booking Error:", error);

//         res.status(500).json({
//             success: false,
//             message: "Server error while accepting booking",
//             error: error.message,
//         });
//     }
// }


// export const rejectBooking = async (req, res) => {
//     try {
//         const { id } = req.params

//         if (!req.user || !req.user._id) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized action",
//             })
//         }

//         if (!id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Booking ID is required",
//             });
//         }

//         const booking = await bookingModel
//             .findById(id)
//             .populate("farmerId", "name email")
//             .populate("tractorId", "tractorName availability");


//         if (!booking) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Booking not found",
//             });
//         }

//         if (booking.driverId.toString() !== req.user._id.toString()) {
//             return res.status(403).json({
//                 success: false,
//                 message: "You are not allowed to reject this booking",
//             });
//         }

//         if (booking.status !== "pending") {
//             return res.status(400).json({
//                 success: false,
//                 message: `Booking already ${booking.status}`,
//             });
//         }

//         booking.status = "cancelled";
//         booking.rejectedAt = new Date();

//         await booking.save();


//         const tractor = await tractorModel.findById(booking.tractorId._id);
//         if (tractor) {
//             tractor.availability = true;
//             await tractor.save();
//         }


//         if (booking.farmerId?.email) {
//             await sendEmail(
//                 booking.farmerId.email,
//                 "Booking Rejected ❌",
//                 `Hello ${booking.farmerId.name}, your booking request has been rejected by the driver.`
//             );
//         }

//         res.status(200).json({
//             success: true,
//             message: "Booking rejected successfully & farmer notified",
//             data: booking,
//         });
//     } catch (error) {
//         console.error("Reject Booking Error:", error);

//         res.status(500).json({
//             success: false,
//             message: "Server error while rejecting booking",
//             error: error.message,
//         });
//     }
// }



// export const completeBooking = async (req, res) => {
//     try {
//         const { id } = req.params;


//         if (!req.user || !req.user._id) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized access",
//             });
//         }


//         if (!id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Booking ID is required",
//             });
//         }


//         const booking = await bookingModel
//             .findById(id)
//             .populate("farmerId", "name email")
//             .populate("tractorId", "tractorName");

//         if (!booking) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Booking not found",
//             });
//         }

//         if (booking.driverId.toString() !== req.user._id.toString()) {
//             return res.status(403).json({
//                 success: false,
//                 message: "You are not allowed to complete this booking",
//             });
//         }


//         if (booking.status !== "accepted") {
//             return res.status(400).json({
//                 success: false,
//                 message: `Cannot complete booking with status: ${booking.status}`,
//             });
//         }


//         booking.status = "completed";
//         booking.completedAt = new Date();

//         await booking.save();


//         const tractor = await tractorModel.findById(booking.tractorId._id);
//         if (tractor) {
//             tractor.availability = true;
//             await tractor.save();
//         }


//         if (booking.farmerId?.email) {
//             await sendEmail(
//                 booking.farmerId.email,
//                 "Booking Completed ✅",
//                 `Hello ${booking.farmerId.name}, your booking has been successfully completed. Thank you for using our service 🚜`
//             );
//         }


//         res.status(200).json({
//             success: true,
//             message: "Booking completed successfully & farmer notified",
//             data: booking,
//         });

//     } catch (error) {
//         console.error("Complete Booking Error:", error);

//         res.status(500).json({
//             success: false,
//             message: "Server error while completing booking",
//             error: error.message,
//         });
//     }
// };



// export const getFarmerBookings = async (req, res) => {
//     try {

//         const bookings = await bookingModel
//             .find({ farmerId: req.user._id })
//             .populate("tractorId")
//             .populate("driverId", "name email")

//         res.status(200).json({
//             success: true,
//             count: bookings.length,
//             data: bookings
//         })

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server Error",
//             error: error.message
//         })
//     }
// }

// export const cancelBooking = async (req, res) => {
//     try {

//         const { id } = req.params

//         const booking = await bookingModel.findById(id)

//         if (!booking) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Booking not found"
//             })
//         }

//         if (booking.farmerId.toString() !== req.user._id.toString()) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Unauthorized"
//             })
//         }



//         if (booking.status === "completed") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Completed booking cannot be cancelled"
//             })
//         }

//         booking.status = "cancelled"

//         await booking.save()

//         // make tractor available again
//         const tractor = await tractorModel.findById(booking.tractorId)

//         if (tractor) {
//             tractor.availability = true
//             await tractor.save()
//         }

//         res.status(200).json({
//             success: true,
//             message: "Booking cancelled successfully",
//             data: booking
//         })

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server Error",
//             error: error.message
//         })
//     }
// }

// export const addReview = async (req, res) => {
//     try {

//         const { rating, review } = req.body

//         const booking = await bookingModel.findById(req.params.id)

//         if (!booking) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Booking not found"
//             })
//         }

//         if (booking.farmerId.toString() !== req.user._id.toString()) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Unauthorized"
//             })
//         }

//         booking.rating = rating
//         booking.review = review

//         await booking.save()

//         res.status(200).json({
//             success: true,
//             message: "Review added successfully",
//             data: booking
//         })

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server Error",
//             error: error.message
//         })
//     }
// }
import bookingModel from "../models/bookingModel.js";
import tractorModel from "../models/tractorModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { userModel } from "../models/userModel.js";


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
            pricePerHour: tractor.pricePerHour,
            status: "pending",
        });


        tractor.availability = false;
        await tractor.save();


        const farmer = await userModel.findById(req.user._id);

        if (tractor.driverId?.email && farmer) {
            const bookingDate = new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            const bookingTime = new Date(booking.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

            const mailText = `Hello ${tractor.driverId.name},

You have received a new tractor booking request.

Booking Details:
Booking ID: ${booking._id}
Farmer Name: ${farmer.name}
Farmer Email: ${farmer.email}
Date: ${bookingDate}
Time: ${bookingTime}
Status: Pending

Tractor Details:
Name: ${tractor.tractorName}
Type: ${tractor.tractorType}
Price Per Hour: ₹${tractor.pricePerHour}
Hours: ${hours}
Total Price: ₹${totalPrice}
Farm Location: ${farmLocation}

Please log in to your dashboard to accept or reject this request.`;

            await sendEmail(
                tractor.driverId.email,
                "New Tractor Booking Request",
                mailText
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
                status: { $in: ["pending", "accepted", "completed"] },
            })
            .populate("farmerId", "name phone email")
            .populate("tractorId", "tractorName pricePerHour")


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

        if (!req.user || !req.user._id) {
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

        const booking = await bookingModel.findById(id).populate("farmerId", "name email").populate("driverId", "name phone email").populate("tractorId", "tractorName availability")

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking Not found"
            })
        }

        const driverIdStr = booking.driverId._id ? booking.driverId._id.toString() : booking.driverId.toString();
        if (driverIdStr !== req.user._id.toString()) {
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
            const bookingDate = new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            const mailText = `Hello ${booking.farmerId.name},

Your booking request has been accepted by the driver.

Booking Details:
Driver Name: ${booking.driverId.name}
Driver Contact: ${booking.driverId.phone || '—'}
Tractor: ${booking.tractorId.tractorName}
Booking Date: ${bookingDate}
Status: Accepted`;

            await sendEmail(
                booking.farmerId.email,
                "Booking Accepted",
                mailText
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
            .populate("tractorId", "tractorName availability");


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
            .populate("driverId", "name email")
            .populate("tractorId", "tractorName");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        const driverIdStr = booking.driverId._id ? booking.driverId._id.toString() : booking.driverId.toString();
        const farmerIdStr = booking.farmerId._id ? booking.farmerId._id.toString() : booking.farmerId.toString();
        if (driverIdStr !== req.user._id.toString() && farmerIdStr !== req.user._id.toString()) {
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
            const bookingDate = new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            const bookingTime = new Date(booking.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            const completionTime = new Date(booking.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + " " + new Date(booking.completedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

            const mailText = `Hello ${booking.farmerId.name},

Your booking has been completed successfully.

Booking Details:
Booking ID: ${booking._id}
Farmer Name: ${booking.farmerId.name}
Driver Name: ${booking.driverId?.name || '—'}
Tractor Details: ${booking.tractorId?.tractorName || '—'}
Booking Date: ${bookingDate}
Booking Time: ${bookingTime}
Completion Time: ${completionTime}
Status = Completed

Thank you for using our service!`;

            await sendEmail(
                booking.farmerId.email,
                "Booking Completed Successfully",
                mailText
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



export const getFarmerBookings = async (req, res) => {
    try {

        const bookings = await bookingModel
            .find({ farmerId: req.user._id })
            .populate("tractorId")
            .populate("driverId", "name email")

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}

export const cancelBooking = async (req, res) => {
    try {

        const { id } = req.params

        const booking = await bookingModel.findById(id)

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            })
        }

        if (booking.farmerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            })
        }



        if (booking.status !== "pending" && booking.status !== "accepted") {
            return res.status(400).json({
                success: false,
                message: `Invalid transition. Booking cannot be cancelled because it is currently ${booking.status}.`
            });
        }

        booking.status = "cancelled"

        await booking.save()

        // make tractor available again
        const tractor = await tractorModel.findById(booking.tractorId)

        if (tractor) {
            tractor.availability = true
            await tractor.save()
        }

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}

export const addReview = async (req, res) => {
    try {

        const { rating, review } = req.body

        const booking = await bookingModel.findById(req.params.id)

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            })
        }

        if (booking.farmerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            })
        }

        booking.rating = rating
        booking.review = review

        await booking.save()

        res.status(200).json({
            success: true,
            message: "Review added successfully",
            data: booking
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        })
    }
}