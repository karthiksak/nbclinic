const nodemailer = require('nodemailer');

/**
 * Robust CSV parser — handles quoted fields with commas AND newlines.
 */
function parseCSVContent(content) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < content.length) {
    const ch = content[i];
    const next = content[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 2;
      } else if (ch === '"') {
        inQuotes = false;
        i++;
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ',') {
        row.push(field.trim());
        field = '';
        i++;
      } else if (ch === '\r' && next === '\n') {
        row.push(field.trim());
        if (row.some(f => f !== '')) rows.push(row);
        row = []; field = '';
        i += 2;
      } else if (ch === '\n' || ch === '\r') {
        row.push(field.trim());
        if (row.some(f => f !== '')) rows.push(row);
        row = []; field = '';
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field.trim());
    if (row.some(f => f !== '')) rows.push(row);
  }

  return rows;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer mock-secure-token-12345') {
    return res.status(401).json({ error: 'Unauthorized Access' });
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const githubToken = process.env.GITHUB_TOKEN;
  const destEmail = 'noblehomoeopathyclinic24@gmail.com';

  if (!emailUser || !emailPass) {
    return res.status(500).json({
      error: 'Email not configured. In Vercel → Settings → Environment Variables, add: EMAIL_USER (your Gmail) and EMAIL_PASS (Gmail App Password). Then redeploy.'
    });
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

    if (!csvRes.ok) throw new Error('Failed to fetch patient data from GitHub.');

    const csvJson = await csvRes.json();
    const csvData = Buffer.from(csvJson.content, 'base64').toString('utf8');

    // 2. Parse CSV properly (handles multi-line quoted fields)
    const rows = parseCSVContent(csvData);
    if (rows.length < 2) return res.status(200).json({ message: 'No patient records to send.' });

    const headers = rows[0];
    const patients = rows.slice(1).map(values => {
      const obj = {};
      headers.forEach((h, idx) => { obj[h] = values[idx] !== undefined ? values[idx] : ''; });
      return obj;
    });

    // 3. Summary stats
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

    // 4. Build HTML table rows
    const today = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const todayISO = now.toISOString().split('T')[0];

    const patientRowsHtml = patients.map((p, i) => {
      const fees = [];
      for (let f = 1; f <= 8; f++) {
        if (p[`Fees${f}`] && parseFloat(p[`Fees${f}`]) > 0) fees.push(`\u20b9${p[`Fees${f}`]}`);
      }
      const feeStr = fees.length > 0 ? fees.join(' | ') : '\u2014';
      const rowBg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
      // Escape HTML entities in text content
      const esc = str => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `
        <tr style="background:${rowBg};">
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#0369a1;font-size:0.85rem;white-space:nowrap;">${esc(p['Patient ID']) || '\u2014'}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;font-size:0.82rem;white-space:nowrap;">${esc(p['Date']) || '\u2014'}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#1e293b;white-space:nowrap;">${esc(p['Patient Name']) || '\u2014'}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;font-size:0.85rem;white-space:nowrap;">${esc(p['Age']) || '\u2014'} / ${esc(p['Gender']) || '\u2014'}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569;font-size:0.85rem;">${esc(p['City']) || '\u2014'}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#1e293b;font-size:0.85rem;">${esc(p['Diagnosis']) || '\u2014'}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:0.78rem;max-width:220px;word-wrap:break-word;white-space:pre-wrap;">${esc(p['Treatment Notes']) || '\u2014'}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:0.78rem;max-width:220px;word-wrap:break-word;white-space:pre-wrap;">${esc(p['FollowUp Notes']) || '\u2014'}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#be185d;font-weight:600;font-size:0.85rem;white-space:nowrap;">${feeStr}</td>
        </tr>`;
    }).join('');

    // 5. Full HTML email
    const htmlBody = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:1100px;margin:30px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

  <div style="background:linear-gradient(135deg,#0284c7 0%,#0369a1 100%);padding:36px 40px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:1.8rem;">\uD83C\uDFE5 Noble Homoeopathy Clinic</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:1rem;">Complete Patient Database Report</p>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:0.9rem;">Generated on ${today}</p>
  </div>

  <table style="width:100%;border-bottom:1px solid #e2e8f0;border-collapse:collapse;">
    <tr>
      <td style="padding:24px;text-align:center;border-right:1px solid #e2e8f0;">
        <div style="font-size:2rem;font-weight:800;color:#0369a1;">${total}</div>
        <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:4px;">Total Patients</div>
      </td>
      <td style="padding:24px;text-align:center;border-right:1px solid #e2e8f0;">
        <div style="font-size:2rem;font-weight:800;color:#10b981;">${newThisMonth}</div>
        <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:4px;">New This Month</div>
      </td>
      <td style="padding:24px;text-align:center;border-right:1px solid #e2e8f0;">
        <div style="font-size:2rem;font-weight:800;color:#be185d;">\u20b9${totalRevenue.toLocaleString('en-IN')}</div>
        <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:4px;">Total Revenue</div>
      </td>
      <td style="padding:24px;text-align:center;">
        <div style="font-size:2rem;font-weight:800;color:#7c3aed;">${males}M / ${females}F</div>
        <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:4px;">Gender Split</div>
      </td>
    </tr>
  </table>

  <div style="padding:30px 20px;">
    <h2 style="margin:0 0 20px;color:#1e293b;font-size:1.1rem;border-left:4px solid #0284c7;padding-left:12px;">Patient Records &mdash; All ${total} entries</h2>
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:0.88rem;min-width:900px;">
        <thead>
          <tr style="background:#0f172a;">
            <th style="padding:12px;text-align:left;color:#fff;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Patient ID</th>
            <th style="padding:12px;text-align:left;color:#fff;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Date</th>
            <th style="padding:12px;text-align:left;color:#fff;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Full Name</th>
            <th style="padding:12px;text-align:left;color:#fff;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Age/Gender</th>
            <th style="padding:12px;text-align:left;color:#fff;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">City</th>
            <th style="padding:12px;text-align:left;color:#fff;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Diagnosis</th>
            <th style="padding:12px;text-align:left;color:#fff;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Treatment Notes</th>
            <th style="padding:12px;text-align:left;color:#fff;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Follow-Up</th>
            <th style="padding:12px;text-align:left;color:#fff;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">Fees</th>
          </tr>
        </thead>
        <tbody>${patientRowsHtml}</tbody>
      </table>
    </div>
  </div>

  <div style="background:#f8fafc;padding:20px 30px;text-align:center;border-top:1px solid #e2e8f0;">
    <p style="margin:0;color:#94a3b8;font-size:0.82rem;">
      Manually triggered from Noble Homoeopathy Clinic Secure Portal &bull; ${today}<br>
      Full CSV backup also attached.
    </p>
  </div>

</div>
</body>
</html>`;

    // 6. Send via Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: emailUser, pass: emailPass }
    });

    await transporter.sendMail({
      from: `Noble Homoeopathy Clinic <${emailUser}>`,
      to: destEmail,
      subject: `\uD83D\uDCCB Full Patient Report \u2014 ${today} | Noble Homoeopathy Clinic`,
      html: htmlBody,
      attachments: [{
        filename: `nhc_patients_${todayISO}.csv`,
        content: csvData,
        contentType: 'text/csv'
      }]
    });

    res.status(200).json({ success: true, message: `Report sent to ${destEmail}` });

  } catch (error) {
    console.error('Send Report Error:', error);
    res.status(500).json({ error: 'Failed to send: ' + error.message });
  }
};
