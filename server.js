import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

import userRouter from "./Routes/user.js";
import productRouter from "./Routes/product.js";
import cartRouter from "./Routes/cart.js";
import addressRouter from "./Routes/address.js";
import paymentRouter from "./Routes/payment.js";

import dotenv from "dotenv"

dotenv.config()

const app = express();
const _dirname = path.resolve();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// API Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/payment", paymentRouter);

// MongoDB Connection

const MONGO_URI=process.env.MONGO_URI

mongoose
  .connect(MONGO_URI, {
    dbName: "MERN_E_Commerce",
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Serve Static Files from React's Build Folder
app.use(express.static(path.join(_dirname, "..", "client", "dist")));

// Catch-All Route for React Router (Frontend)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "..", "client", "dist", "index.html"));
});

// Server Port
const PORT = 1001;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
