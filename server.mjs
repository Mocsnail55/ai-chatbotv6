import express from "express";
import path from "path";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
import { fileURLToPath } from "url";

// Fix: define __dirname BEFORE using it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("DIRNAME:", __dirname);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Fix: your public folder is in the SAME directory as server.mjs
app.use(express.static(path.join(__dirname, "public")));

// API route
app.post("/api/chat", async (req, res) => {
  try {
    const { message, personality } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "MyChatbot"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: `You are a chatbot with a ${personality} personality. Respond in that style.`
          },
          { role: "user", content: message }
        ],
        max_tokens: 150
      })
    });

    const data = await response.json();
    console.log("FULL OPENROUTER RESPONSE:", JSON.stringify(data, null, 2)); 

    const reply =
      data.choices?.[0]?.message?.content ||
      "No response from model";

    res.json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fix: only ONE fallback route, and correct path
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
