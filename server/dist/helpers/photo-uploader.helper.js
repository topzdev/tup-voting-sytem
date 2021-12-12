"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudFolders = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const configs_1 = __importDefault(require("../configs"));
const http_exception_1 = require("./errors/http.exception");
const uploader = cloudinary_1.default.v2.uploader;
const folder = configs_1.default.cloudinary.folder;
console.log("Cloudinary folder is:", folder);
exports.cloudFolders = {
    candidate_photos: `${folder}/candidates_photos`,
    org_photos: `${folder}/org_photos`,
    party_photos: `${folder}/party_photos`,
    test_photos: `${folder}/test_photos`,
};
const destroy = (_public_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_public_id)
        throw new http_exception_1.HttpException("BAD_REQUEST", "Image public id not provided");
    try {
        const destroyedPhoto = yield uploader.destroy(_public_id);
        console.log("cloudinary destory", destroyedPhoto);
        return true;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
const upload = (_folder, _photo, _options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_photo)
        throw new http_exception_1.HttpException("BAD_REQUEST", "Please upload photo");
    try {
        const uploadedPhoto = yield uploader.upload(_photo, {
            public_id: _options && _options.filename ? _options.filename : undefined,
            folder: exports.cloudFolders[_folder],
        });
        console.log("cloudinary upload: ", uploadedPhoto);
        return uploadedPhoto;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
const multiUpload = (_folder, _photos) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const photosLength = _photos.length;
        const uploadedPhotos = [];
        _photos.forEach((item) => {
            uploader.upload(item, { folder: exports.cloudFolders[_folder] }, (error, result) => {
                if (error)
                    throw Error("Something went wrong on upload");
                uploadedPhotos.push(result);
            });
        });
        if (!(uploadedPhotos.length === photosLength))
            throw Error("Something went wrong on phot oupload");
        return uploadedPhotos;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
const photoUploader = {
    multiUpload,
    upload,
    destroy,
};
exports.default = photoUploader;
//# sourceMappingURL=photo-uploader.helper.js.map