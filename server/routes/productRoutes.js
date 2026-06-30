import express from "express"
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js"
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js"

const productRoute = express.Router()

productRoute.get("/", getAllProducts)
productRoute.get("/:id", getProduct)

productRoute.post("/", requireAuth, requireAdmin, createProduct)
productRoute.put("/:id", requireAuth, requireAdmin, updateProduct)
productRoute.delete("/:id", requireAuth, requireAdmin, deleteProduct)

export default productRoute