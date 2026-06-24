const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const EMAIL_SEQUENCE = [
  {
    step: 1,
    subject: 'Your IT Transformation Playbook is here',
    html: (name) => `
<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#0A0F1E;padding:32px;border-radius:12px 12px 0 0;">
    <p style="color:#60A5FA;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 10px;">NEXAPEAK GLOBAL SERVICES</p>
    <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0;line-height:1.3;">Your playbook is ready, ${name.split(' ')[0]}</h1>
  </div>
  <div style="background:#F8FAFC;padding:32px;border:1px solid #E2E8F0;border-top:none;">
    <p style="font-size:15px;line-height:1.7;margin:0 0 16px;color:#0A0F1E;">Thanks for downloading the 2025 IT Transformation Playbook. Inside you will find:</p>
    <ul style="font-size:14px;line-height:1.9;color:#475569;padding-left:20px;margin:0 0 24px;">
      <li>The 5-phase delivery framework used by 400+ enterprise teams</li>
      <li>Cloud modernisation cost benchmarks by industry</li>
      <li>AI readiness scorecard (takes 10 minutes)</li>
      <li>How to write an RFP that finds the right partner</li>
    </ul>
    <a href="${process.env.SITE_URL}/cases.html" style="display:inline-block;background:#2563EB;color:#fff;padding:14px 28px;border-radius:6px;font-weight:700;font-size:15px;text-decoration:none;">See our client results →</a>
  </div>
  <div style="padding:16px 32px;background:#fff;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px;">
    <p style="font-size:11px;color:#94A3B8;margin:0;">NexaPeak Global Services · Austin, TX · London · Singapore<br>
    <a href="${process.env.SITE_URL}/unsubscribe?email={{EMAIL}}" style="color:#94A3B8;">Unsubscribe</a></p>
  </div>
</div>`,
  },
  {
    step: 2,
    subject: 'The one question to ask before any technology project',
    html: (name) => `
<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#0A0F1E;padding:32px;border-radius:12px 12px 0 0;">
    <p style="color:#60A5FA;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 10px;">FROM THE NEXAPEAK TEAM</p>
    <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;line-height:1.3;">Something we wish someone told us earlier, ${name.split(' ')[0]}</h1>
  </div>
  <div style="background:#F8FAFC;padding:32px;border:1px solid #E2E8F0;border-top:none;">
    <p style="font-size:15px;line-height:1.7;color:#0A0F1E;margin:0 0 16px;">Before starting any cloud migration, AI programme, or digital transformation — ask this one question:</p>
    <blockquote style="border-left:4px solid #2563EB;padding:14px 20px;background:#EFF6FF;margin:20px 0;border-radius:0 8px 8px 0;">
      <p style="font-size:16px;font-weight:700;color:#1E3A8A;margin:0;">"What does success look like in 12 months, and who signs off on that?"</p>
    </blockquote>
    <p style="font-size:14px;line-height:1.7;color:#475569;margin:0 0 20px;">Most programmes fail not because of technology — but because no one agreed upfront on what winning looked like. Teams that answer this clearly before kick-off are 3x more likely to deliver on time and within budget.</p>
    <a href="${process.env.SITE_URL}/cases.html" style="display:inline-block;background:#2563EB;color:#fff;padding:12px 24px;border-radius:6px;font-weight:700;font-size:14px;text-decoration:none;">See how our clients define success →</a>
  </div>
  <div style="padding:16px 32px;background:#fff;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px;">
    <p style="font-size:11px;color:#94A3B8;margin:0;">NexaPeak Global Services · <a href="${process.env.SITE_URL}/unsubscribe?email={{EMAIL}}" style="color:#94A3B8;">Unsubscribe</a></p>
  </div>
</div>`,
  },
  {
    step: 3,
    subject: 'Case study: $31M saved in 6 months with one ML decision',
    html: (name) => `
<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#0A0F1E;padding:32px;border-radius:12px 12px 0 0;">
    <p style="color:#60A5FA;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 10px;">CLIENT CASE STUDY</p>
    <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;line-height:1.3;">How Orbis Energy saved $31M in 6 months with AI</h1>
  </div>
  <div style="background:#F8FAFC;padding:32px;border:1px solid #E2E8F0;border-top:none;">
    <p style="font-size:15px;line-height:1.7;color:#0A0F1E;margin:0 0 16px;">Hi ${name.split(' ')[0]}, here is a quick story that might be relevant to your work.</p>
    <p style="font-size:14px;line-height:1.7;color:#475569;margin:0 0 16px;">Orbis Energy was losing millions every year to grid inefficiency. Their system could not predict demand spikes — so they over-provisioned, wasted capacity, and paid the penalty.</p>
    <div style="display:flex;gap:12px;margin:20px 0;flex-wrap:wrap;">
      <div style="flex:1;min-width:100px;background:#EFF6FF;padding:16px;border-radius:8px;text-align:center;">
        <div style="font-size:26px;font-weight:700;color:#2563EB;">23%</div>
        <div style="font-size:12px;color:#64748B;margin-top:4px;">Energy waste reduced</div>
      </div>
      <div style="flex:1;min-width:100px;background:#EFF6FF;padding:16px;border-radius:8px;text-align:center;">
        <div style="font-size:26px;font-weight:700;color:#2563EB;">$31M</div>
        <div style="font-size:12px;color:#64748B;margin-top:4px;">Annual savings</div>
      </div>
      <div style="flex:1;min-width:100px;background:#EFF6FF;padding:16px;border-radius:8px;text-align:center;">
        <div style="font-size:26px;font-weight:700;color:#2563EB;">6 mo</div>
        <div style="font-size:12px;color:#64748B;margin-top:4px;">Time to value</div>
      </div>
    </div>
    <p style="font-size:14px;line-height:1.7;color:#475569;margin:0 0 20px;">We built an ML pipeline that predicts grid demand 48 hours ahead using weather data, historical usage, and real-time sensor feeds. The model runs autonomously and improves with every cycle.</p>
    <a href="${process.env.SITE_URL}/cases.html" style="display:inline-block;background:#2563EB;color:#fff;padding:12px 24px;border-radius:6px;font-weight:700;font-size:14px;text-decoration:none;">Read more case studies →</a>
  </div>
  <div style="padding:16px 32px;background:#fff;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px;">
    <p style="font-size:11px;color:#94A3B8;margin:0;">NexaPeak Global Services · <a href="${process.env.SITE_URL}/unsubscribe?email={{EMAIL}}" style="color:#94A3B8;">Unsubscribe</a></p>
  </div>
</div>`,
  },
  {
    step: 4,
    subject: '3 signs your tech stack is holding your team back',
    html: (name) => `
<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#0A0F1E;padding:32px;border-radius:12px 12px 0 0;">
    <p style="color:#60A5FA;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 10px;">QUICK ASSESSMENT</p>
    <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;line-height:1.3;">Is your infrastructure quietly losing ground?</h1>
  </div>
  <div style="background:#F8FAFC;padding:32px;border:1px solid #E2E8F0;border-top:none;">
    <p style="font-size:15px;line-height:1.7;color:#0A0F1E;margin:0 0 20px;">Hi ${name.split(' ')[0]}, these are the three patterns we see most often in organisations falling behind:</p>
    <div style="margin-bottom:12px;padding:16px;background:#fff;border:1px solid #E2E8F0;border-radius:8px;">
      <p style="font-weight:700;margin:0 0 4px;font-size:14px;color:#0A0F1E;">1. Deployments take more than a day</p>
      <p style="font-size:13px;color:#64748B;margin:0;line-height:1.6;">Modern teams deploy dozens of times per day. If your releases take longer, you are bleeding velocity.</p>
    </div>
    <div style="margin-bottom:12px;padding:16px;background:#fff;border:1px solid #E2E8F0;border-radius:8px;">
      <p style="font-weight:700;margin:0 0 4px;font-size:14px;color:#0A0F1E;">2. Engineers spend more than 20% of time on maintenance</p>
      <p style="font-size:13px;color:#64748B;margin:0;line-height:1.6;">Technical debt compounds. When your best people keep the lights on, product velocity stalls.</p>
    </div>
    <div style="margin-bottom:20px;padding:16px;background:#fff;border:1px solid #E2E8F0;border-radius:8px;">
      <p style="font-weight:700;margin:0 0 4px;font-size:14px;color:#0A0F1E;">3. Cloud costs grow faster than revenue</p>
      <p style="font-size:13px;color:#64748B;margin:0;line-height:1.6;">A 47% infrastructure cost reduction is achievable for most organisations within 6 months without sacrificing performance.</p>
    </div>
    <a href="${process.env.SITE_URL}/contact.html" style="display:inline-block;background:#2563EB;color:#fff;padding:12px 24px;border-radius:6px;font-weight:700;font-size:14px;text-decoration:none;">Book a free 60-min assessment →</a>
  </div>
  <div style="padding:16px 32px;background:#fff;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px;">
    <p style="font-size:11px;color:#94A3B8;margin:0;">NexaPeak Global Services · <a href="${process.env.SITE_URL}/unsubscribe?email={{EMAIL}}" style="color:#94A3B8;">Unsubscribe</a></p>
  </div>
</div>`,
  },
  {
    step: 5,
    subject: 'Last one from us — open invitation',
    html: (name) => `
<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#0A0F1E;padding:32px;border-radius:12px 12px 0 0;">
    <p style="color:#60A5FA;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 10px;">FROM THE NEXAPEAK TEAM</p>
    <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;line-height:1.3;">No more emails — unless you want them</h1>
  </div>
  <div style="background:#F8FAFC;padding:32px;border:1px solid #E2E8F0;border-top:none;">
    <p style="font-size:15px;line-height:1.7;color:#0A0F1E;margin:0 0 16px;">Hi ${name.split(' ')[0]},</p>
    <p style="font-size:14px;line-height:1.7;color:#475569;margin:0 0 16px;">This is the last email in our sequence. We hope the content was useful.</p>
    <p style="font-size:14px;line-height:1.7;color:#475569;margin:0 0 24px;">If you would ever like to explore how NexaPeak could help — whether that is cloud modernisation, AI integration, or simply a second opinion on a technology decision — we are here. No pitch, no pressure. A 60-minute conversation, your call.</p>
    <a href="${process.env.SITE_URL}/contact.html" style="display:inline-block;background:#2563EB;color:#fff;padding:14px 28px;border-radius:6px;font-weight:700;font-size:15px;text-decoration:none;">Let's talk →</a>
  </div>
  <div style="padding:16px 32px;background:#fff;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px;">
    <p style="font-size:11px;color:#94A3B8;margin:0;">NexaPeak Global Services · <a href="${process.env.SITE_URL}/unsubscribe?email={{EMAIL}}" style="color:#94A3B8;">Unsubscribe</a></p>
  </div>
</div>`,
  },
];

async function sendEmail({ to, name, subject, html }) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: html.replace(/\{\{EMAIL\}\}/g, encodeURIComponent(to)),
  });
}

module.exports = { transporter, EMAIL_SEQUENCE, sendEmail };
