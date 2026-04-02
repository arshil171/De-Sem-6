import express from "express"

const bookingRoute = express.Router()


bookingRoute.get("/", (req, res) => {
    res.send("hello Arshil")
})

export default bookingRoute