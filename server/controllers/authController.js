import { userModel } from "../models/userModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

export const register = async (req, res) => {
    try {
        let { name, email, password, role, phone } = req.body

        password = await bcrypt.hash(password, 10)

        if (!name || !password || !email || !role || !phone) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const existsUser = await userModel.findOne({ email })
        if (existsUser) {
            return res.status(409).json({
                message: "User already exists"
            })
        }

        const user = await userModel.create({
            name, email, password, role, phone
        })
        if (user) {
            return res.status(201).json({
                message: "User registered successfully"
            })
        }

    } catch (error) {
        res.status(500).json({ message: "Registratin Failed ", error })
    }
}

export const forgotPassword = async (req, res) => {
    let { email } = req.body

    if (!email) {
        return res.status(400).json({
            message: "All Fields are required"
        })
    }

    var user = await userModel.findOne({ email })
    console.log(user)

    if (!user) {
        return res.status(401).json({
            message: "Invalid Details"
        })
    } else {
        let otp = Math.floor(100000 + Math.random() * 900000)

        res.cookie("StoreOtp", otp)

        let transporter = nodemailer.createTransport({
            service: "gmail",

            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        let mailOption = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Reset Your FarmTrack Password",
            text: `Dear User,

                We received a request to reset your password for your FarmTrack account.

                If you made this request, please click the link below to reset your password:

                otp : ${otp}

                If you did not request a password reset, please ignore this email or contact our support team immediately.

                For any assistance, feel free to reach out to our support team at support@farmtrack.com.

                Thank you,
                FarmTrack Team
                Empowering Smart Farming`
        }

        transporter.sendMail(mailOption, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
                return res.status(200).json({
                    message: "OTP sent successfully"
                })
            }
        });

    }




}

export const checkOtp = async (req, res) => {
    let StoreOtp = req.cookies.StoreOtp

    let getOtp = req.body.otpNumber

    if (Number(getOtp) === Number(StoreOtp)) {
        return res.status(200).json({
            message: "OTP verified"
        })
    }
    else {
        console.log("otp didnt matched");
        return res.status(400).json({
            message: "Invalid OTP"
        })
    }
}



export const passwordChange = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword
        })

        res.status(200).json({
            message: "Password updated successfully"
        })

    } catch (error) {
        res.status(500).json({ message: "Error updating password" })
    }
}

export const login = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All Fields are required"
            })
        }

        const user = await userModel.findOne({ email })
        console.log(user)

        if (!user) {
            return res.status(401).json({
                message: "Invalid Details"
            })
        }
        else {
            bcrypt.compare(password, user.password, (error, result) => {
                if (result) {
                    const token = jwt.sign({
                        id: user._id,
                        role: user.role
                    }, process.env.JWT_SECRET, { expiresIn: "7d" })
                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: false
                    })

                    return res.status(200).json({
                        message: "Login successful",
                        token
                    })
                } else {
                    return res.status(400).json({
                        message: "password invalid"
                    })
                }
            })

        }

    } catch (error) {
        res.status(500).json({ message: "Login Failed ", error })
    }
}


export const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false
        });

        return res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Logout failed",
            error
        });
    }
};