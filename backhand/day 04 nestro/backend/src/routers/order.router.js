import express from "express";

const router = express.Router();

import {
    Orderplace,
    read,
    myOrders,
} from "../controllers/order.controller.js";

import {
    protect,
    authorized,
} from "../middleware/auth.js";

router.post("/place", protect, Orderplace);

router.post(
    "/",
    protect,
    authorized("admin", "superadmin"),
    read
);

router.get("/my-orders", protect, myOrders);

export default router;