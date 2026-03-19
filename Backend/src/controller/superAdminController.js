import { getAllEmployees } from "../services/superAdminServices.js";

export async function handleGetAllEmployees(req, res) {
  try {
    const employees = await getAllEmployees();
    return res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      data: employees,
    });
  } catch (err) {
    console.log("Get all employees error ", err);
    return res.status(500).json({ error: "Server error" });
  }
}