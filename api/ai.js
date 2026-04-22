import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// ── 额度验证 ──────────────────────────────────────────
async function verifyQuota(token) {
  if (!token) return { allowed: false, reason: 'no_token' };
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'session') return { allowed: false, reason: 'invalid_type' };
    const today = new Date().toISOString().split('T')[0];
    // 新的一天，免费5次
    if (decoded.date !== today) return { allowed: true, remaining: 5 };
    const remaining = 5 - (decoded.count || 0);
    return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
  } catch {
    return { allowed: false, reason: 'invalid_token' };
  }
}
// ─────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── 额度验证：防止直接绕过 ──────────────────────────
  const authToken =
    req.headers.authorization?.replace('Bearer ', '') ||
    req.body?.token ||
    null;

  // 没 token → 直接拒绝
  if (!authToken) {
    return res.status(401).json({ error: 'Please verify your email first' });
  }

  // 有 token → 检查额度
  const quota = await verifyQuota(authToken);
  if (!quota.allowed) {
    const msg =
      quota.reason === 'no_token' || quota.reason === 'invalid_token'
        ? 'Please verify your email first'
        : 'Daily quota exceeded';
    return res.status(429).json({ error: msg });
  }
  // ──────────────────────────────────────────────────

  const { content, type, system, messages } = req.body;

  try {
    let requestMessages = [];

    // 通用格式（messages 数组）
    if (messages && Array.isArray(messages)) {
      // 如果同时传了 system prompt，注入为第一条消息
      if (system) {
        requestMessages = [{ role: 'system', content: system }, ...messages];
      } else {
        requestMessages = messages;
      }

    // 简历优化专用格式（content + type）
    } else if (content && type) {
      const systemPrompt =
        type === 'bullet'
          ? 'You are a professional resume optimizer. Convert experience descriptions into 3-5 strong bullet points using STAR method. Focus on quantifiable achievements. Use action verbs. Return only the bullet points, one per line.'
          : 'You are a professional resume optimizer. Improve this resume content to be more professional, concise, and impactful. Focus on achievements and quantifiable results.';

      requestMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: content }
      ];

    // 简单格式（system prompt）
    } else if (system) {
      requestMessages = [
        { role: 'system', content: system },
        { role: 'user', content: content || '' }
      ];

    } else {
      return res.status(400).json({ error: 'Invalid request: need content+type or messages' });
    }

    // ── 调用 SiliconFlow AI ──────────────────────────
    const apiKey = process.env.SILICONFLOW_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'AI service not configured (SILICONFLOW_API_KEY missing)' });
    }

    const response = await fetch('https://api.siliconflow.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3.2',
        messages: requestMessages,
        temperature: 0.4,
        max_tokens: 4000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('SiliconFlow API error:', JSON.stringify(data));
      throw new Error(data.error?.message || `API request failed: ${response.status}`);
    }

    // 只返回生成的内容，过滤 usage/cost 等信息
    res.json({ result: data.choices[0].message.content });

  } catch (error) {
    console.error('AI API error:', error.message);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
