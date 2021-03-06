import { validate } from "class-validator";
import { Brackets, getRepository, Not } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import photoUploader from "../../helpers/photo-uploader.helper";
import { Photo } from "../photo/photo.service";
import { Party } from "./entity/party.entity";
import {
  CreatePartyBody,
  GetPartyBody,
  UpdatePartyBody,
} from "./party.interface";
import { PartyLogo } from "./entity/party-logo.entity";
import { PartyCoverPhoto } from "./entity/party-cover-photo.entity";
import { Position } from "../position/entity/position.entity";
import { Candidate } from "../candidate/entity/candidate.entity";

const getAll = async (_electionId: string, _query: GetPartyBody) => {
  const partyRepository = getRepository(Party);
  const searchStirng = _query.search ? _query.search : "";
  const withArchive = _query.withArchive;

  if (!_electionId)
    throw new HttpException("BAD_REQUEST", "Election id is required");

  let builder = partyRepository
    .createQueryBuilder("party")
    .leftJoinAndSelect("party.logo", "logo")
    .leftJoinAndSelect("party.cover_photo", "cover")
    .where("party.election_id = :electionId", {
      electionId: _electionId,
    });

  if (!withArchive) {
    builder = builder.andWhere("party.archive = :bol", { bol: false });
  }

  if (searchStirng) {
    builder = builder.andWhere(
      new Brackets((sqb) => {
        sqb.orWhere("party.ticker ILIKE :ticker", {
          ticker: `%${searchStirng}%`,
        });
        sqb.orWhere("party.title ILIKE :title", {
          title: `%${searchStirng}%`,
        });
      })
    );
  }

  builder = builder.orderBy({
    "party.created_at": "DESC",
  });

  if (_query.order) {
    builder = builder.addOrderBy("party.title", _query.order);
    builder = builder.addOrderBy("party.ticker", _query.order);
  }

  if (_query.page && _query.take) {
    const offset = _query.page * _query.take - _query.take;
    builder = builder.offset(offset).limit(_query.take);
  }

  const items = await builder.getMany();

  const totalCount = await partyRepository.count({
    where: { election_id: _electionId },
  });

  return {
    items,
    totalCount,
    itemsCount: items.length,
  };
};

const getById = async (_id: string) => {
  if (!_id) throw new HttpException("BAD_REQUEST", "Party ID is required");

  const party = await Party.findOne(_id, {
    relations: ["logo", "cover_photo", "election"],
    where: {
      archive: false,
    },
  });

  return party || null;
};

const create = async (_logo: Photo, _party: CreatePartyBody, _cover: Photo) => {
  if (!_logo) throw new HttpException("BAD_REQUEST", "Logo is required");

  const uploadedLogo = await photoUploader.upload(
    "party_photos",
    _logo.tempFilePath
  );

  const logo = PartyLogo.create({
    public_id: uploadedLogo.public_id,
    url: uploadedLogo.secure_url,
  });

  let uploadedCoverPhoto;
  let partyCoverPhoto;
  if (_cover) {
    uploadedCoverPhoto = await photoUploader.upload(
      "party_photos",
      _cover.tempFilePath
    );

    partyCoverPhoto = PartyCoverPhoto.create({
      public_id: uploadedCoverPhoto.public_id,
      url: uploadedCoverPhoto.secure_url,
    });

    await partyCoverPhoto.save();
  }

  await logo.save();

  const party = Party.create({
    ticker: _party.ticker,
    title: _party.title,
    description: _party.description,
    logo: logo,
    cover_photo: partyCoverPhoto,
    election_id: _party.election_id,
  });

  const savedParty = await party.save();

  console.log(savedParty);

  return party;
};

