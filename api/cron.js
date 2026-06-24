require('dotenv').config();
const { supabase } = require('./db');
const { sendEmail, EMAIL_SEQUENCE } = require('./mailer');

async function handler(req, res) {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const now = new Date().toISOString();
  const results = { sent: 0, completed: 0, errors: 0 };

  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('id, name, email, email_step, subscribed')
      .eq('subscribed', true)
      .lt('next_email_at', now)
      .lt('email_step', EMAIL_SEQUENCE.length);

    if (error) throw error;
    if (!leads || leads.length === 0) {
      return res.status(200).json({ ok: true, message: 'No emails due.', ...results });
    }

    for (const lead of leads) {
      try {
        const nextStep = lead.email_step + 1;
        const template = EMAIL_SEQUENCE.find(e => e.step === nextStep);

        if (!template) {
          await supabase.from('leads')
            .update({ email_step: EMAIL_SEQUENCE.length, next_email_at: null })
            .eq('id', lead.id);
          results.completed++;
          continue;
        }

        await sendEmail({
          to:      lead.email,
          name:    lead.name,
          subject: template.subject,
          html:    template.html(lead.name),
        });

        const isLast = nextStep >= EMAIL_SEQUENCE.length;
        const hours = 24 + Math.floor(Math.random() * 12);
        const nextAt = isLast
          ? null
          : new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

        await supabase.from('leads')
          .update({
            email_step:     nextStep,
            next_email_at:  nextAt,
            last_emailed_at: now,
          })
          .eq('id', lead.id);

        results.sent++;
        console.log(`[CRON] Step ${nextStep} sent to ${lead.email}`);

      } catch (err) {
        console.error(`[CRON] Error for ${lead.email}:`, err.message);
        results.errors++;
      }
    }

    return res.status(200).json({ ok: true, ...results });

  } catch (err) {
    console.error('[CRON] Fatal:', err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = handler;
