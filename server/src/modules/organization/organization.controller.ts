import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import {
  CreateOrganizationParams,
  GetOrganizationParams,
  UpdateOrganizationParams,
  UpdateTermsAndCondition,
} from "./organization.interface";
import organizationService from "./organization.service";
import { unflatten } from "flat";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, take, order, search, withArchive } = req.query as any;
    const user = req.admin;

    console.log(user);

    res.status(200).json(
      await organizationService.getAll(user, {
        page: page ? parseInt(page) : undefined,
        take: take ? parseInt(take) : undefined,
        order,
        search,
        withArchive: withArchive ? Boolean(withArchive) : undefined,
      })
    );
  } catch (error) {
    next(error);
  }
};

const getOneBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug;

    res.status(200).json(await organizationService.getBySlug(slug));
  } catch (error) {
    next(error);
  }
};

const getOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await organizationService.getById(id));
  } catch (error) {
    next(error);
  }
};

const isExistBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug;

    res.status(200).json(await organizationService.isExistBySlug(slug));
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logo = req.files.logo as fileUpload.UploadedFile;

    const organization = unflatten<CreateOrganizationParams, any>(req.body);

    console.log(logo, organization);

    res.status(200).json(await organizationService.create(logo, organization));
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logo = req.files
      ? (req.files.logo as fileUpload.UploadedFile)
      : undefined;

    const organization = unflatten<UpdateOrganizationParams, any>(req.body);

    console.log(logo, organization);

    res.status(200).json(await organizationService.update(logo, organization));
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await organizationService.remove(id));
  } catch (error) {
    next(error);
  }
};

const restore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await organizationService.restore(id));
  } catch (error) {
    next(error);
  }
};

const archive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await organizationService.archive(id));
  } catch (error) {
    next(error);
  }
};

const unarchive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    res.status(200).json(await organizationService.unarchive(id));
  } catch (error) {
    next(error);
  }
};

const updateTermsAndCondition = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = unflatten<UpdateTermsAndCondition, any>(req.body);
    res
      .status(200)
      .json(await organizationService.updateTermsAndCondition(dto));
  } catch (error) {
    next(error);
  }
};

const organizationController = {
  getAll,
  getOneBySlug,
  getOneById,
  create,
  update,
  remove,
  restore,
  isExistBySlug,
  archive,
  unarchive,
  updateTermsAndCondition,
};

export default organizationController;
