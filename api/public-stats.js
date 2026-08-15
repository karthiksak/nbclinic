/**
 * Public Stats API — no auth required
 * Returns aggregate, non-identifiable stats from the patient database
 * for display on the public website.
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
      if (ch === '"' && next === '"') { field += '"'; i += 2; }
      else if (ch === '"') { inQuotes = false; i++; }
      else { field += ch; i++; }
    } else {
      if (ch === '"') { inQuotes = true; i++; }
      else if (ch === ',') { row.push(field.trim()); field = ''; i++; }
      else if (ch === '\r' && next === '\n') {
        row.push(field.trim());
        if (row.some(f => f !== '')) rows.push(row);
        row = []; field = ''; i += 2;
      } else if (ch === '\n' || ch === '\r') {
        row.push(field.trim());
        if (row.some(f => f !== '')) rows.push(row);
        row = []; field = ''; i++;
      } else { field += ch; i++; }
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field.trim());
    if (row.some(f => f !== '')) rows.push(row);
  }
  return rows;
}

export default async function handler(req, res) {
  // Allow CORS for public page
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache 1 hour

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    // Return safe fallback if not configured
    return res.status(200).json({ totalPatients: 0, totalCities: 0, conditionsTreated: 0, yearsActive: 1 });
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
      return res.status(200).json({ totalPatients: 0, totalCities: 0, conditionsTreated: 0, yearsActive: 1 });
    }

    const getJson = await getRes.json();
    const csvContent = Buffer.from(getJson.content, 'base64').toString('utf8');
    const rows = parseCSVContent(csvContent);

    if (rows.length < 2) {
      return res.status(200).json({ totalPatients: 0, totalCities: 0, conditionsTreated: 0, yearsActive: 1 });
    }

    const headers = rows[0];
    const records = rows.slice(1).map(values => {
      const obj = {};
      headers.forEach((h, idx) => { obj[h] = values[idx] !== undefined ? values[idx] : ''; });
      return obj;
    });

    // Aggregate non-identifiable stats
    const totalPatients = records.length;

    const cities = new Set(records.map(r => (r.city || '').trim().toLowerCase()).filter(Boolean));
    const totalCities = cities.size;

    // Count unique diagnoses/conditions
    const diagnosisWords = new Set();
    records.forEach(r => {
      if (r.diagnosis) {
        r.diagnosis.split(/[,;\/\n]+/).forEach(d => {
          const word = d.trim().toLowerCase();
          if (word.length > 2) diagnosisWords.add(word);
        });
      }
    });
    const conditionsTreated = diagnosisWords.size;

    // Years active from earliest patient date
    const dates = records
      .map(r => r.date ? new Date(r.date) : null)
      .filter(d => d && !isNaN(d));
    
    let yearsActive = 1;
    if (dates.length > 0) {
      const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
      yearsActive = Math.max(1, Math.round((Date.now() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 365)));
    }

    return res.status(200).json({
      totalPatients,
      totalCities,
      conditionsTreated,
      yearsActive
    });

  } catch (error) {
    console.error('Public stats error:', error);
    return res.status(200).json({ totalPatients: 0, totalCities: 0, conditionsTreated: 0, yearsActive: 1 });
  }
}
