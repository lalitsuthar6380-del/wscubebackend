import mongoose from "mongoose";

const productDatailsSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    qty: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [productDatailsSchema],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    shipping_charge: {
      type: Number,
      default: 0,
    },

    total_amount: {
      type: Number,
      required: true,
    },

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },

      mobile: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },

      addressLine: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        default: "India",
      },
    },

    payment_method: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },

    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    razorpay_payment_id: {
      type: String,
      default: null,
    },

    razorpay_order_id: {
      type: String,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    order_status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "return",
        "placed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;