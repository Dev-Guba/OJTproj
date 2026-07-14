
import { Article, Backlog, Employee, Record } from "../models/index.js";

export const getAllBacklogs = async () => {
  try {
    const backlogs = await Backlog.findAll({
      include: [
        {
          model: Record,
          include: [
            {
              model: Employee,
            },
            {
              model: Article,
            },
          ],
        },
      ],
      order: [["tracking_id", "DESC"]],
    });

    return backlogs;
    
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function createForRecord(recordId, checkStatus, transaction) {
  return await Backlog.create(
    {
      records_id: recordId,
      status: checkStatus,
    },
    { transaction }
  );
}
