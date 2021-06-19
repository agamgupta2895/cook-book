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
app.use("/status", (req, res) => {
  res.send("Cook book API is working, enjoy!");
});
app.use((req, res) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 5000;


// app.listen(PORT, () => {
//   console.log("Server listening on port " + PORT);
// });

const connection = "mongodb://localhost:27017/cook-book";

mongoose
  .connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server listening on port " + PORT);
      console.log(process.env)
    });
  })
  .catch((error) => {
    console.log("Something went wrong", error);
  });

mongoose.set("useFindAndModify", false);
