export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  // Mock standard user validation - "doctor" / "noble2026"
  // In production, this would use environment variables or a true Database
  if (username === 'doctor' && password === 'noble2026') {
    return res.status(200).json({ 
      token: 'mock-secure-token-12345',
      user: 'Dr. Kokhila'
    });
  }

  return res.status(401).json({ message: 'Invalid Credentials' });
}
