import { productModel } from "../models/productModel.js"

// Admin or Driver: create product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body

    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }

    // Set sellerId only if the creator is a driver
    const sellerId = req.user.role === "driver" ? req.user._id : null

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      stock,
      image,
      sellerId
    })

    res.status(201).json({ success: true, message: "Product created successfully", data: product })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}

// Get all products (public)
export const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query

    let filter = {}
    if (category && category !== "all") filter.category = category
    if (search) filter.name = { $regex: search, $options: "i" }

    const products = await productModel.find(filter).sort({ createdAt: -1 })

    res.status(200).json({ success: true, count: products.length, data: products })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: "Product not found" })
    res.status(200).json({ success: true, data: product })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}

// Get products added by the current driver
export const getSellerProducts = async (req, res) => {
  try {
    const products = await productModel.find({ sellerId: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, count: products.length, data: products })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}

// Admin or Driver: update product
export const updateProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: "Product not found" })

    // If driver, check ownership
    if (req.user.role === "driver" && String(product.sellerId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to update this product" })
    }

    const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json({ success: true, message: "Product updated", data: updatedProduct })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}

// Admin or Driver: delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: "Product not found" })

    // If driver, check ownership
    if (req.user.role === "driver" && String(product.sellerId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this product" })
    }

    await productModel.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: "Product deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}