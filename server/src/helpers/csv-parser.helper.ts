import csv from "csvtojson";
import { CSVParseParam } from "csvtojson/v2/Parameters";
import { Response } from "express";
import fileUpload from "express-fileupload";
import { Parser } from "json2csv";
export type File = fileUpload.UploadedFile;

export async function parseCsvToJson(
  csvFile: File,
  params: Partial<CSVParseParam>
) {
  return await csv(params).fromFile(csvFile.tempFilePath);
}

export const parseJsontoCsv = async (fields: any[], data: any[]) => {
  const json2csv = new Parser({ fields });
  const parsedData = json2csv.parse(data);
  return parsedData;
};
