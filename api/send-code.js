import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // 生成 JWT token 包含验证码
  const token = jwt.sign({ email, code, type: 'verify' }, JWT_SECRET, { expiresIn: '5m' });
  
  // 发送邮件
  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
    
    await transporter.sendMail({
      from: `"Wrijo" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Wrijo - Your verification code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
          <h2 style="color: #0066ff;">Wrijo</h2>
          <p>Your verification code is:</p>
          <div style="font-size: 32px; font-weight: bold; color: #0066ff; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 5 minutes.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `
    });
    
    res.json({ success: true, token });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
