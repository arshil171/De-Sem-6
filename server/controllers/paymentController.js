import crypto from "crypto"
import razorpayInstance from "../config/razorpay.js"
import { orderModel } from "../models/orderModel.js"
import { cartModel }  from "../models/cartModel.js"

// ── Step 1: Create Razorpay Order ────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const cart = await cartModel
      .findOne({ userId: req.user._id })
      .populate("items.productId")

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" })
    }

    const amountInPaise = Math.round(cart.totalPrice * 100)

    const razorpayOrder = await razorpayInstance.orders.create({
      amount:   amountInPaise,
      currency: "INR",
      receipt:  `receipt_${req.user._id}_${Date.now()}`,
    })

    // Save order in DB with status "created"
    const order = await orderModel.create({
      userId:          req.user._id,
      items:           cart.items.map(item => ({
        productId: item.productId._id,
        name:      item.productId.name,
        price:     item.price,
        quantity:  item.quantity
      })),
      totalAmount:     cart.totalPrice,
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
    res.status(500).json({ success: false, message: "Failed to create order", error: error.message })
  }
}

// ── Step 2: Verify Payment & Clear Cart ──────────────────────────
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body

    // Verify signature
    const body      = razorpay_order_id + "|" + razorpay_payment_id
    const expected  = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_ID)
      .update(body)
      .digest("hex")

    if (expected !== razorpay_signature) {
      await orderModel.findByIdAndUpdate(dbOrderId, { status: "failed" })
      return res.status(400).json({ success: false, message: "Payment verification failed" })
    }

    // Update order status to paid
    await orderModel.findByIdAndUpdate(dbOrderId, {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status:            "paid"
    })

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
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
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