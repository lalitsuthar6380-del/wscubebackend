import express from "express";

const router = express.Router();

import {
    read,
    readById,
    create,
    deleteById,
    updateStatus,
    edit
} from "../controllers/room.controller.js";

import upload from "../middleware/upload.js";
import { authorized, protect } from "../middleware/auth.js";


// =====================
// PUBLIC ROUTES
// =====================

// Get all rooms
router.get("/", read);

// Get room by ID
router.get("/:id", readById);


// =====================
// ADMIN / SUPERADMIN ROUTES
// =====================

// Create room
router.post(
    "/create",
    protect,
    authorized(["admin", "superadmin"]),
    upload.single("image"),
    create
);

// Update room status
router.patch(
    "/status-update/:id",
    protect,
    authorized(["admin", "superadmin"]),
    updateStatus
);

// Edit room
router.put(
    "/edit/:id",
    protect,
    authorized(["admin", "superadmin"]),
    upload.single("image"),
    edit
);

// Delete room
router.delete(
    "/delete/:id",
    protect,
    authorized(["admin", "superadmin"]),
    deleteById
);


export default router;