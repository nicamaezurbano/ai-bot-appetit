import express from 'express';
import serverless from 'serverless-http'; // The new wrapper
import { GoogleGenAI } from '@google/genai';

const app = express();
// Increase payload limit because Base64 strings are long
app.use(express.json({ limit: '10mb' })); 

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. A reusable helper function for retrying API calls
const generateWithRetry = async (aiConfig, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Try to make the API call
      return await ai.models.generateContent(aiConfig);
    } catch (error) {
      // Check if it's the specific 503 error AND we still have retries left
      if (error.status === 503 && i < maxRetries - 1) {
        console.log(`Server busy. Retrying in 2 seconds... (Attempt ${i + 1})`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      } else {
        // If it's a different error, or we ran out of retries, throw it
        throw error; 
      }
    }
  }
};

app.post('/api/generate-recipe', async (req, res) => {
  const { ingredients, imageBase64, mimeType } = req.body;

  try {
    const prompt = "You are a witty Master Chef. Create a recipe based on these ingredients. Format with Markdown.";
    let contentsArray = [prompt];
    
    if (ingredients) contentsArray.push(ingredients);

    if (imageBase64) {
      contentsArray.push({
        inlineData: { data: imageBase64, mimeType: mimeType }
      });
    }

    // 2. Use our new retry function instead of calling ai directly!
    const response = await generateWithRetry({
        model: 'gemini-3.1-flash-lite',
        contents: contentsArray
    });

    res.json({ recipe: response.text });
    
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "The kitchen is super busy right now! Please click get recipe again." });
  }
});

// Netlify Requirement: Export the wrapped app instead of app.listen()
export const handler = serverless(app);