import express from "express";

const router = express.Router();

import {
    read,
    readById,
    create,
    deleteById,
    updateStatus,
    edit
} from "../controllers/category.controller.js";

import upload from "../middleware/upload.js";
import { authorized, protect } from "../middleware/auth.js";

// =====================
// PUBLIC ROUTES
// =====================

// Get all categories
router.get("/", read);

// Get category by ID
router.get("/:id", readById);


// =====================
// PROTECTED ROUTES
// =====================

// Create category
router.post(
    "/create",
    protect,
    authorized(["admin", "superadmin"]),
    upload.single("image"),
    create
);

// Update category status
router.patch(
    "/status-update/:id",
    protect,
    authorized(["admin", "superadmin"]),
    updateStatus
);

// Edit category
router.put(
    "/edit/:id",
    protect,
    authorized(["admin", "superadmin"]),
    upload.single("image"),
    edit
);

// Delete category
router.delete(
    "/delete/:id",
    protect,
    authorized(["admin", "superadmin"]),
    deleteById
);

export default router;