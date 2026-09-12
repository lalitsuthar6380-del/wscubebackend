import express from "express";

const router = express.Router();

import {
    read,
    readById,
    create,
    deleteById,
    updateStatus,
    edit,
    updateFlag,
    addImages,
} from "../controllers/product.controller.js";

import upload from "../middleware/upload.js";
import { authorized, protect } from "../middleware/auth.js";


// =====================
// PUBLIC ROUTES
// =====================

// Get all products
router.get("/", read);

// Get product by ID
router.get("/:id", readById);


// =====================
// ADMIN / SUPERADMIN ROUTES
// =====================

// Create product
router.post(
    "/create",
    protect,
    authorized(["admin", "superadmin"]),
    upload.single("thumbnail"),
    create
);

// Update product status
router.patch(
    "/status-update/:id",
    protect,
    authorized(["admin", "superadmin"]),
    updateStatus
);

// Edit product
router.put(
    "/edit/:id",
    protect,
    authorized(["admin", "superadmin"]),
    upload.single("thumbnail"),
    edit
);

// Delete product
router.delete(
    "/delete/:id",
    protect,
    authorized(["admin", "superadmin"]),
    deleteById
);

// Update product flag
router.patch(
    "/update-flag/:id",
    protect,
    authorized(["admin", "superadmin"]),
    updateFlag
);

// Add product images
router.patch(
    "/add-Images/:id",
    protect,
    authorized(["admin", "superadmin"]),
    upload.array("images", 2),
    addImages
);


export default router;