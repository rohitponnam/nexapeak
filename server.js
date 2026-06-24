import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import leadsHandler from './api/leads.js';
import cronHandler from './api/cron.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
