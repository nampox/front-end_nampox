// Fake database - trong thực tế sẽ kết nối database thật
const users = [
  { id: 1, name: 'Nguyễn Văn A', email: 'vana@example.com', role: 'Admin' },
  { id: 2, name: 'Trần Thị B', email: 'thib@example.com', role: 'User' },
  { id: 3, name: 'Lê Văn C', email: 'vanc@example.com', role: 'User' },
  { id: 4, name: 'Phạm Thị D', email: 'thid@example.com', role: 'Moderator' },
];

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: users,
      total: users.length
    });
  }

  if (req.method === 'POST') {
    const { name, email, role = 'User' } = req.body || {};
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp tên và email'
      });
    }

    const newUser = {
      id: users.length + 1,
      name,
      email,
      role
    };
    
    users.push(newUser);
    
    return res.status(201).json({
      success: true,
      data: newUser,
      message: 'Tạo người dùng thành công!'
    });
  }

  return res.status(405).json({
    success: false,
    error: 'Method không được hỗ trợ'
  });
}

