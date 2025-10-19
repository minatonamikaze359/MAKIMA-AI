// api/chat.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    // Get messages from the frontend
    const { messages } = await req.body || {};

    if (!messages || !messages.length) {
      return res.status(400).json({ reply: "No messages provided." });
    }

    // ✅ Correct: read the key from Vercel environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    const lastMessage = messages[messages.length - 1]?.content || "";

    // Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: lastMessage }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Extract the bot reply
    const botReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Makima is silent...";

    // Send reply to frontend
    res.status(200).json({ reply: botReply });

  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ reply: "Makima encountered an error." });
  }
      }
