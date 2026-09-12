import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    

    // Category
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items:[
        {
            _id: false,
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            qty:{
                type:Number,
                default:1
            }
        }
    ]
    
  },
  {
    timestamps: true,
  }
);

const cartModel= mongoose.model("cart", cartSchema);
export default cartModel