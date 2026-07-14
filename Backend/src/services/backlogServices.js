import {Article, Backlog ,Employee,Record} from '../models/index.js'

export const getAllBacklogs = async (req, res) => {
  try {
    const backlogs = await Backlog.findAll({
      include: [
        {
          model: Record,
          include: [
            {
              model: Employee
            },
            {
              model: Article
            }
          ]
        },
      ],
      order: [["tracking_id", "DESC"]],
    });

    return backlogs;
  } catch (error) {
    console.log(error)
   }
}

export async function createForRecord(recordId, checkStatus, transaction) {
  const form = await Backlog.create(
    {
      records_id: recordId,
      status: checkStatus,
    },
    {
      transaction,
    }
  );

  return form;
}