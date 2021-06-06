import mongoose from "mongoose";

const recipeSchema = mongoose.Schema({
  name: String,
  description: [
    {
      id: String,
      step: String,
    },
  ],
  image: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSchema",
  },
  ingredients: [
    {
      id: String,
      ingredient: String,
      amount: String,
    },
  ],
  serves: Number,
  tags: [String],
  likes: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const RecipeSchema = mongoose.model("RecipeSchema", recipeSchema);

export default RecipeSchema;
