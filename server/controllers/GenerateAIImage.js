import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const formatDataUrl = (base64, mimeType = "image/png") =>
  `data:${mimeType};base64,${base64}`;

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        error: "Prompt is required to generate an image.",
      });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GOOGLE_API_KEY is not configured on the server.",
      });
    }

    // Preferred image models; env value takes precedence if valid.
    const requestedModel = process.env.GOOGLE_IMAGE_MODEL;
    const fallbacks = [
      requestedModel,
      "gemini-2.5-flash-image", // primary Gemini image model
      "imagen-4", // Imagen high quality (may be single image only)
      "gemini-2.5-flash", // can interleave text+image
    ].filter(Boolean);

    const aspectRatio = process.env.GOOGLE_IMAGE_ASPECT_RATIO || "1:1";
    const ai = new GoogleGenAI({ apiKey });

    const attempted = [];
    let lastError = null;
    let successResponse = null;
    for (const model of fallbacks) {
      try {
        const r = await ai.models.generateContent({
          model,
          contents: [prompt.trim()],
          config: {
            response_modalities: ["IMAGE"],
            image_config: { aspect_ratio: aspectRatio },
          },
        });
        // If we got parts with image data, keep it; else treat as failure to allow next fallback.
        const parts = r?.parts || [];
        const imagePart = parts.find((p) => p.inline_data);
        if (imagePart?.inline_data?.data) {
          successResponse = { model, r, imagePart };
          break;
        } else {
          attempted.push({ model, error: "No image data returned" });
        }
      } catch (e) {
        const code = e?.response?.status || e?.status || "UNKNOWN";
        const msg =
          e?.response?.data?.error?.message || e?.message || "Request failed";
        attempted.push({ model, code, message: msg });
        lastError = e;
        // Continue only if NOT_FOUND or similar; otherwise abort to surface real issue.
        if (!/NOT_FOUND|404/.test(JSON.stringify(e))) break;
      }
    }

    if (!successResponse) {
      return res.status(502).json({
        error:
          "Image generation failed: no suitable model produced image data.",
        attemptedModels: attempted,
        hint: "Set GOOGLE_IMAGE_MODEL=gemini-2.5-flash-image (enabled in your AI Studio) and verify the model is available. Some 'gemini-3' variants may be text-only or not yet supported for generateContent image output.",
        lastError:
          lastError?.response?.data?.error?.message ||
          lastError?.message ||
          null,
      });
    }

    const { imagePart } = successResponse;
    const base64 = imagePart.inline_data.data;
    const mimeType = imagePart.inline_data.mime_type || "image/png";
    return res.status(200).json({
      photo: formatDataUrl(base64, mimeType),
      modelUsed: successResponse.model,
      aspectRatio,
    });
  } catch (err) {
    console.error("❌ Error generating image (Google):", err?.response || err);
    // Google errors often include error.status / error.message structure
    const status = err?.response?.status || err?.status || 500;
    const providerMsg =
      err?.response?.data?.error?.message ||
      err?.response?.data?.error ||
      err?.message;

    return res.status(status).json({
      error: providerMsg || "Image generation failed.",
      details: err?.response?.data || null,
    });
  }
};
