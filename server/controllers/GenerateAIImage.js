// // controllers/GenerateAIImage.js

// import axios from 'axios';

// export const generateImage = async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     const encodedParams = new URLSearchParams();
//     encodedParams.set('prompt', prompt);
//     encodedParams.set('width', '1024');
//     encodedParams.set('height', '1024');
//     encodedParams.set('seed', '918440');
//     encodedParams.set('model', 'flux');

//     const options = {
//       method: 'POST',
//       url: 'https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/fluximagegenerate/generateimage.php',
//       headers: {
//         'x-rapidapi-key': process.env.RAPIDAPI_KEY,  // Ensure this is added in your .env file
//         'x-rapidapi-host': 'ai-text-to-image-generator-flux-free-api.p.rapidapi.com',
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       data: encodedParams,
//     };

//     const response = await axios.request(options);
//     const image = response.data;  // Adjust based on actual response

//     res.status(200).json({ photo: image });

//   } catch (err) {
//     console.error("❌ Error generating image:", err.message);
//     res.status(500).send("Error generating image");
//     throw err;
//   }
// };

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0:generateImage?key=${process.env.GOOGLE_API_KEY}`,
      {
        prompt: { text: prompt }
      }
    );

    const base64Image = response.data.images[0].data;

    res.status(200).json({
      photo: `data:image/png;base64,${base64Image}`,
    });

  } catch (err) {
    console.error("❌ Backend error:", err.response?.data || err.message);

    res.status(err.response?.status || 500).json({
      error: "Image generation failed.",
      details: err.response?.data || err.message,
    });
  }
};
