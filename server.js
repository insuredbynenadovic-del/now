import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Reads ANTHROPIC_API_KEY from the environment (.env loaded via --env-file)
const client = new Anthropic();

app.use(express.json());
app.use(express.static(path.join(here, "public")));

app.post("/api/claude", async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Body must include a non-empty 'messages' array." });
  }

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 16000,
      messages,
    });

    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    res.json({ reply });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      res.status(401).json({ error: "Invalid or missing ANTHROPIC_API_KEY. Check your .env file." });
    } else if (error instanceof Anthropic.RateLimitError) {
      res.status(429).json({ error: "Rate limited by the Claude API. Try again shortly." });
    } else if (error instanceof Anthropic.APIError) {
      res.status(error.status || 500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unexpected server error." });
    }
  }
});

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
