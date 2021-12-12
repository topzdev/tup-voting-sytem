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
const photo_service_1 = __importDefault(require("./photo.service"));
const uploadTester = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const photo = req.files.photo;
        console.log(photo);
        // res.status(200).json(await photoServices.uploadTest(req.files));
        res.status(200).json(yield photo_service_1.default.uploadTest(photo));
    }
    catch (error) {
        next(error);
    }
});
const photoController = {
    uploadTester,
};
exports.default = photoController;
//# sourceMappingURL=photo.controller.js.map