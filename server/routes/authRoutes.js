const express = require("express")
const { register, login } = require("../controllers/authController")

const authRoute = express.Router()

authRoute.post("/login" , login)
authRoute.post("/registre" , register)