import User from "../models/users.js";
import Recipe from "../models/recipes.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existingUser?.type?.includes("Google")) {
      return res.status(404).json({
        message:
          "User aready registed via Google, please sign in using your google account",
      });
    }

    const isPasswordCorrect = await bycrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password incorrect" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "secretkey",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token: token });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json(error);
  }
};

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "Email Id already exist" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password does not match" });
    }

    const hashedPassword = await bycrypt.hash(password, 12);

    const newUser = await User.create({
      email: email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      "secretkey",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: newUser, token: token });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const signupGoogle = async (req, res) => {
  const { firstName, lastName, email, googleId } = req.body;

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "secretkey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({ result: existingUser, token: token });
  }

  const newUser = await User.create({
    email: email,
    name: `${firstName} ${lastName}`,
    type: `Google ${googleId}`,
  });

  const token = jwt.sign(
    { email: newUser.email, id: newUser._id },
    "secretkey",
    { expiresIn: "1h" }
  );

  res.status(200).json({ result: newUser, token: token });
};

export const getUserDetails = async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId).populate("recipes");
  res.status(200).json(user);
};

export const getBookMarkedRecipesOfUsers = async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  const bookMakedRecipesArrayIds = user.bookMarkedRecipes;
  const records = await Recipe.find({ _id: { $in: bookMakedRecipesArrayIds } });
  res.status(200).json(records);
};
