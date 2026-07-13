import { getAllBacklogs } from "../services/backlogServices.js";

export async function handleGetAllBacklogs(req,res){
    try {
        const response = await getAllBacklogs();

        return res.status(200).json({
            success: true,
            message: "Backlog fetch successfully",
            data: response
        });
    } catch (error) {
        
    }
}