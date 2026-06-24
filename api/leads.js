require('dotenv').config();
const { supabase } = require('./db');
const { sendEmail, EMAIL_SEQUENCE } = require('./mailer');

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, company, role, source, page, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return res.status(200).json({ ok: true, message: 'Already registered.' });
    }

    const { error: insertError } = await supabase.from('leads').insert([{
      name:          name.trim(),
      email:         email.toLowerCase().trim(),
      company:       company?.trim() || null,
      role:          role || null,
      source:        source || 'unknown',
      page:          page || '/',
      message:       message?.trim() || null,
      email_step:    0,
      subscribed:    true,
      created_at:    new Date().toISOString(),
      next_email_at: new Date().toISOString(),
    }]);

    if (insertError) throw insertError;

    // Send email 1 immediately
    await sendEmail({
      to:      email.toLowerCase(),
      name,
      subject: EMAIL_SEQUENCE[0].subject,
      html:    EMAIL_SEQUENCE[0].html(name),
    });

    // Schedule email 2 in 24-36 hours
    const hours = 24 + Math.floor(Math.random() * 12);
    const nextAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

    await supabase.from('leads')
      .update({ email_step: 1, next_email_at: nextAt })
      .eq('email', email.toLowerCase());

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('[/api/leads]', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

module.exports = handler;
