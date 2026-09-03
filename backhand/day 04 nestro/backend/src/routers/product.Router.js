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

router.get("/", read);
router.get("/:id", readById);
router.post("/create", upload.single("thumbnail"), create);
router.patch("/status-update/:id", updateStatus);
router.put("/edit/:id", upload.single("thumbnail"), edit);
router.delete("/delete/:id", deleteById);
router.patch("/update-flag/:id", updateFlag);
router.patch("/add-Images/:id",upload.array("images",2) , addImages);

export default router;