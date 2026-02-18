import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// ------------------------------
//  API ROUTE
// ------------------------------
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  const HF_TOKEN = process.env.HF_TOKEN;
  const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.3";

  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: HF_MODEL,
          messages: [{ role: "user", content: userMessage }],
          max_tokens: 200
        })
      }
    );

    const result = await response.json();
    const reply =
      result?.choices?.[0]?.message?.content ||
      "Model returned no response.";

    res.json({ reply });
  } catch (err) {
    console.error("HF Error:", err);
    res.json({ reply: "Error contacting server." });
  }
});

// ------------------------------
//  STATIC FILES (AFTER API ROUTE)
// ------------------------------
app.use(express.static("public"));

// ------------------------------
//  START SERVER (RENDER REQUIRES THIS)
// ------------------------------
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});