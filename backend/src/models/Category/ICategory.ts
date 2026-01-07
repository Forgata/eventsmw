import { Types, Document } from "mongoose";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  parentCategoryId?: string | null;
}
