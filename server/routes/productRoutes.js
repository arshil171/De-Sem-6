import express from "express"
import {
  createProduct,
  getAllProducts,
  getProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js"
import { requireAuth, requireAdminOrDriver, requireDriver } from "../middleware/authMiddleware.js"

const productRoute = express.Router()

// Public
productRoute.get("/", getAllProducts)
productRoute.get("/:id", getProduct)

// Driver only
productRoute.get("/seller/my-products", requireAuth, requireDriver, getSellerProducts)

// Admin or Driver
productRoute.post("/", requireAuth, requireAdminOrDriver, createProduct)
productRoute.put("/:id", requireAuth, requireAdminOrDriver, updateProduct)
productRoute.delete("/:id", requireAuth, requireAdminOrDriver, deleteProduct)

export default productRoute