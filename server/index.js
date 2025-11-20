import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import PostRouter from "./routes/Posts.js";
import GenerateImageRouter from "./routes/GenerateImage.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.use("/api/post", PostRouter);
app.use("/api/generateImage", GenerateImageRouter);

//Default get
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello GFG Developers!",
  });
});

const PORT = process.env.PORT || 8080;

const connectDB = () => {
  const mongoUrl = process.env.MONGODB_URL;

  if (!mongoUrl) {
    console.error("❌ MONGODB_URL is not configured in the environment.");
    process.exit(1);
  }

  mongoose.set("strictQuery", true);
  mongoose
    .connect(mongoUrl)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
      console.error("Failed to connect to DB");
      console.error(err);
      process.exit(1);
    });
};

//function to start the server
const startServer = async () => {
  try {
    connectDB();
    const server = app.listen(PORT, () =>
      console.log(`Server started on port ${PORT}`)
    );
    server.setTimeout(600000); // Set timeout to 10 minutes (600000 ms)
  } catch (error) {
    console.log(error);
  }
};

startServer();
