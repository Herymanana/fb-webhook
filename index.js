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
      console.log("? Webhook verified!");
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
      console.log("?? Event reçu:", event);
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`?? Server running on port ${PORT}`));
