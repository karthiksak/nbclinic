export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer mock-secure-token-12345') {
    return res.status(401).json({ error: 'Unauthorized Access' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(400).json({ error: 'Missing GITHUB_TOKEN' });
  }

  const repo = 'karthiksak/nbclinic-patients';
  const filePath = 'patients.csv';
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  try {
    // 1. Read current CSV
    const getRes = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}`, 'User-Agent': 'Vercel-Serverless' }
    });
    if (!getRes.ok) throw new Error('Failed to read from GitHub');
    const getJson = await getRes.json();
    const sha = getJson.sha;
    const rawContent = Buffer.from(getJson.content, 'base64').toString('utf8');

    // 2. Repair: scan lines tracking quoted-field state.
    //    Skip any line that is NOT inside a quoted field AND whose first
    //    comma-separated token is not a valid patient ID (all digits) or the header.
    const lines = rawContent.split('\n');
    const cleanedLines = [];
    let inQuotedField = false;
    let removedCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!inQuotedField) {
        const trimmed = line.trim();

        // Drop blank lines (we'll end with a single trailing newline)
        if (trimmed === '') continue;

        const firstCommaIdx = line.indexOf(',');
        const firstField = (firstCommaIdx >= 0
          ? line.substring(0, firstCommaIdx)
          : line
        ).trim().replace(/^"/, '').replace(/"$/, ''); // strip surrounding quotes if any

        // Valid row start: header row OR all-digit patient ID
        const isHeader = i === 0 && firstField === 'Patient ID';
        const isValidId = /^\d+$/.test(firstField);

        if (isHeader || isValidId) {
          cleanedLines.push(line);
        } else {
          // Stray / corrupt line – skip it
          removedCount++;
          console.log(`[repair-db] Removed stray line ${i + 1}: ${line.substring(0, 100)}`);
          continue; // Do NOT update inQuotedField from this line
        }
      } else {
        // Continuation of a multi-line quoted field — always keep
        cleanedLines.push(line);
      }

      // Update quote-state by scanning the characters of the line we just kept
      let state = inQuotedField;
      for (let j = 0; j < line.length; j++) {
        if (line[j] === '"') {
          if (line[j + 1] === '"') {
            j++; // escaped double-quote inside a field — skip both
          } else {
            state = !state; // toggle in/out of quoted field
          }
        }
      }
      inQuotedField = state;
    }

    const newContent = cleanedLines.join('\n') + '\n';
    const newContentBase64 = Buffer.from(newContent, 'utf8').toString('base64');

    // 3. Write repaired CSV back to GitHub
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Serverless'
      },
      body: JSON.stringify({
        message: `Admin: Repair DB — removed ${removedCount} corrupt stray line(s)`,
        content: newContentBase64,
        sha: sha,
        branch: 'main'
      })
    });

    if (!putRes.ok) throw new Error('Failed to commit repaired CSV to GitHub');

    res.status(200).json({
      success: true,
      removedCount,
      keptRecords: cleanedLines.length - 1, // excluding header
      message: `Repair complete. Removed ${removedCount} corrupt line(s). ${cleanedLines.length - 1} patient records preserved.`
    });

  } catch (error) {
    console.error('[repair-db] Error:', error);
    res.status(500).json({ error: 'Repair failed: ' + error.message });
  }
}
