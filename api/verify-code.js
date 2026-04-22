import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code, token } = req.body;
  
  if (!email || !code || !token) {
    return res.status(400).json({ error: 'Email, code and token required' });
  }

  // Debug: check if JWT_SECRET is set (don't expose the actual value)
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // 验证 JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.email !== email || decoded.code !== code || decoded.type !== 'verify') {
      console.log('Verify failed:', { decodedEmail: decoded.email, inputEmail: email, decodedCode: decoded.code, inputCode: code });
      return res.status(400).json({ error: 'Invalid code' });
    }
    
    // 生成用户 session token
    const today = new Date().toISOString().split('T')[0];
    const sessionToken = jwt.sign({ 
      email, 
      date: today, 
      count: 0,  // 初始化为0，用户还有完整5次额度
      type: 'session' 
    }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ success: true, token: sessionToken, remaining: 5 });
  } catch (err) {
    console.error('JWT verify error:', err.message);
    return res.status(400).json({ error: 'Invalid or expired code' });
  }
}
