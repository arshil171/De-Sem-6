import crypto from "crypto"
import dotenv from "dotenv"
dotenv.config()
import razorpayInstance from "../config/razorpay.js"
import { orderModel } from "../models/orderModel.js"
import { cartModel }  from "../models/cartModel.js"
import { productModel } from "../models/productModel.js"

// ── Step 1: Create Razorpay Order ────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const cart = await cartModel
      .findOne({ userId: req.user._id })
      .populate("items.productId")

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" })
    }

    // Guard: filter out any cart items whose product was deleted from DB
    const validItems = cart.items.filter(item => item.productId !== null)

    if (validItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All cart items are unavailable. Please update your cart."
      })
    }

    // Check stock availability before creating order
    for (const item of validItems) {
      if (item.productId.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.productId.name}". Only ${item.productId.stock} left.`
        })
      }
    }

    // Recalculate total from valid items (don't trust stored totalPrice)
    const totalPrice    = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const amountInPaise = Math.round(totalPrice * 100)

    if (amountInPaise < 100) {
      return res.status(400).json({ success: false, message: "Minimum order amount is ₹1" })
    }

    // Safety: ensure Razorpay keys are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET_ID) {
      console.error("❌ Razorpay keys missing! Check .env file.")
      return res.status(500).json({
        success: false,
        message: "Payment gateway not configured. Contact support."
      })
    }

    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount:   amountInPaise,
      currency: "INR",
      receipt:  `rcpt_${req.user._id.toString().slice(-8)}_${Date.now()}`,
    })

    // Save pending order in DB
    const order = await orderModel.create({
      userId:          req.user._id,
      items:           validItems.map(item => ({
        productId: item.productId._id,
        name:      item.productId.name,
        price:     item.price,
        quantity:  item.quantity
      })),
      totalAmount:     totalPrice,
      razorpayOrderId: razorpayOrder.id,
      status:          "created"
    })

    res.status(201).json({
      success: true,
      data: {
        orderId:   razorpayOrder.id,
        amount:    razorpayOrder.amount,
        currency:  razorpayOrder.currency,
        dbOrderId: order._id,
        key:       process.env.RAZORPAY_KEY_ID
      }
    })
  } catch (error) {
    console.error("Create Order Error:", error)
    // Surface Razorpay API error detail to the frontend for better debugging
    const message =
      error?.error?.description ||
      error?.response?.data?.description ||
      error?.message ||
      "Failed to create order"
    res.status(500).json({ success: false, message, error: error.message })
  }
}

// ── Step 2: Verify Payment & Clear Cart ──────────────────────────
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body

    // Validate all required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !dbOrderId) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification fields"
      })
    }

    // Verify Razorpay signature
    const body     = razorpay_order_id + "|" + razorpay_payment_id
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_ID)
      .update(body)
      .digest("hex")

    if (expected !== razorpay_signature) {
      await orderModel.findByIdAndUpdate(dbOrderId, { status: "failed" })
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature."
      })
    }

    // Fetch order to get items for stock decrement
    const order = await orderModel.findById(dbOrderId)
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    // Mark order as paid
    await orderModel.findByIdAndUpdate(dbOrderId, {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status:            "paid"
    })

    // ✅ Decrement stock for each purchased item (prevent overselling)
    for (const item of order.items) {
      await productModel.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      )
    }

    // Clear the cart
    await cartModel.findOneAndUpdate(
      { userId: req.user._id },
      { items: [], totalPrice: 0 }
    )

    res.status(200).json({
      success: true,
      message: "Payment successful",
      orderId: dbOrderId
    })
  } catch (error) {
    console.error("Verify Payment Error:", error)
    res.status(500).json({
      success: false,
      message: "Payment verification error",
      error: error.message
    })
  }
}

// ── Get My Orders ─────────────────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.user._id })
      .populate("items.productId", "name category")
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, count: orders.length, data: orders })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}

// ── Get Single Order ──────────────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate("items.productId", "name category")

    if (!order) return res.status(404).json({ success: false, message: "Order not found" })

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" })
    }

    res.status(200).json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}