import  Employee  from "../models/employee.model.js";

export async function getAllEmployees() {
  return await Employee.findAll();
}