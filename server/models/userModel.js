const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    role: {
        type: String,
         enum: ["farmer", "driver" , "admin"],
        default: "farmer",
    },
})

export const userModel = mongoose.model("User" , userSchema)