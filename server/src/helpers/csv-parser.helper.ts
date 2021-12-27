import csv from "csvtojson";
import { Response } from "express";
import fileUpload from "express-fileupload";
import { Parser } from "json2csv";
export type File = fileUpload.UploadedFile;

export const parseCsvToJson = async (csvFile: File) => {
  return await csv().fromFile(csvFile.tempFilePath);
};

export const parseJsontoCsv = async (fields: any[], data: any[]) => {
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(data);
  return csv;
};
