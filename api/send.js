export default async function handler(req, res) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const { table, type } = req.query || {};

  const time = new Date().toLocaleTimeString("de-DE", {
    timeZone: "Europe/Berlin",
  });

  const message = `Service Anfrage\nTisch: ${table}\nAktion: ${type}\nZeit: ${time}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });

    const data = await response.json();

    if (!data.ok) {
      return res.status(500).json({ error: data });
    }

    res.status(200).json({ status: "OK", telegram: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
