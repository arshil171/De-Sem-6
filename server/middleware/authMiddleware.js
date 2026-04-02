import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message: "Authentication Require"
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET)

        if (!decode) {
            return res.status(400).json({
                message: "Token  is invalid"
            })
        }


        req.user = {
            _id: decode.id,
            role: decode.role

        }

        next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}

export const requireAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access only"
        })
    }
    next()
}


export const requireDriver = (req, res, next) => {
    if (req.user.role !== "driver") {
        return res.status(403).json({
            message: "Admin access only"
        })
    }
    next()
}