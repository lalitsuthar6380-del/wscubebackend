import express from "express";
import dotenv from "dotenv";
import connectDB from "./confing/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import categoryRouter from "./routers/category.Router.js"
import roomRouter from "./routers/room.router.js"
import productRouter from "./routers/product.Router.js"
import userRouter from "./routers/user.Router.js"
import cartrouter from "./routers/cart.router.js"
import orderRouter from "./routers/order.router.js"

dotenv.config();

const app = express();

connectDB();
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Backend is Running...");
});

app.use("/api/category", categoryRouter);
app.use("/api/room-type", roomRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartrouter);
app.use("/api/order", orderRouter);

// Global error handler — catches multer/Cloudinary upload errors and returns JSON
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err?.message || err);
    res.status(err?.http_code || 500).json({
        success: false,
        message: err?.message || "Internal server error"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});