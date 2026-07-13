import {Backlog ,Record} from '../models/index.js'

export const getAllBacklogs = async (req, res) => {
  try {
    const backlogs = await Backlog.findAll({
      include: [
        {
          model: Record,
        },
      ],
      order: [["tracking_id", "DESC"]],
    });

    return backlogs;
  } catch (error) {
    console.log(error)
   }
}