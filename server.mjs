import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static("public"));

// Hugging Face model (Meta Llama)
const HF_MODEL = "meta-llama/Llama-3.2-3B-Instruct"; 
// You can swap to 1B, 8B, etc.

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.HF_KEY}`
        },
        body: JSON.stringify({
          inputs: userMessage,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7
          }
        })
      }
    );

    const data = await response.json();
    console.log("HF RESPONSE:", data);

    // Hugging Face returns different formats depending on the model
    const reply =
      data?.generated_text ||
      data?.[0]?.generated_text ||
      "Model returned no response.";

    res.json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ reply: "Server error." });
  }
});

// Render port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));