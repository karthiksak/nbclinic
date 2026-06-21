const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // Auth check - same token as the tracker
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer mock-secure-token-12345') {
    return res.status(401).json({ error: 'Unauthorized Access' });
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const githubToken = process.env.GITHUB_TOKEN;
  const destEmail = 'noblehomoeopathyclinic24@gmail.com';

  if (!emailUser || !emailPass) {
    return res.status(500).json({ error: 'Email credentials (EMAIL_USER / EMAIL_PASS) not configured in Vercel.' });
  }
  if (!githubToken) {
    return res.status(500).json({ error: 'GITHUB_TOKEN not configured in Vercel.' });
  }

  try {
    // 1. Fetch live CSV from GitHub
    const rawUrl = 'https://api.github.com/repos/karthiksak/nbclinic-patients/contents/patients.csv';
    const csvRes = await fetch(rawUrl, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'User-Agent': 'Vercel-Serverless',
        'Cache-Control': 'no-cache'
      }
    });

    if (!csvRes.ok) throw new Error('Failed to fetch patient data from GitHub repository.');

    const csvJson = await csvRes.json();
    const csvData = Buffer.from(csvJson.content, 'base64').toString('utf8');

    // 2. Parse CSV into patient objects
    const lines = csvData.split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length < 2) return res.status(200).json({ message: 'No patient records found to send.' });

    const headers = lines[0].split(',').map(h => h.trim());
    const patients = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const obj = {};
      headers.forEach((h, idx) => {
        let val = values[idx] ? values[idx].trim() : '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
        val = val.replace(/""/g, '"');
        obj[h] = val;
      });
      patients.push(obj);
    }

    // 3. Calculate summary stats
    const total = patients.length;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100;
    const newThisMonth = patients.filter(p => {
      if (!p['Date']) return false;
      const parts = p['Date'].split('/').map(Number);
      return parts[1] === currentMonth && parts[2] === currentYear;
    }).length;

    let totalRevenue = 0;
    patients.forEach(p => {
      for (let i = 1; i <= 8; i++) {
        const val = parseFloat(p[`Fees${i}`]);
        if (!isNaN(val)) totalRevenue += val;
      }
    });

    const males = patients.filter(p => p['Gender'] === 'M').length;
    const females = patients.filter(p => p['Gender'] === 'F').length;

    // 4. Build detailed HTML email
    const today = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const todayISO = now.toISOString().split('T')[0];

    const patientRowsHtml = patients.map((p, i) => {
      const fees = [];
      for (let f = 1; f <= 8; f++) {
        if (p[`Fees${f}`] && parseFloat(p[`Fees${f}`]) > 0) fees.push(`₹${p[`Fees${f}`]}`);
      }
      const feeStr = fees.length > 0 ? fees.join(' | ') : '—';
      const rowBg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
      return `
        <tr style="background:${rowBg};">
          <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; font-weight:700; color:#0369a1; font-size:0.85rem;">${p['Patient ID'] || '—'}</td>
          <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#475569; font-size:0.82rem;">${p['Date'] || '—'}</td>
          <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; font-weight:700; color:#1e293b;">${p['Patient Name'] || '—'}</td>
          <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#475569; font-size:0.85rem;">${p['Age'] || '—'} / ${p['Gender'] || '—'}</td>
          <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#475569; font-size:0.85rem;">${p['City'] || '—'}</td>
          <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#1e293b; font-size:0.85rem;">${p['Diagnosis'] || '—'}</td>
          <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#64748b; font-size:0.78rem; max-width:200px; word-wrap:break-word;">${p['Treatment Notes'] || '—'}</td>
          <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#64748b; font-size:0.78rem; max-width:200px; word-wrap:break-word;">${p['FollowUp Notes'] || '—'}</td>
          <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; color:#be185d; font-weight:600; font-size:0.85rem; white-space:nowrap;">${feeStr}</td>
        </tr>`;
    }).join('');

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">

  <div style="max-width:1100px;margin:30px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0284c7 0%,#0369a1 100%);padding:36px 40px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:1.8rem;letter-spacing:-0.5px;">🏥 Noble Homoeopathy Clinic</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:1rem;">Complete Patient Database Report</p>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:0.9rem;">Generated on ${today}</p>
    </div>

    <!-- Stats Row -->
    <div style="display:flex;gap:0;border-bottom:1px solid #e2e8f0;">
      <div style="flex:1;padding:24px;text-align:center;border-right:1px solid #e2e8f0;">
        <div style="font-size:2rem;font-weight:800;color:#0369a1;">${total}</div>
        <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:4px;">Total Patients</div>
      </div>
      <div style="flex:1;padding:24px;text-align:center;border-right:1px solid #e2e8f0;">
        <div style="font-size:2rem;font-weight:800;color:#10b981;">${newThisMonth}</div>
        <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:4px;">New This Month</div>
      </div>
      <div style="flex:1;padding:24px;text-align:center;border-right:1px solid #e2e8f0;">
        <div style="font-size:2rem;font-weight:800;color:#be185d;">₹${totalRevenue.toLocaleString('en-IN')}</div>
        <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:4px;">Total Revenue</div>
      </div>
      <div style="flex:1;padding:24px;text-align:center;">
        <div style="font-size:2rem;font-weight:800;color:#7c3aed;">${males}M / ${females}F</div>
        <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:4px;">Gender Split</div>
      </div>
    </div>

    <!-- Table Section -->
    <div style="padding:30px 20px;">
      <h2 style="margin:0 0 20px;color:#1e293b;font-size:1.1rem;border-left:4px solid #0284c7;padding-left:12px;">
        Patient Records — All ${total} entries
      </h2>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:0.88rem;min-width:900px;">
          <thead>
            <tr style="background:#0f172a;">
              <th style="padding:12px 12px;text-align:left;color:#fff;font-weight:700;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Patient ID</th>
              <th style="padding:12px 12px;text-align:left;color:#fff;font-weight:700;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Date</th>
              <th style="padding:12px 12px;text-align:left;color:#fff;font-weight:700;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Full Name</th>
              <th style="padding:12px 12px;text-align:left;color:#fff;font-weight:700;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Age/Gender</th>
              <th style="padding:12px 12px;text-align:left;color:#fff;font-weight:700;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">City</th>
              <th style="padding:12px 12px;text-align:left;color:#fff;font-weight:700;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Diagnosis</th>
              <th style="padding:12px 12px;text-align:left;color:#fff;font-weight:700;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Treatment Notes</th>
              <th style="padding:12px 12px;text-align:left;color:#fff;font-weight:700;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Follow-Up</th>
              <th style="padding:12px 12px;text-align:left;color:#fff;font-weight:700;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Fees</th>
            </tr>
          </thead>
          <tbody>
            ${patientRowsHtml}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:0.82rem;">
        This report was manually triggered from the Noble Homoeopathy Clinic Secure Portal on ${today}.<br>
        CSV backup is also attached to this email for offline access.
      </p>
    </div>

  </div>
</body>
</html>`;

    // 5. Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    await transporter.sendMail({
      from: `Noble Homoeopathy Clinic <${emailUser}>`,
      to: destEmail,
      subject: `📋 Full Patient Database Report — ${today} | Noble Homoeopathy Clinic`,
      html: htmlBody,
      attachments: [
        {
          filename: `nhc_patient_data_${todayISO}.csv`,
          content: csvData,
          contentType: 'text/csv'
        }
      ]
    });

    res.status(200).json({ success: true, message: `Report emailed to ${destEmail}` });

  } catch (error) {
    console.error('Send Report Error:', error);
    res.status(500).json({ error: 'Failed to send report. Check Vercel logs.' });
  }
};
