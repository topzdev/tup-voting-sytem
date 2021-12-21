import csv from "csv-parser";
import fileUpload from "express-fileupload";
import fs from "fs";
export type File = fileUpload.UploadedFile;

const parseCSV = async (csvFile: File) => {
  const results = [];

  await fs
    .createReadStream(csvFile.tempFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => console.log(results));

  const csvPromise = await new Promise((resolve, reject) => {});

  return csvPromise as any[];
};

export default parseCSV;
