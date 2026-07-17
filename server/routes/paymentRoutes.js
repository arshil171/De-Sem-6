import express from "express"
import {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById
} from "../controllers/paymentController.js"
import { requireAuth } from "../middleware/authMiddleware.js"

const paymentRoute = express.Router()

paymentRoute.post("/create-order",    requireAuth, createOrder)
paymentRoute.post("/verify",          requireAuth, verifyPayment)
paymentRoute.get("/my-orders",        requireAuth, getMyOrders)
paymentRoute.get("/my-orders/:id",    requireAuth, getOrderById)

export default paymentRoute