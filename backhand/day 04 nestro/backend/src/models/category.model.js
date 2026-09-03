import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        minLength: 4
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
        default: true
    }
  


},
    {
        timestamps: true
    }
)

const CategoryModel = mongoose.models.Category || mongoose.model("Category", schema);
export default CategoryModel;
