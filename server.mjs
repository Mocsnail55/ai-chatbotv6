import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL = "meta-llama/Llama-3.2-1B-Instruct"; // your model

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://router.huggingface.co/inference", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: HF_MODEL,
        input: userMessage
      })
    });

    const result = await response.json();

    const reply =
      result?.generated_text ||
      result?.output_text ||
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