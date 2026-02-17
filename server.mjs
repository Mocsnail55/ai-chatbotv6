import express from "express";
import path from "path";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
import { fileURLToPath } from "url";
console.log("DIRNAME:", __dirname);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, "..", "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, personality } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
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
              content: `You are a chatbot with a ${personality} personality. 
              Respond in that style. Do NOT describe the personality — behave like it.`
            },
            { role: "user", content: message }
          ],
          max_tokens: 150
        })
      }
    );

    const data = await response.json();
    console.log("RAW RESPONSE:", data);

    const reply =
      data.choices?.[0]?.message?.content ||
      "No response from model";

    res.json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
