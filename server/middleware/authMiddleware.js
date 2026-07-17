import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication Required"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(400).json({
                message: "Token  is invalid"
            })
        }


        req.user = {
            _id: decoded.id,
            role: decoded.role

        }

        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}

export const requireAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access only"
        })
    }
    next()
}


export const requireDriver = (req, res, next) => {
    if (req.user.role !== "driver") {
        return res.status(403).json({
            success: false,
            message: "driver access only"
        })
    }
    next()
}

export const requireAdminOrDriver = (req, res, next) => {
    if (req.user.role !== "admin" && req.user.role !== "driver") {
        return res.status(403).json({
            success: false,
            message: "Access restricted to admins and drivers"
        })
    }
    next()
}