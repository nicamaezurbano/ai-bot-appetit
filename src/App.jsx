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
    // The main wrapper: Full screen, warm background, centered content
    <div className="min-h-screen bg-orange-50 text-stone-800 flex justify-center py-10 px-4 font-sans">
      
      {/* The White Card */}
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl border border-orange-100 h-fit">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-orange-600 mb-2">👨‍🍳 Bot Appetit</h1>
          <p className="text-stone-500 font-medium">What's in your fridge? Type it or upload a photo.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleCook} className="flex flex-col gap-5">
          <textarea
            placeholder="e.g. 2 eggs, half an onion, old tortillas..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full h-28 border-2 border-stone-200 rounded-xl p-4 resize-y focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          />
          
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="block w-full text-sm text-stone-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer transition"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] mt-2"
          >
            {loading ? 'Sharpening knives... 🔪' : 'Get Recipe'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-semibold">
            {error}
          </div>
        )}

        {/* Recipe Output */}
        {recipe && (
          <div className="mt-8 pt-8 border-t-2 border-stone-100">
             <div 
                className="recipe-output text-stone-700 leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: recipe }} 
             />
          </div>
        )}

      </div>
    </div>
  );
}

export default App;