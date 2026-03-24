require("dotenv").config(); // ✅ MUST BE FIRST

const express = require("express");
const { dbConnect } = require("./config/db");

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", authRoute)

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server is Not Running");
        return;
    }
    dbConnect();
    console.log("Server is Running at", PORT);
}); 