import express from "express"
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js"
import { requireAuth } from "../middleware/authMiddleware.js"

const cartRoute = express.Router()

cartRoute.get("/", requireAuth, getCart)
cartRoute.post("/add", requireAuth, addToCart)
cartRoute.put("/update/:productId", requireAuth, updateCartItem)
cartRoute.delete("/remove/:productId", requireAuth, removeFromCart)
cartRoute.delete("/clear", requireAuth, clearCart)

export default cartRoute