import express from 'express';
import serverless from 'serverless-http'; // The new wrapper
import { GoogleGenAI } from '@google/genai';

const app = express();
// Increase payload limit because Base64 strings are long
app.use(express.json({ limit: '10mb' })); 

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/generate-recipe', async (req, res) => {
  // We extract the Base64 string directly from the body now!
  const { ingredients, imageBase64, mimeType } = req.body;

  try {
    const prompt = "You are a witty Master Chef. Create a recipe based on these ingredients. Format with Markdown.";
    let contentsArray = [prompt];
    
    if (ingredients) contentsArray.push(ingredients);

    if (imageBase64) {
      contentsArray.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contentsArray
    });

    res.json({ recipe: response.text });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "The kitchen is on fire! (API Error)" });
  }
});

// Netlify Requirement: Export the wrapped app instead of app.listen()
export const handler = serverless(app);