import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      enum: ["seeds", "fertilizer", "tools", "equipment"]
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const productModel = mongoose.model("product" , productSchema)

// {
//   _id: "661234abcd5678ef9012abcd",
//   name: "Urea Fertilizer",
//   price: 300,
//   category: "fertilizer",
//   stock: 50,
//   createdAt: "2026-03-26T10:00:00Z",
//   updatedAt: "2026-03-26T10:00:00Z"
// }