import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL = "meta-llama/Llama-3.2-1B-Instruct";

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(
      `https://router.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: userMessage
        })
      }
    );

    // If HF returns plain text like "Not Found", this prevents JSON crash
    const text = await response.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      console.error("HF returned non‑JSON:", text);
      return res.json({ reply: "Model returned no response." });
    }

    const reply =
      result?.generated_text ||
      result?.[0]?.generated_text ||
      "Model returned no response.";

    res.json({ reply });
  } catch (err) {
    console.error("HF Error:", err);
    res.json({ reply: "Error contacting server." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);