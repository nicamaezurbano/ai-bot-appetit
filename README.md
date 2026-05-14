# 👨‍🍳 Bot Appétit

An AI-powered recipe generator optimized for ingredient-based meal planning. Tell the app what ingredients you have in your fridge (or upload a photo!), and it will instantly generate a creative, step-by-step recipe so you never have to wonder what's for dinner.

**[🔴 Live Demo: Bot Appétit on Netlify](https://ai-bot-appetit.netlify.app)**

---

## 🚀 Tech Stack

This project is built using a modern decoupled architecture and deployed in a serverless environment.

*   **Frontend:** React.js, Vite, Tailwind CSS
*   **Backend:** Node.js, Express.js
*   **AI Integration:** Google Gemini API (`@google/genai`)
*   **Deployment:** Netlify (Netlify Functions for serverless backend)

## ✨ Features

*   **Smart Recipe Generation:** Generates customized recipes based on a simple list of ingredients.
*   **Multimodal Vision Integration:** Upload a photo of your pantry or fridge, and the AI will identify the ingredients automatically.
*   **Modern UI/UX:** Fully responsive, fluid design built with Tailwind CSS.
*   **Serverless Backend:** Highly scalable and cost-effective API routing using Netlify Functions.

---

## 💻 How to Run Locally

Because this application relies on Netlify's serverless environment, the best way to run it locally is by using the Netlify CLI. This allows you to spin up both the Vite frontend and the Serverless backend in a single terminal window.

### Prerequisites
1.  **Node.js** installed on your machine.
2.  A free **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).
3.  The **Netlify CLI** installed globally. If you don't have it, run:
    ```bash
    npm install -g netlify-cli
    ```

### 1. Installation

Clone the repository and install the project dependencies:
```bash
git clone <your-repository-url>
cd bot-appetit
npm install
```


### 2. Environment Variables

Create a .env file in the root directory of the project and add your Gemini API key:
```bash
GEMINI_API_KEY=your_api_key_here
```
(Note: Ensure your .env file is listed in your .gitignore so you do not accidentally publish your key to GitHub)


### 3. Start the Development Server

Start the local development environment using the Netlify CLI. This command will simultaneously launch your Vite frontend and emulate the serverless backend.
```bash
netlify dev
```

The application will automatically open in your default browser, typically at
```bash
http://localhost:8888
```

