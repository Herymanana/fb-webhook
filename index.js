const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Token verification (tsy maintsy mitovy amin'ny Verify Token apetrakao ao amin’ny Facebook Developer)
const VERIFY_TOKEN = "my_secret_token";

// ? GET /webhook (Facebook verification)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verified!");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// ? POST /webhook (Messenger events)
app.post("/webhook", (req, res) => {
  let body = req.body;

  if (body.object === "page") {
    body.entry.forEach(entry => {
      let event = entry.messaging[0];
      console.log("📩 Event reçu:", event);
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// ✅ Privacy Policy Route
app.get("/privacy", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Privacy Policy</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
          h1 { color: #2c3e50; }
          p { margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <h1>Politique de Confidentialité</h1>
        <p>Cette application <strong>MessengerBotIA</strong> utilise uniquement les messages envoyés à la Page Facebook 
        afin de fournir des réponses automatiques grâce à une intelligence artificielle.</p>
        <p>Les données ne sont <strong>ni partagées ni revendues</strong> à des tiers.</p>
        <p>Les messages peuvent être temporairement traités par le serveur pour générer une réponse, 
        mais ne sont pas stockés de manière permanente.</p>
        <p>Si vous souhaitez supprimer vos données, vous pouvez contacter l’administrateur de la Page à tout moment.</p>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
