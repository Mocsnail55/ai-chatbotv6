import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "HTTP-Referer": "https://your-render-url.onrender.com",
        "X-Title": "MaxChatbot"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    console.log("FULL OPENROUTER RESPONSE:", data);

    if (!data.choices || !data.choices[0]) {
      return res.json({ reply: "No response from model." });
    }

    const reply = data.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ reply: "Server error." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));