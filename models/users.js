import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  name: String,
  id: String,
  bookMarkedRecipes: {
    type: [String],
    default: [],
  },
  type: String,
  recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecipeSchema",
    },
  ],
});

const UserSchema = mongoose.model("UserSchema", userSchema);

export default UserSchema;
