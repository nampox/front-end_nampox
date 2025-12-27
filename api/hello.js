export default function handler(req, res) {
  const { name = 'Bạn' } = req.query;
  
  res.status(200).json({
    message: `Xin chào, ${name}! 👋`,
    timestamp: new Date().toISOString(),
    method: req.method
  });
}

