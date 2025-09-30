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

// ✅ Terms of Service Route
app.get("/terms", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Terms of Service</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
          h1 { color: #2c3e50; }
          p { margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <h1>Conditions Générales d’Utilisation</h1>
        <p>En utilisant cette application <strong>MessengerBotIA</strong>, vous acceptez que vos messages 
        soient traités automatiquement afin de générer des réponses.</p>
        <p>Vous vous engagez à ne pas utiliser cette application pour envoyer du contenu illégal, offensant 
        ou nuisible.</p>
        <p>Nous ne sommes pas responsables des dommages directs ou indirects liés à l’utilisation de ce service.</p>
        <p>Ces conditions peuvent être mises à jour à tout moment. Les utilisateurs seront invités à consulter 
        régulièrement cette page.</p>
      </body>
    </html>
  `);
});

// ✅ User Data Deletion Route
app.get("/delete-data", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Suppression des données</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
          h1 { color: #c0392b; }
          p { margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <h1>Suppression des données utilisateur</h1>
        <p>Conformément aux exigences de Facebook, vous pouvez demander la suppression 
        de vos données associées à l’application <strong>MessengerBotIA</strong>.</p>
        <p>Pour supprimer vos données, veuillez contacter l’administrateur de la Page via Messenger 
        ou envoyer un email à <strong>ton-email@example.com</strong>.</p>
        <p>Nous traiterons la demande et confirmerons la suppression dans un délai de 7 jours.</p>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
