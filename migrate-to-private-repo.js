/**
 * ONE-TIME MIGRATION SCRIPT
 * Uploads local patients.csv to the private nbclinic-patients GitHub repo
 * 
 * Run: node migrate-to-private-repo.js YOUR_GITHUB_TOKEN
 */

const fs = require('fs');
const path = require('path');

const token = process.argv[2];
if (!token) {
  console.error('❌ Usage: node migrate-to-private-repo.js YOUR_GITHUB_TOKEN');
  console.error('   Get a token at: https://github.com/settings/tokens (needs repo scope)');
  process.exit(1);
}

const csvPath = path.join(__dirname, 'src', '_data', 'patients.csv');
const csvData = fs.readFileSync(csvPath, 'utf8');
const csvBase64 = Buffer.from(csvData, 'utf8').toString('base64');

const url = 'https://api.github.com/repos/karthiksak/nbclinic-patients/contents/patients.csv';

async function migrate() {
  console.log('📤 Uploading patients.csv to private repo...');

  // Check if file already exists (get SHA)
  let sha = undefined;
  const getRes = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}`, 'User-Agent': 'migration-script' }
  });

  if (getRes.ok) {
    const existing = await getRes.json();
    sha = existing.sha;
    console.log('ℹ️  File exists in repo, will overwrite...');
  }

  const body = {
    message: 'Migration: Upload full patient history from local system',
    content: csvBase64,
    branch: 'main'
  };
  if (sha) body.sha = sha;

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'migration-script'
    },
    body: JSON.stringify(body)
  });

  if (!putRes.ok) {
    const err = await putRes.json();
    console.error('❌ Upload failed:', err.message);
    process.exit(1);
  }

  console.log('✅ Success! All 119 patient records uploaded to:');
  console.log('   https://github.com/karthiksak/nbclinic-patients/blob/main/patients.csv');
  console.log('');
  console.log('🔒 Repo is PRIVATE — only you can access it.');
  console.log('📧 Sunday 8 AM email backup is now active.');
}

migrate().catch(console.error);
