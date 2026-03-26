import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
      required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["farmer", "driver", "admin"],
        default: "farmer",
    },
})

export const userModel = mongoose.model("User", userSchema)