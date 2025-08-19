import Post from "../models/Posts.js";
import * as dotenv from "dotenv";
import { createError } from "../error.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all posts

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(
      createError(
        error.status,
        error?.response?.data?.error?.message || error?.message
      )
    );
  }
};

//  Create Post
export const createPost = async (req, res, next) => {
  try {
    const { name, prompt, photo } = req.body;

    // Check if Cloudinary credentials are set
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("❌ Cloudinary credentials are not fully set.");
      return next(
        createError(500, "Cloudinary credentials not configured on the server.")
      );
    }

    console.log("Attempting to upload photo to Cloudinary...");
    const photoUrl = await cloudinary.uploader.upload(photo);
    console.log("Photo uploaded to Cloudinary:", photoUrl?.secure_url);

    console.log("Attempting to create post in MongoDB...");
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl?.secure_url,
    });
    console.log("Post created in MongoDB:", newPost);

    return res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.error("❌ Error in createPost:", error);
    // Determine the status code, default to 500 if not available
    const statusCode = error.status || 500;
    // Use a more informative error message
    const errorMessage =
      error?.response?.data?.error?.message ||
      error?.message ||
      "An unexpected error occurred while creating the post.";
    next(createError(statusCode, errorMessage));
  }
};
