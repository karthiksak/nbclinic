/**
 * Robust CSV parser — handles quoted fields containing commas AND newlines.
 * Returns array of row-arrays. Row 0 is the header.
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
        // Escaped double-quote inside quoted field
        field += '"';
        i += 2;
      } else if (ch === '"') {
        // End of quoted field
        inQuotes = false;
        i++;
      } else {
        // Normal char inside quotes (including \n, \r)
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
        // Windows CRLF
        row.push(field.trim());
        if (row.some(f => f !== '')) rows.push(row);
        row = [];
        field = '';
        i += 2;
      } else if (ch === '\n' || ch === '\r') {
        // Unix LF or old Mac CR
        row.push(field.trim());
        if (row.some(f => f !== '')) rows.push(row);
        row = [];
        field = '';
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }

  // Flush last field/row
  if (field !== '' || row.length > 0) {
    row.push(field.trim());
    if (row.some(f => f !== '')) rows.push(row);
  }

  return rows;
}

export default async function handler(req, res) {
  // Validate token
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer mock-secure-token-12345') {
    return res.status(401).json({ error: 'Unauthorized Server Access' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(400).json({ error: 'Missing Setup! GITHUB_TOKEN not configured in Vercel.' });
  }

  const repo = 'karthiksak/nbclinic-patients';
  const filePath = 'patients.csv';
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  try {
    const getRes = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Vercel-Serverless',
        'Cache-Control': 'no-cache'
      }
    });

    if (!getRes.ok) {
      const errText = await getRes.text();
      console.error('GitHub fetch error:', errText);
      return res.status(500).json({ error: 'Failed to read from GitHub repository.' });
    }

    const getJson = await getRes.json();
    const csvContent = Buffer.from(getJson.content, 'base64').toString('utf8');

    const rows = parseCSVContent(csvContent);

    if (rows.length < 2) return res.status(200).json([]);

    const headers = rows[0];
    const results = rows.slice(1).map(values => {
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] !== undefined ? values[idx] : '';
      });
      return obj;
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('GitHub API Read Error:', error);
    res.status(500).json({ error: 'Failed to securely read the database from GitHub.' });
  }
}
