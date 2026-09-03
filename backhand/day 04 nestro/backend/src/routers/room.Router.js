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

router.get("/", read);
router.get("/:id", readById);
router.post("/create", upload.single("image"), create);
router.patch("/status-update/:id", updateStatus);
router.put("/edit/:id", upload.single("image"), edit);
router.delete("/delete/:id", deleteById);

export default router;