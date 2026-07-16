
import { Article, Backlog, Employee, Record } from "../models/index.js";

export const getAllBacklogs = async () => {
  try {

    const backlogs = await Backlog.findAll({

      include: [

        // Asset Record
        {
          model: Record,
          include: [

            {
              model: Employee,
              attributes:[
                "EmployeeId",
                "EmployeeNo",
                "FirstName",
                "LastName",
              ],
            },

            {
              model: Article,
              attributes:[
                "ArticleId",
                "article",
                "description",
                "propNumber",
              ],
            },

          ],
        },


        // Previous Owner
        {
          model: Employee,
          as:"PreviousOwner",
          attributes:[
            "EmployeeId",
            "EmployeeNo",
            "FirstName",
            "LastName",
          ],
        },


        // New Owner
        {
          model: Employee,
          as:"NewOwner",
          attributes:[
            "EmployeeId",
            "EmployeeNo",
            "FirstName",
            "LastName",
          ],
        },


        // Who performed the action
        {
          model: Employee,
          as:"PerformedBy",
          attributes:[
            "EmployeeId",
            "EmployeeNo",
            "FirstName",
            "LastName",
          ],
        },

      ],


      order:[
        ["tracking_id","DESC"]
      ]

    });


    return backlogs;


  } catch(error){
    throw error;
  }
};

export async function createForRecord(
  {
    recordId,
    articleId,
    previousEmployeeId = null,
    newEmployeeId = null,
    performedBy,
    action,
    remarks = null,
  },
  transaction
) {
  return await Backlog.create(
    {
      records_id: recordId,

      article_id: articleId,

      previous_employee_id: previousEmployeeId,

      new_employee_id: newEmployeeId,

      performed_by: performedBy,

      action,

      remarks,
    },
    { transaction }
  );
}
