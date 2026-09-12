import UserModel from "../models/user.model.js";
import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.SECRET_KEY);

import jwt from "jsonwebtoken";

import {
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendNotFound,
  sendServerError,
  sendSuccess,
} from "../utils/response.js";

import sendOtpMail from "../utils/sendOtpMail.js";


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendBadRequest(
        res,
        "Name, email, and password are required"
      );
    }

    if (password.length < 6) {
      return sendBadRequest(
        res,
        "Password must be at least 6 characters"
      );
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return sendConflict(res, "Accound already exist");
    }

    const encryptedPass = cryptr.encrypt(password);

    const otp = Math.floor(Math.random() * 100000 + 800000);

    const otpExpire = Date.now() + 3 * 60 * 1000;

    await sendOtpMail(email, otp);

    await UserModel.create({
      name,
      email,
      password: encryptedPass,
      otp,
      otpExpire,
    });

    return res.status(201).json({
      message: "User accound create successfully",
      success: true,
      email: email,
    });
  } catch (error) {
    console.log(error);
    return sendServerError(res);
  }
};


export const getMe = async (req, res) => {
  try {
    const user = req.user;

    console.log("REQ.USER:", req.user);

    return res.status(200).json({
      message: "user data find",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return sendServerError(res);
  }
};


export const otpVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email });

    console.log(email, otp);

    if (!user) {
      return sendConflict(res, "Try Again");
    }

    if (user.isVerified === true) {
      return sendBadRequest(res);
    }

    if (user.otp != otp) {
      return sendBadRequest(res, "Invalid otp");
    }

    if (user.otpExpire < Date.now()) {
      return sendBadRequest(res, "otp expired");
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    return sendSuccess(res, "otp verfiy successfully");
  } catch (error) {
    console.log(error);
    return sendServerError(res);
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login Email:", email);

    const user = await UserModel.findOne({ email });

    if (!user) {
      return sendNotFound(res);
    }

    const decryptedPassword = cryptr.decrypt(user.password);

    console.log("Password Check");

    if (password !== decryptedPassword) {
      return sendBadRequest(res, "Incorrect password");
    }

    if (user.isVerified === false) {
      return sendBadRequest(
        res,
        "Please verify your accound"
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("token", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Login Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return sendServerError(res);
  }
};


export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    console.log(error);
    return sendServerError(res);
  }
};


/* =========================
   GET PROFILE
========================= */

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const user = await UserModel
      .findById(userId)
      .select("-password -otp -otpExpire");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });

  } catch (error) {
    console.log(error);
    return sendServerError(res);
  }
};


/* =========================
   UPDATE PROFILE
========================= */

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const {
      name,
      email,
      mobile,
    } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (email !== undefined) {
      user.email = email.trim().toLowerCase();
    }

    if (mobile !== undefined) {
      user.mobile = mobile.trim();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });

  } catch (error) {
    console.log(error);
    return sendServerError(res);
  }
};


/* =========================
   CHANGE PASSWORD
========================= */

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return sendBadRequest(
        res,
        "All password fields are required"
      );
    }

    if (newPassword.length < 6) {
      return sendBadRequest(
        res,
        "Password must be at least 6 characters"
      );
    }

    if (newPassword !== confirmPassword) {
      return sendBadRequest(
        res,
        "New password and confirm password do not match"
      );
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return sendNotFound(res, "User not found");
    }

    const decryptedPassword = cryptr.decrypt(
      user.password
    );

    if (currentPassword !== decryptedPassword) {
      return sendBadRequest(
        res,
        "Current password is incorrect"
      );
    }

    const encryptedPass = cryptr.encrypt(
      newPassword
    );

    user.password = encryptedPass;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.log(error);
    return sendServerError(res);
  }
};


/* =========================
   ADD ADDRESS
========================= */

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const {
      fullName,
      mobile,
      pincode,
      addressLine,
      city,
      state,
      country,
      isDefault,
    } = req.body;

    if (
      !fullName ||
      !mobile ||
      !pincode ||
      !addressLine ||
      !city ||
      !state
    ) {
      return sendBadRequest(
        res,
        "All address fields are required"
      );
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return sendNotFound(res, "User not found");
    }

    if (
      isDefault === true ||
      user.addresses.length === 0
    ) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    user.addresses.push({
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      pincode: pincode.trim(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country?.trim() || "India",
      isDefault:
        user.addresses.length === 0 ||
        isDefault === true,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });

  } catch (error) {
    console.log(error);
    return sendServerError(res);
  }
};


/* =========================
   SET DEFAULT ADDRESS
========================= */

export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const { addressId } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    user.addresses.forEach((item) => {
      item.isDefault = false;
    });

    address.isDefault = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      addresses: user.addresses,
    });

  } catch (error) {
    console.error(
      "Set Default Address Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


/* =========================
   UPDATE ADDRESS
========================= */

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const { addressId } = req.params;

    const {
      fullName,
      mobile,
      pincode,
      addressLine,
      city,
      state,
      country,
      isDefault,
    } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    if (fullName !== undefined) {
      address.fullName = fullName.trim();
    }

    if (mobile !== undefined) {
      address.mobile = mobile.trim();
    }

    if (pincode !== undefined) {
      address.pincode = pincode.trim();
    }

    if (addressLine !== undefined) {
      address.addressLine = addressLine.trim();
    }

    if (city !== undefined) {
      address.city = city.trim();
    }

    if (state !== undefined) {
      address.state = state.trim();
    }

    if (country !== undefined) {
      address.country = country.trim();
    }

    if (isDefault === true) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });

      address.isDefault = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses,
    });

  } catch (error) {
    console.error(
      "Update Address Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


/* =========================
   DELETE ADDRESS
========================= */

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const { addressId } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;

    user.addresses.pull(addressId);

    if (
      wasDefault &&
      user.addresses.length > 0
    ) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
    });

  } catch (error) {
    console.error(
      "Delete Address Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};