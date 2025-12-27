export default function handler(req, res) {
  const now = new Date();
  
  // Múi giờ Việt Nam (UTC+7)
  const vnTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  
  res.status(200).json({
    utc: now.toISOString(),
    vietnam: vnTime.toISOString().replace('Z', '+07:00'),
    unix: Math.floor(now.getTime() / 1000),
    formatted: vnTime.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    server: 'Vercel Serverless'
  });
}

