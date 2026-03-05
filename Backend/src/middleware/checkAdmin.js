import { Role } from "../models";

export function checkAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if(Role.role_id !== 1){
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
}