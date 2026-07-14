
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
              attributes: ["FirstName", "LastName"],
            },
            {
              model: Article,
              attributes: ["article", "propNumber"],
            },
          ],
        },
      ],
      order: [["tracking_id", "DESC"]],
    });

    return backlogs.map((log) => {
      const row = log.toJSON();

      const employee = row.Record?.Employee;
      const article = row.Record?.Article;

      const fullName = [
        employee?.FirstName,
        employee?.LastName,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        id: row.tracking_id,

        createdAt: row.createdAt,

        time: new Date(row.createdAt).toLocaleString(),

        user: fullName || "Unknown",

        role: "Employee",

        module: "Records",

        office: row.Record?.office || "-",

        activity: article
          ? `${row.status} ${article.article} (${article.propNumber})`
          : row.status,

        action: row.status.toUpperCase(),
      };
    });
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
