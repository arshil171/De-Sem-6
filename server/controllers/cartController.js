import { cartModel } from "../models/cartModel.js"
import { productModel } from "../models/productModel.js"

// calculate total in cat
const calcTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)

// Get cart
export const getCart = async (req, res) => {
  try {
    let cart = await cartModel
      .findOne({ userId: req.user._id })
      .populate("items.productId")

    if (!cart) {
      cart = await cartModel.create({ userId: req.user._id, items: [], totalPrice: 0 })
    }

    res.status(200).json({ success: true, data: cart })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}

// Add cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    if (!productId) return res.status(400).json({ success: false, message: "Product ID required" })

    const product = await productModel.findById(productId)
    if (!product) return res.status(404).json({ success: false, message: "Product not found" })

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" })
    }

    let cart = await cartModel.findOne({ userId: req.user._id })
    if (!cart) {
      cart = await cartModel.create({ userId: req.user._id, items: [], totalPrice: 0 })
    }

    const existingItem = cart.items.find(
      item => item.productId.toString() === productId
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ productId, quantity, price: product.price })
    }

    cart.totalPrice = calcTotal(cart.items)
    await cart.save()

    const populated = await cart.populate("items.productId")

    res.status(200).json({ success: true, message: "Added to cart", data: populated })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}

// Update 
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params
    const { quantity } = req.body

    if (quantity < 1) return res.status(400).json({ success: false, message: "Quantity must be at least 1" })

    const cart = await cartModel.findOne({ userId: req.user._id })
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" })

    const item = cart.items.find(i => i.productId.toString() === productId)
    if (!item) return res.status(404).json({ success: false, message: "Item not in cart" })

    const product = await productModel.findById(productId)
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} in stock` })
    }

    item.quantity = quantity
    cart.totalPrice = calcTotal(cart.items)
    await cart.save()

    const populated = await cart.populate("items.productId")
    res.status(200).json({ success: true, message: "Cart updated", data: populated })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}

// Remove/Delete item from cart 
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params

    const cart = await cartModel.findOne({ userId: req.user._id })
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" })

    cart.items = cart.items.filter(i => i.productId.toString() !== productId)
    cart.totalPrice = calcTotal(cart.items)
    await cart.save()

    const populated = await cart.populate("items.productId")
    res.status(200).json({ success: true, message: "Item removed", data: populated })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}

// Clear cart 
export const clearCart = async (req, res) => {
  try {
    const cart = await cartModel.findOne({ userId: req.user._id })
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" })

    cart.items = []
    cart.totalPrice = 0
    await cart.save()

    res.status(200).json({ success: true, message: "Cart cleared", data: cart })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message })
  }
}