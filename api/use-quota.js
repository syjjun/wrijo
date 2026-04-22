import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.type !== 'session') {
      return res.status(400).json({ error: 'Invalid token type' });
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // 如果是新的一天，重置
    if (decoded.date !== today) {
      decoded.date = today;
      decoded.count = 0;
    }
    
    decoded.count += 1;
    
    // 生成新 token
    const newToken = jwt.sign({ 
      email: decoded.email, 
      date: decoded.date, 
      count: decoded.count,
      type: 'session' 
    }, JWT_SECRET, { expiresIn: '7d' });
    
    const remaining = 5 - decoded.count;
    
    res.json({ 
      success: true, 
      token: newToken,
      remaining: Math.max(0, remaining),
      count: decoded.count
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
