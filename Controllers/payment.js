import { Payment } from "../Models/Payment.js";
import Razorpay from "razorpay";
import dotenv from "dotenv"

dotenv.config()

// Razorpay Configuration
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID; // Replace with your actual key_id
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET; // Replace with your actual key_secret



const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Checkout API
export const checkout = async (req, res) => {
  try {
    const { amount, cartItems, userShipping, userId } = req.body;

    var options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: amount,
      cartItems,
      userShipping,
      userId,
      payStatus: "created",
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating order", details: error.message });
  }
};

// Verify Payment and Save to DB
export const verify = async (req, res) => {
  try {
    const {
      orderId,
      paymentId,
      signature,
      amount,
      orderItems,
      userId,
      userShipping,
    } = req.body;

    let orderConfirm = await Payment.create({
      orderId,
      paymentId,
      signature,
      amount,
      orderItems,
      userId,
      userShipping,
      payStatus: "paid",
    });

    res.json({ message: "Payment successful", success: true, orderConfirm });
  } catch (error) {
    res.status(500).json({ error: "Error verifying payment", details: error.message });
  }
};

// Fetch User-Specific Orders
export const userOrder = async (req, res) => {
  try {
    let userId = req.user._id.toString();
    let orders = await Payment.find({ userId: userId }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user orders", details: error.message });
  }
};

// Fetch All Orders
export const allOrders = async (req, res) => {
  try {
    let orders = await Payment.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching all orders", details: error.message });
  }
};
