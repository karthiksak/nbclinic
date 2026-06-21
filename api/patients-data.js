export default async function handler(req, res) {
  // Validate token
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer mock-secure-token-12345') {
    return res.status(401).json({ error: 'Unauthorized Server Access' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(400).json({ error: 'Missing Setup! Vercel Environment Variable GITHUB_TOKEN is not configured.' });
  }

  const repo = 'karthiksak/nbclinic-patients';
  const filePath = 'patients.csv';
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  try {
    // Fetch live data directly from GitHub (same source as add/edit/delete)
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

    const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');

    if (lines.length < 2) return res.status(200).json([]); // Only headers or empty

    const headers = lines[0].split(',').map(h => h.trim());
    const results = [];

    for (let i = 1; i < lines.length; i++) {
      // Advanced Regex to split by commas ONLY if they are outside of double quotes
      const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const obj = {};
      headers.forEach((h, index) => {
        let val = values[index] ? values[index].trim() : '';
        // Remove leading/trailing quotes if they wrap the content
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
        // Unescape doubled quotes inside CSV values
        val = val.replace(/""/g, '"');
        obj[h] = val;
      });
      results.push(obj);
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("GitHub API Read Error:", error);
    res.status(500).json({ error: 'Failed to securely read the database from GitHub.' });
  }
}
