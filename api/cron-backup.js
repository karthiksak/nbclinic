const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // CRON_SECRET is automatically passed by Vercel to protect cron endpoints
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized invocation' });
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const destEmail = 'noblehomoeopathyclinic24@gmail.com';

  if (!emailUser || !emailPass) {
    console.error('Email credentials missing');
    return res.status(500).json({ error: 'Email configuration missing in Vercel Variables' });
  }

  try {
    // Fetch from private repo using GitHub token
    const token = process.env.GITHUB_TOKEN;
    const rawUrl = 'https://api.github.com/repos/karthiksak/nbclinic-patients/contents/patients.csv';
    const csvRes = await fetch(rawUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Vercel-Cron'
      }
    });
    
    if (!csvRes.ok) throw new Error('Failed to fetch CSV from private repository');
    
    const csvJson = await csvRes.json();
    const csvData = Buffer.from(csvJson.content, 'base64').toString('utf8');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const today = new Date().toISOString().split('T')[0];

    const mailOptions = {
      from: `Noble Homoeopathy Clinic <${emailUser}>`,
      to: destEmail,
      subject: `📋 Weekly Patient Data Backup - ${today} | Noble Homoeopathy Clinic`,
      text: `Dear Doctor,\n\nPlease find attached the weekly patient data backup for Noble Homoeopathy Clinic.\n\nThis is an automated backup sent every Sunday at 8:00 AM.\n\nFile: nhc_patient_backup_${today}.csv\n\nRegards,\nNoble Homoeopathy Portal`,
      attachments: [
        {
          filename: `nhc_patient_backup_${today}.csv`,
          content: csvData,
          contentType: 'text/csv'
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: `Backup email sent to ${destEmail}` });
  } catch (error) {
    console.error("Cron Database Backup Error: ", error);
    res.status(500).json({ error: 'Failed to execute weekly cloud backup' });
  }
}
