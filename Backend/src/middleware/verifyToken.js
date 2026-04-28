import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  // 1. Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      ...decoded,
      SameDeptCode: decoded.officeCode,   // 👈 map officeCode → SameDeptCode
      role_id: decoded.roleId,            // 👈 map roleId → role_id
      EmployeeNo: decoded.employeeNo,     // 👈 map employeeNo → EmployeeNo
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

export default verifyToken;