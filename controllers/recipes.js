import mongoose from "mongoose";
import Recipe from "../models/recipes.js";
import User from "../models/users.js";

export const getRecipes = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 9;
    const startIndex = (Number(page) - 1) * LIMIT; //get starting index of every pages
    const total = await Recipe.countDocuments({});

    const recipes = await Recipe.find()
      .populate("author")
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    res.status(200).json({
      data: recipes,
      currentPage: Number(page),
      totalPages: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    res.status(404).json(err);
  }
};

export const getRecipesBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    let recipes;

    const searchTitle = new RegExp(searchQuery, "i");
    recipes = await Recipe.find({
      $or: [{ name: searchTitle }, { tags: { $in: tags?.split(",") } }],
    });

    res.status(200).json(recipes);
  } catch (error) {
    console.log(error);
  }
};

export const getRecipe = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("Id does not exist");
  try {
    const recipe = await Recipe.findById(id);
    res.json(recipe);
  } catch (err) {
    res.json(err);
  }
};

export const createRecipe = async (req, res) => {
  const recipeData = req.body;
  const userId = req.userId;
  const newRecipe = new Recipe(recipeData);
  newRecipe.author = userId;
  try {
    const recipe = await newRecipe.save();
    const user = await User.findById(userId);
    user.recipes.push(recipe);
    await user.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.json(err);
  }
};

export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const updatedRecipeBody = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("Id does not exist");

  const updatedRecipe = await Recipe.findByIdAndUpdate(
    id,
    { ...updatedRecipeBody, id },
    { new: true }
  );

  res.json(updatedRecipe);
};

export const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("Id does not exist");

  const deletedRecipe = await Recipe.findByIdAndDelete(id);
  const user = await User.findById(userId);
  user.recipes = user.recipes.filter((recId) => recId !== id);

  const updatedUserRecipes = await User.findByIdAndUpdate(userId, user, {
    new: true,
  });

  res.json({
    message: "Recipe Deleted",
    recipe: deletedRecipe,
    user: updatedUserRecipes,
  });
};

export const likeRecipe = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.json({ message: "Unauthenticated" });

  const recipe = await Recipe.findById(id);

  const index = recipe.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    recipe.likes.push(req.userId);
  } else {
    recipe.likes = recipe.likes.filter((id) => id !== String(req.userId));
  }
  const likedRecipe = await Recipe.findByIdAndUpdate(id, recipe, { new: true });
  res.json(likedRecipe);
};

export const bookMarkRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.userId;
  if (!req.userId) return res.json({ message: "Unauthenticated" });

  const user = await User.findById(userId);

  console.log("User", user);

  const index = user.bookMarkedRecipes.findIndex((id) => id === recipeId);

  if (index === -1) {
    user.bookMarkedRecipes.push(recipeId);
  } else {
    user.bookMarkedRecipes = user.bookMarkedRecipes.filter(
      (id) => id !== recipeId
    );
  }

  const savedRecipe = await User.findByIdAndUpdate(userId, user, { new: true });

  res.json({ message: "Recipes saved", data: savedRecipe });
};
