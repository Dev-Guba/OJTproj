import { success } from 'zod';
import {
getAllRecords, 
getRecordById,
createRecord, 
updateRecord,
deleteRecord
}
from '../services/recordServices.js';
import { json } from 'sequelize';

/* ======================
   CRUD
====================== */

export async function handleGetRecordID(req, res){
  try {
    const record = await getRecordById(Number(req.params.id));
    if (!record){
      return res
      .status(404)
      .json({
        success: false,
        message: "Record not found",
      });
    }
    res.status(200).json({success: true, data: record})
  } catch (error) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function handleRecords(req, res) {
  try {
    const records = await getAllRecords();
    return res.status(200).json({success: true ,message: "Successfully fetch", data: records});
  } catch (err) {
    console.log("Cannot get records ",err);
    return res.status(500).json({error: "Server Error"});
  }
}

export async function handleCreateRecords(req,res){
  try {
    const data = req.body;
    console.log(data);
    const result = await createRecord(data);
    console.log(result);

    return res.status(201).json({
      success: true,
      message: "Record successfully created",
      data: result,
    });
  } catch (err) {
    console.log("Create records error ", err);
    return res.status(500).json({error: "Server error"});
  }
}

export async function handleUpdateRecords(req,res){
  try {
    const id = (Number(req.params.id));
    const existing = await getRecordById(id);

    if(!existing){
      return res
        .status(404)
        .json({
          success: false,
          message: "Records not found",
        });
    }
    const data = req.body;
        const result = await updateRecord(
          Number(req.params.id),
          data,
        );
      return res
        .status(200)
        .json({
          success: true,
          message: "Record successfully created",
          data: result,
        });
  } catch (err) {
    console.log("Update record error ", err);
    return res.status(500).json({error: "Server error"});
  }
}

export async function handleDeleteRecords(req, res){
  try {
    const id = (Number(req.params.id));
    const existing = await getRecordById(id);
    if(!existing){
      return res
      .status(404)
      .json({
        success: false,
        message: "Records not found",
      });
    }

    await deleteRecord(id);
    return res
    .status(200)
    .json({
      success: true,
      message: "Record successfully deleted",
    });

  } catch (err) {
    console.log("Delete record error ", err)
    return res.status(500).json({error: "Server error"});
  }
}