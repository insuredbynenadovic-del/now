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

// Compact a lead into the essentials so Jarvis can reason over the whole book
// without burning tokens on noise.
function compactLead(l) {
  const notes = (l.notes || []).map((n) => n.text).join(" | ").slice(0, 240);
  return [
    [l.firstName, l.lastName].filter(Boolean).join(" ") || "(no name)",
    l.phone, l.state, l.stage, l.priority,
    l.closeProb != null ? l.closeProb + "/10" : "",
    l.objection ? "objection:" + l.objection : "",
    l.appointmentAt ? "appt:" + l.appointmentAt : "",
    l.followUpAt ? "follow:" + l.followUpAt : "",
    l.lastContact ? "last:" + l.lastContact : "",
    notes ? "notes:" + notes : "",
  ].filter(Boolean).join(" · ");
}

// Talking Jarvis — ask anything about your book, it reasons over the real leads.
app.post("/api/jarvis", async (req, res) => {
  const { question, leads } = req.body;
  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Ask a question." });
  }
  const book = Array.isArray(leads) ? leads : [];
  const roster = book.map(compactLead).join("\n");
  const system =
    "You are Jarvis, a sharp, direct sales operations manager for a health insurance agent. " +
    "You have the agent's full lead book below. Answer their question using ONLY these leads. " +
    "Be specific: name real leads, cite their stage/objection/close-odds, and give the exact next move or words to say. " +
    "Be concise and action-focused — no fluff. If the book doesn't contain the answer, say so plainly.\n\n" +
    "=== LEAD BOOK (" + book.length + " leads) ===\n" + roster;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4000,
      system,
      messages: [{ role: "user", content: question }],
    });
    const reply = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    res.json({ reply });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      res.status(401).json({ error: "Invalid or missing ANTHROPIC_API_KEY. Check your .env file." });
    } else if (error instanceof Anthropic.RateLimitError) {
      res.status(429).json({ error: "Rate limited — try again in a moment." });
    } else if (error instanceof Anthropic.APIError) {
      res.status(error.status || 500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unexpected server error." });
    }
  }
});

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
