import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CRON_SECRET is automatically passed by Vercel to protect cron endpoints
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized invocation' });
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const destEmail = process.env.TARGET_EMAIL || emailUser;

  if (!emailUser || !emailPass) {
    console.error('Email credentials missing');
    return res.status(500).json({ error: 'Email configuration missing in Vercel Variables' });
  }

  try {
    // Note: Instead of doing local fs reading, we fetch the live raw CSV from Github so the cron always sends 
    // the absolute latest commit, bypassing any Vercel cache!
    const rawUrl = 'https://raw.githubusercontent.com/karthiksak/nbclinic/main/src/_data/patients.csv';
    const csvRes = await fetch(rawUrl);
    
    if (!csvRes.ok) throw new Error('Failed to fetch raw CSV data from repository');
    
    const csvData = await csvRes.text();

    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const mailOptions = {
      from: emailUser,
      to: destEmail,
      subject: 'Weekly Patient System Backup - Noble Homoeopathy Portal',
      text: 'Attached is the automated weekly CSV backup of your patient portal. All additions and modifications for the week are included.',
      attachments: [
        {
          filename: `nhc_patient_backup_${new Date().toISOString().split('T')[0]}.csv`,
          content: csvData
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Automated DB Mail Backup Dispatched!' });
  } catch (error) {
    console.error("Cron Database Backup Error: ", error);
    res.status(500).json({ error: 'Failed to execute weekly cloud backup' });
  }
}
