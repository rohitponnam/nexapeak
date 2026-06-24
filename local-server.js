require('dotenv').config();
const express = require('express');
const path = require('path');
const leadsHandler = require('./api/leads');
const cronHandler = require('./api/cron');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/leads', leadsHandler);
app.get('/api/cron', (req, res) => {
  req.headers['authorization'] = `Bearer ${process.env.CRON_SECRET}`;
  cronHandler(req, res);
});

app.listen(PORT, () => {
  console.log(`\n✅ NexaPeak running at http://localhost:${PORT}\n`);
});
