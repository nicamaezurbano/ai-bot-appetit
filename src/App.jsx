import { useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './App.css'; // We'll add some basic styles next

function App() {
  const [ingredients, setIngredients] = useState('');
  const [image, setImage] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. New Helper Function: Converts Image to Base64 Text
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); 
    reader.onerror = error => reject(error);
  });

  const handleCook = async (e) => {
    e.preventDefault(); 
    if (!ingredients && !image) {
      setError("Give me something to work with! 🧅");
      return;
    }

    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      // 2. Convert the image if it exists
      let imageBase64 = null;
      let mimeType = null;
      if (image) {
        imageBase64 = await toBase64(image);
        mimeType = image.type;
      }

      // 3. Send as standard JSON instead of FormData
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, imageBase64, mimeType })
      });

      const data = await response.json();

      if (!response.ok || data.error) throw new Error(data.error || "Server error");

      const rawHtml = marked.parse(data.recipe);
      setRecipe(DOMPurify.sanitize(rawHtml));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>👨‍🍳 Bot Appetit</h1>
      <p>What's in your fridge? Type it or upload a photo.</p>

      <form onSubmit={handleCook}>
        <textarea
          placeholder="e.g. 2 eggs, half an onion, old tortillas..."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="file-input"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Sharpening knives... 🔪' : 'Get Recipe'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {/* Dangerously Set Inner HTML is safe here because we used DOMPurify */}
      {recipe && (
        <div 
          className="recipe-output" 
          dangerouslySetInnerHTML={{ __html: recipe }} 
        />
      )}
    </div>
  );
}

export default App;