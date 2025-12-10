export default async function handler(req, res) {
  // --- CORS erlauben ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONS (Preflight) abfangen
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const { table, type } = req.query || {};

  const now = new Date();
  const utcTime = now.toUTCString();
  let berlinTimeLocale;
  let berlinTimeLocaleString;

  try {
    berlinTimeLocale = now.toLocaleTimeString("de-DE", { timeZone: "Europe/Berlin" });
    berlinTimeLocaleString = now.toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
  } catch (e) {
    berlinTimeLocale = "Time error: " + e.message;
    berlinTimeLocaleString = "Time error: " + e.message;
  }

  const message = 
    `Service Anfrage\nTisch: ${table}\nAktion: ${type}\n` +
    `Zeit: ${berlinTimeLocaleString}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });

    const data = await response.json();

    if (!data.ok) {
      return res.status(500).json({ error: data });
    }

    res.status(200).json({ status: "OK", telegram: data });

  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: err.message });
  }
}
