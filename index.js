import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import recipeRoutes from "./routes/recipes.js";
import userRoutes from "./routes/users.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/recipes", recipeRoutes);
app.use("/users", userRoutes);
app.use("/", (req, res) => {
  res.send("Cook book API is working!");
});
app.use((req, res) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server listening on port " + PORT);
    });
  })
  .catch((error) => {
    console.log("Something went wrong", error);
  });

mongoose.set("useFindAndModify", false);
