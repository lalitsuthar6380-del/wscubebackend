import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      minLength: 4,
    },
    slug: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
      required: true

    },
    status: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

const RoomModel = mongoose.models.Room || mongoose.model("Room", schema);

export default RoomModel;
