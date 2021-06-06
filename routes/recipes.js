import express from "express";
import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  bookMarkRecipe,
  getRecipesBySearch,
} from "../controllers/recipes.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getRecipes);
router.get("/search", getRecipesBySearch);
router.get("/:id", getRecipe);
router.post("/", auth, createRecipe);
router.patch("/:id", auth, updateRecipe);
router.delete("/:id", auth, deleteRecipe);
router.patch("/:id/like", auth, likeRecipe);
router.patch("/:id/bookMark", auth, bookMarkRecipe);

export default router;