const update = async (_logo: Photo, _party: UpdatePartyBody, _cover: Photo) => {
  if (!_party.id) {
    throw new HttpException("BAD_REQUEST", "Party ID is required");
  }

  const curParty = await Party.findOne(_party.id, {
    relations: ["logo", "cover_photo"],
  });

  if (!curParty) {
    throw new HttpException("NOT_FOUND", "Party not found");
  }

  console.log("Prev:", curParty, "Passed:", _party);

  let toUpdateLogo = curParty.logo;

  if (_logo && _logo.tempFilePath) {
    //since there is a new logo provided we will destroy the exisiting image then replace before uploading a new one, so when error occcured on destory image the whole process will stop
    if (curParty.logo) {
      await photoUploader.destroy(curParty.logo.public_id);
    }

    const uploadedLogo = await photoUploader.upload(
      "party_photos",
      _logo.tempFilePath
    );

    // if the previous logo is null then save the new logo
    // else replaced the old public_id and url
    if (!curParty.logo) {
      console.log("Logo is EMPTY so saving a new one");
      toUpdateLogo = PartyLogo.create({
        public_id: uploadedLogo.public_id,
        url: uploadedLogo.secure_url,
      });
      toUpdateLogo = await toUpdateLogo.save();
    } else {
      console.log("Logo is AVAILABLE so saving a new one");
      toUpdateLogo.public_id = uploadedLogo.public_id;
      toUpdateLogo.url = uploadedLogo.secure_url;
    }
  }

  console.log("Logo Data", toUpdateLogo);

  let toUpdateCoverPhoto = curParty.cover_photo;

  if (_cover && _cover.tempFilePath) {
    //since there is a new logo provided we will destroy the exisiting image then replace before uploading a new one, so when error occcured on destory image the whole process will stop
    if (curParty.cover_photo) {
      await photoUploader.destroy(curParty.cover_photo.public_id);
    }

    const uploadedCoverPhoto = await photoUploader.upload(
      "party_photos",
      _cover.tempFilePath
    );

    // if the previous logo is null then save the new logo
    // else replaced the old public_id and url
    if (!curParty.cover_photo) {
      console.log("Cover Photo is EMPTY so saving a new one");
      toUpdateCoverPhoto = PartyCoverPhoto.create({
        public_id: uploadedCoverPhoto.public_id,
        url: uploadedCoverPhoto.secure_url,
      });
      toUpdateCoverPhoto = await toUpdateCoverPhoto.save();
    } else {
      console.log("Cover Photo is AVAILABLE so saving a new one");
      toUpdateCoverPhoto.public_id = uploadedCoverPhoto.public_id;
      toUpdateCoverPhoto.url = uploadedCoverPhoto.secure_url;
    }
  }

  console.log("Cover Photo Data", toUpdateCoverPhoto);

  const toUpdateParty = Party.merge(curParty, {
    title: _party.title,
    description: _party.description,
    ticker: _party.ticker,
    logo: toUpdateLogo,
    cover_photo: toUpdateCoverPhoto,
  });

  await PartyCoverPhoto.update(toUpdateCoverPhoto.id, toUpdateCoverPhoto);
  await PartyLogo.update(toUpdateLogo.id, toUpdateLogo);
  await Party.update(curParty.id, toUpdateParty);
  return true;
};

const remove = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Party id is required");
  }

  const party = await Party.findOne(_id);

  if (!party) {
    throw new HttpException("NOT_FOUND", "Party not found");
  }

  await party.softRemove();

  return true;
};

const restore = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Organization id is required");
  }

  const party = await Party.findOne(_id, {
    withDeleted: true,
  });

  if (!party) {
    throw new HttpException("NOT_FOUND", "Organization not found");
  }

  await party.recover();
  return true;
};

const archive = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Party id is required");
  }

  const party = await Party.findOne(_id);

  if (!party) {
    throw new HttpException("NOT_FOUND", "Party not found");
  }

  party.archive = true;

  await party.save();
  return true;
};

const unarchive = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Organization id is required");
  }

  const party = await Party.findOne(_id);

  if (!party) {
    throw new HttpException("NOT_FOUND", "Party not found");
  }

  party.archive = false;

  await party.save();
  return true;
};

const partyService = {
  getAll,
  getById,
  create,
  update,
  remove,
  restore,
  archive,
  unarchive,
};

export default partyService;
