require('dotenv/config');
const webpush = require('web-push');
const express = require('express');
 
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
 
webpush.setVapidDetails('mailto:nlapshin1989@gmail.com', publicVapidKey, privateVapidKey);

const app = express();

app.use(express.json());
app.use(express.static(__dirname + "/static"));

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  res.sendStatus(200);
 
  let i = 0;

  setInterval(() => {
    const payload = JSON.stringify({ title: `Notification`, body: `New notification: ${++i}` });
    webpush.sendNotification(subscription, payload);

  }, 5000);
});
 
app.listen(5000, () => {
  console.log('server started on 5000 port')
});
