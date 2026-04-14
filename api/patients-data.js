import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Validate token
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer mock-secure-token-12345') {
    return res.status(401).json({ error: 'Unauthorized Server Access' });
  }

  try {
    const filePath = path.join(process.cwd(), 'src', '_data', 'patients.csv');
    
    if (!fs.existsSync(filePath)) {
       return res.status(200).json([]); // No file yet
    }
    
    const csvContent = fs.readFileSync(filePath, 'utf8');
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');
    
    if (lines.length < 2) return res.status(200).json([]); // Only headers
    
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
            obj[h] = val;
        });
        results.push(obj);
    }
    
    res.status(200).json(results);
  } catch (error) {
    console.error("API DB Read Error:", error);
    res.status(500).json({ error: 'Failed to securely read the database.' });
  }
}
