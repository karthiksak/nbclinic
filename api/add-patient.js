export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer mock-secure-token-12345') {
    return res.status(401).json({ error: 'Unauthorized Access' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
     return res.status(400).json({ error: 'Missing Setup! Vercel Environment Variable GITHUB_TOKEN is not configured.' });
  }

  const { id, date, name, age, gender, city, occup, diagnosis, notes } = req.body;
  if (!id || !name || !diagnosis) return res.status(400).json({ error: 'Missing critical fields' });

  // Escape logic for CSV appending
  const cleanCols = [id, date, name, age, gender, occup, city, diagnosis, notes].map(c => {
        let val = c ? String(c).trim() : '';
        val = val.replace(/"/g, '""');
        if (val.includes(',') || val.includes('\n')) {
            val = `"${val}"`;
        }
        return val;
  });
  
  // Pad with trailing blanks to match the 18 columns of patients.csv to prevent structural misalignment
  while (cleanCols.length < 18) {
      cleanCols.push('');
  }
  
  const newRow = cleanCols.join(',');

  const repo = 'karthiksak/nbclinic';
  const filePath = 'src/_data/patients.csv';
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  try {
    // 1. Get current file sha and content
    const getRes = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'User-Agent': 'Vercel-Serverless' }
    });
    
    if (!getRes.ok) throw new Error('Failed to read from GitHub');
    const getJson = await getRes.json();
    const sha = getJson.sha;
    
    // Buffer is automatically available in Node runtimes
    const currentContent = Buffer.from(getJson.content, 'base64').toString('utf8');
    
    // 2. Append row
    const newContent = currentContent.endsWith('\n') 
        ? currentContent + newRow + '\n' 
        : currentContent + '\n' + newRow + '\n';
        
    const newContentBase64 = Buffer.from(newContent, 'utf8').toString('base64');
    
    // 3. Put updated file via GitHub API to trigger Vercel deploy implicitly
    const putRes = await fetch(url, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
            'User-Agent': 'Vercel-Serverless'
        },
        body: JSON.stringify({
            message: `Admin: Added patient ${name} via Tracker Portal`,
            content: newContentBase64,
            sha: sha,
            branch: 'main'
        })
    });
    
    if (!putRes.ok) throw new Error('Failed to commit to GitHub');
    
    res.status(200).json({ success: true });

  } catch (error) {
    console.error("GitHub API Error:", error);
    res.status(500).json({ error: 'Cloud Sync Failed. Ensure GitHub Token has repo scope context.' });
  }
}
