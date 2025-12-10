export default async function handler(req, res) {

  // ******** CORS FIX (Vercel-kompatibel) ********
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight Request (OPTIONS) sofort beenden
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  // **********************************************

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const { table, type } = req.query || {};

  const now = new Date();
  const berlinTime = now.toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

  const message = `Service Anfrage\nTisch: ${table}\nAktion: ${type}\nZeit: ${berlinTime}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data });
    }

    return res.status(200).json({ ok: true, telegram: data });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
