import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true
  },
  name:     { type: String,  required: true },
  price:    { type: Number,  required: true },
  quantity: { type: Number,  required: true }
})

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items:          [orderItemSchema],
  totalAmount:    { type: Number,  required: true },
  razorpayOrderId:  { type: String,  required: true },
  razorpayPaymentId:{ type: String,  default: "" },
  razorpaySignature:{ type: String,  default: "" },
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created"
  }
}, { timestamps: true })

export const orderModel = mongoose.model("Order", orderSchema)