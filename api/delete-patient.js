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

  const { id, name } = req.body;

  if (!id) return res.status(400).json({ error: 'Missing Patient ID' });

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
    
    // 2. Parse lines and remove the matched row
    let lines = currentContent.split(/\r?\n/);
    let initialCount = lines.length;
    
    // Filter out the row matching the specific ID
    // We check both the raw ID and the quoted ID
    const newLines = lines.filter((line, index) => {
        if (index === 0) return true; // Keep headers
        if (line.trim() === '') return false; // Filter empty lines
        return !(line.startsWith(`${id},`) || line.startsWith(`"${id}",`));
    });
    
    if (newLines.length === initialCount) {
       return res.status(404).json({ error: 'Patient ID not found in database. Cannot delete.' });
    }

    const newContent = newLines.join('\n');
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
            message: `Admin: DELETED patient ${name || id} via Tracker Module`,
            content: newContentBase64,
            sha: sha,
            branch: 'main'
        })
    });
    
    if (!putRes.ok) throw new Error('Failed to commit deletion to GitHub');
    
    res.status(200).json({ success: true, message: 'Deleted Successfully' });

  } catch (error) {
    console.error("GitHub API Error:", error);
    res.status(500).json({ error: 'Cloud Sync Failed. Ensure GitHub Token has repo scope context.' });
  }
}
