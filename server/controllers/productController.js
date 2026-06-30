import { productModel } from "../models/productModel.js"

// Admin: create product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body

    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }

    const product = await productModel.create({ name, description, price, category, stock, image })

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

// Admin: update product
export const updateProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!product) return res.status(404).json({ success: false, message: "Product not found" })
    res.status(200).json({ success: true, message: "Product updated", data: product })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}

//Admin: delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: "Product not found" })
    res.status(200).json({ success: true, message: "Product deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}