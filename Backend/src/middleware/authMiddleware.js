import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      ...decoded,
      SameDeptCode: decoded.officeCode,   // 👈 map officeCode → SameDeptCode
      role_id: decoded.roleId,            // 👈 map roleId → role_id
      EmployeeNo: decoded.employeeNo,     // 👈 map employeeNo → EmployeeNo
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(roleId) {
  return (req, res, next) => {
    if (!req.user || req.user.role_id !== roleId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}