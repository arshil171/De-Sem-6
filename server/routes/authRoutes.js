import express from "express"
import { register, login , forgotPassword , checkOtp, passwordChange, logout, googleLogin, subscribe } from "../controllers/authController.js"
// import { requireAuth } from "../middleware/authMiddleware"



const authRoute = express.Router()

authRoute.post("/login", login)
authRoute.post("/register", register)
authRoute.post("/forgotPassword", forgotPassword)
authRoute.post("/checkOtp", checkOtp)
authRoute.post("/passwordChange", passwordChange)
authRoute.post("/logout" , logout)
authRoute.post("/google", googleLogin)
authRoute.post("/subscribe", subscribe)

export default authRoute