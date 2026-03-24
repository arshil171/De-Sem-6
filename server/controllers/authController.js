import { userModel } from "../models/userModel"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()

export const register = async (req, res) => {
    try {
        let { name, email, password, role } = req.body

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
            // redirect to login page
        }

    } catch (error) {
        res.status(500).json({ message: "Registratin Failed ", error })
    }
}

export const forgotPassword = async (req, res) => {
    let { email } = req.body
  
    

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
                    res.cookie("token", token)
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