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

    console.log("API KEY:", process.env.GOOGLE_API_KEY); // Debug log for the new API key

    // Check if the API key is available
    if (!process.env.GOOGLE_API_KEY) {
      console.error("❌ GOOGLE_API_KEY is not set in environment variables.");
      return res.status(500).json({ error: "Google API key not configured." });
    }

    const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
  {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"]
    }
  }
    );

    // Find the image part in the response
    const imagePart = response.data?.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData?.mimeType?.startsWith("image/")
    );

    if (imagePart && imagePart.inlineData?.data) {
      const base64Image = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType;
      // Send the base64 data as a data URL
      res.status(200).json({ photo: `data:${mimeType};base64,${base64Image}` });
    } else {
      // Handle cases where no image part is found or data is missing
      console.error(
        "❌ Error generating image: No image data found in response."
      );
      res.status(500).json({
        error:
          "Error generating image: No image data received or unexpected response format.",
      });
    }
  } catch (err) {
    console.error("❌ Error generating image:", err.message);
    // Provide more specific error details if available from the API response
    if (err.response?.data) {
      console.error("API Error details:", err.response.data);
      res.status(err.response.status || 500).json({
        error:
          err.response.data.error ||
          err.response.data.message ||
          "Image generation failed.",
        details: err.response.data,
      });
    } else {
      res
        .status(500)
        .json({ error: "Image generation failed.", details: err.message });
    }
  }
};
