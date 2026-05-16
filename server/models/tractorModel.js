import mongoose from "mongoose";

const tractorSchema = new mongoose.Schema(
{
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    tractorName: {
        type: String,
        required: true,
        trim: true
    },

    tractorType: {
        type: String,
        enum: ["Ploughing", "Harvesting", "Seeding", "Spraying"],
        required: true
    },

    pricePerHour: {
        type: Number,
        required: true,
        min: 100
    },

    maxHoursPerBooking: {
        type: Number,
        default: 8 
    },

    location: { 
        type: String,
        required: true
    },

    availability: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

 const tractorModel = mongoose.model("Tractor", tractorSchema);

 export default tractorModel


// {
//   driverId: "abc123",
//   tractorName: "Mahindra 575",
//   pricePerHour: 500,
//   location: "Ahmedabad",
//   availability: true
// }


// 👉 Driver Inputs Needed: 3 or 4

// Field	Input Needed
// driverId	❌ No (auto)
// tractorName	✅ Yes
// pricePerHour	✅ Yes
// location	✅ Yes
// availability	⚠️ Optional
// Default: true