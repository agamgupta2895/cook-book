import express from "express";
import {
  signin,
  signup,
  signupGoogle,
  getUserDetails,
  getBookMarkedRecipesOfUsers,
} from "../controllers/users.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/signup-google", signupGoogle);
router.get("/userDetails", auth, getUserDetails);
router.get("/userDetails/recipes", auth, getUserDetails);
router.get("/bookMarkedRecipes", auth, getBookMarkedRecipesOfUsers);

export default router;
