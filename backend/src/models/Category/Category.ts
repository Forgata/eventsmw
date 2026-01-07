import mongoose, { Schema, model } from "mongoose";
import type { ICategory } from "./ICategory.js";

// todo Add validations for required props where possible

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parentCategoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});

const Category = model<ICategory>("Category", CategorySchema);
export default Category;
