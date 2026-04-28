import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
{
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },

    tractorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tractor",
        required: true
    },


    hours: {
        type: Number,
        required: true,
        min: 1
    },

    serviceType: {
        type: String,
        enum: ["Ploughing", "Harvesting", "Seeding", "Spraying"],
        required: true
    },

    farmLocation: {
        type: String,
        required: true
    },

   
    pricePerHour: {
        type: Number,
        required: true
    },

    totalPrice: {
        type: Number,
        required: true
    },

    
    status: {
        type: String,
        enum: ["pending", "accepted", "completed", "cancelled"],
        default: "pending"
    },

    
    startTime: {
        type: Date
    },

    endTime: {
        type: Date
    },

  
    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    review: {
        type: String
    }

},
{
    timestamps: true
});

export const bookingModel = mongoose.model("Booking", bookingSchema);