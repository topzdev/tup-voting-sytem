import fileUpload from "express-fileupload";
import { HttpException } from "../../helpers/errors/http.exception";
import photoUploader from "../../helpers/photo-uploader.helper";
import path from "path";

export type Photo = fileUpload.UploadedFile;

const uploadTest = async (_photo: Photo) => {
  if (!_photo) throw new HttpException("BAD_REQUEST", "photo is required");

  const filename = path.parse(_photo.name).name;
  const photoFilePath = _photo.tempFilePath;

  const photo = await photoUploader.upload("test_photos", photoFilePath, {
    filename,
  });

  console.log("Uploaded Photo");

  return photo;
};

const photoServices = {
  uploadTest,
};

export default photoServices;
