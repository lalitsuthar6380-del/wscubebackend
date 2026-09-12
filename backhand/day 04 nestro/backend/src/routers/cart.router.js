import express from "express";
const router = express.Router();
import { sync } from "../controllers/cart.controller.js"
import { protect } from "../middleware/auth.js"


router.post("/sync", protect, sync);


export default router;