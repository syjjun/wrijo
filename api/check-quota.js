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
    
    // 如果日期不同，重置计数
    if (decoded.date !== today) {
      return res.json({ allowed: true, remaining: 5, isNewDay: true });
    }
    
    const remaining = 5 - (decoded.count || 0);
    
    res.json({ 
      allowed: remaining > 0, 
      remaining: Math.max(0, remaining),
      count: decoded.count || 0
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
