import cloudinary, { UploadApiResponse } from "cloudinary";
import configs from "../configs";
import { HttpException, httpStatus } from "./errors/http.exception";

const uploader = cloudinary.v2.uploader;

const folder = configs.cloudinary.folder;

console.log("Cloudinary folder is:", folder);

export const cloudFolders = {
  candidate_photos: `${folder}/candidates_photos`,
  org_photos: `${folder}/org_photos`,
  party_photos: `${folder}/party_photos`,
  test_photos: `${folder}/test_photos`,
};

type CloudFoldersTypes = keyof typeof cloudFolders;
type UploadOptions = {
  filename?: string;
};

const upload = async (
  _folder: CloudFoldersTypes,
  _photo: string,
  _options?: UploadOptions
): Promise<UploadApiResponse> => {
  if (!_photo) throw new HttpException("BAD_REQUEST", "Please upload photo");

  try {
    const uploadedPhoto = await uploader.upload(_photo, {
      public_id: _options && _options.filename ? _options.filename : undefined,
      folder: cloudFolders[_folder],
    });

    console.log("cloudinary upload: ", uploadedPhoto);

    return uploadedPhoto;
  } catch (error) {
    throw new Error(error.message);
  }
};

const multiUpload = async (
  _folder: CloudFoldersTypes,
  _photos: string[]
): Promise<UploadApiResponse[]> => {
  try {
    const photosLength = _photos.length;
    const uploadedPhotos: UploadApiResponse[] = [];

    _photos.forEach((item) => {
      uploader.upload(
        item,
        { folder: cloudFolders[_folder] },
        (error, result) => {
          if (error) throw Error("Something went wrong on upload");
          uploadedPhotos.push(result);
        }
      );
    });

    if (!(uploadedPhotos.length === photosLength))
      throw Error("Something went wrong on phot oupload");

    return uploadedPhotos;
  } catch (error) {
    throw new Error(error.message);
  }
};

const photoUploader = {
  multiUpload,
  upload,
};

export default photoUploader;
