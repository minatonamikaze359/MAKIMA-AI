// api/chat.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.AIzaSyCNZz9OJbs-vmsOcKT5rnrjh9JGfPZ7WoI; // stored securely in Vercel

    const lastMessage = messages[messages.length - 1]?.content || "";

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
    const botReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Makima is silent...";

    res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Makima encountered an error." });
  }
}
