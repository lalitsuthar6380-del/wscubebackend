import express from "express";

const router = express.Router();

import {
  register,
  login,
  otpVerify,
  getMe,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/user.controller.js";

import { protect } from "../middleware/auth.js";


router.post("/register", register);

router.post("/login", login);

router.post("/verify-otp", otpVerify);

router.get("/get-me", protect, getMe);


// Logout
router.post("/logout", protect, logout);


// Profile
router.get("/profile", protect, getProfile);

router.put(
  "/update-profile",
  protect,
  updateProfile
);


// Password
router.put(
  "/change-password",
  protect,
  changePassword
);


// Address
router.post(
  "/add-address",
  protect,
  addAddress
);

router.put(
  "/update-address/:addressId",
  protect,
  updateAddress
);

router.delete(
  "/delete-address/:addressId",
  protect,
  deleteAddress
);

router.patch(
  "/set-default-address/:addressId",
  protect,
  setDefaultAddress
);


export default router;