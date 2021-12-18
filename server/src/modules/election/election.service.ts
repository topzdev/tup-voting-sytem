import { validate } from "class-validator";
import { getRepository, Not } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import photoUploader from "../../helpers/photo-uploader.helper";
import { Photo } from "../photo/photo.service";
import { Election } from "./entity/election.entity";
import {
  CreateElectionBody,
  GetElectionBody,
  UpdateElectionBody,
} from "./election.inteface";

// const User = getRepository(User);

const getAll = async (_query: GetElectionBody) => {};

const getById = async (_id: string) => {};

const create = async (_logo: Photo, _election: CreateElectionBody) => {};

const update = async (_logo: Photo, _election: UpdateElectionBody) => {};

const remove = async (_id: string) => {};

const restore = async (_id: string) => {};

const archive = async (_id: string) => {};

const unarchive = async (_id: string) => {};

const electionServices = {
  getAll,
  getById,
  create,
  update,
  remove,
  restore,
  archive,
  unarchive,
};

export default electionServices;
