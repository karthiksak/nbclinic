import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { planId, planTitle, customerName, customerPhone, method, utr, timestamp } = req.body || {};

    console.log(`[Diet Plan Order] Plan: ${planTitle} (${planId}) | Customer: ${customerName} (${customerPhone}) | Method: ${method} | Ref: ${utr}`);

    // If SMTP credentials are configured on Vercel, send notification email to clinic
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const destEmail = process.env.DEST_EMAIL || 'noblehomoeopathyclinic@gmail.com';

    if (emailUser && emailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: emailUser, pass: emailPass }
        });

        await transporter.sendMail({
          from: `Noble Homoeopathy Clinic <${emailUser}>`,
          to: destEmail,
          subject: `\uD83C\uDF4F New Diet Plan Order: ${planTitle} — ₹25`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a; max-width: 600px;">
              <h2 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 8px;">New Diet Plan Order Received</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Diet Plan:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${planTitle}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Amount:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">₹25 INR</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Patient Name:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${customerName || 'N/A'}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">WhatsApp / Phone:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><a href="https://wa.me/91${customerPhone}">${customerPhone}</a></td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Payment Method:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${method || 'UPI'}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Reference / UTR:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${utr || 'Direct Payment'}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Timestamp:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${timestamp || new Date().toISOString()}</td></tr>
              </table>
              <p style="margin-top: 20px; font-size: 13px; color: #64748b;">
                Noble Homoeopathy Clinic &bull; Automated Payment Notification
              </p>
            </div>
          `
        });
      } catch (mailErr) {
        console.warn('Mail send warning:', mailErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Diet plan order recorded successfully',
      planId
    });

  } catch (error) {
    console.error('Diet plan webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}
