import fileUpload from "express-fileupload";
import { Brackets, getRepository, Not } from "typeorm";
import {
  File,
  parseCsvToJson,
  parseJsontoCsv,
} from "../../helpers/csv-parser.helper";
import { HttpException } from "../../helpers/errors/http.exception";
import parseDate from "../../helpers/parse-date.helper";
import photoUploader from "../../helpers/photo-uploader.helper";
import { Photo } from "../photo/photo.service";
import {
  CreateCandidateBody,
  GetCandidateBody,
  UpdateCandidateBody,
} from "./candidate.interface";
import { CandidateCoverPhoto } from "./entity/candidate-cover-photo.entity";
import { CandidateProfilePhoto } from "./entity/candidate-profile-photo.entity";
import { CandidateSocials } from "./entity/candidate-socials.entity";
import { Candidate } from "./entity/candidate.entity";

const getAll = async (_electionId: string, _query: GetCandidateBody) => {
  const candidateRepository = getRepository(Candidate);
  const searchStirng = _query.search ? _query.search : "";
  const withArchive = _query.withArchive;

  if (!_electionId)
    throw new HttpException("BAD_REQUEST", "Election id is required");

  let builder = candidateRepository
    .createQueryBuilder("candidate")
    .leftJoinAndSelect("candidate.party", "party")
    .leftJoinAndSelect("candidate.position", "position")
    .leftJoinAndSelect("candidate.profile_photo", "profile_photo")
    .where("candidate.election_id = :electionId", {
      electionId: _electionId,
    });

  if (!withArchive) {
    builder = builder.andWhere("candidate.archive = :bol", { bol: false });
  }

  if (searchStirng) {
    builder = builder.andWhere(
      new Brackets((sqb) => {
        sqb.orWhere("candidate.firstname ILIKE :firstname", {
          firstname: `%${searchStirng}%`,
        });
        sqb.orWhere("candidate.lastname ILIKE :lastname", {
          lastname: `%${searchStirng}%`,
        });
      })
    );
  }

  if (_query.partyId) {
    builder = builder.andWhere("candidate.party_id = :partyId", {
      partyId: _query.partyId,
    });
  }

  if (_query.positionId) {
    builder = builder.andWhere("candidate.position_id = :positionId", {
      positionId: _query.positionId,
    });
  }

  builder = builder.orderBy({
    "candidate.created_at": "DESC",
  });

  if (_query.order) {
    builder = builder.addOrderBy("candidate.firstname", _query.order);
    builder = builder.addOrderBy("candidate.lastname", _query.order);
  }

  if (_query.page && _query.take) {
    const offset = _query.page * _query.take - _query.take;
    builder = builder.offset(offset).limit(_query.take);
  }

  const items = await builder.getMany();
  const totalCount = await candidateRepository.count({
    where: { election_id: _electionId },
  });
  return {
    items,
    totalCount: totalCount,
    itemsCount: items.length,
  };
};

const getById = async (_id: string) => {
  if (!_id) throw new HttpException("BAD_REQUEST", "Candidate ID is required");

  const candidate = await Candidate.findOne(_id, {
    relations: [
      "profile_photo",
      "cover_photo",
      "election",
      "party",
      "position",
      "socials",
    ],
    where: {
      archive: false,
    },
  });

  console.log(candidate);

  return candidate || null;
};

const create = async (
  _profilePhoto: Photo,
  _coverPhoto: Photo,
  _candidate: CreateCandidateBody
) => {
  if (!_candidate.election_id)
    throw new HttpException("BAD_REQUEST", "Election is required");

  if (!_candidate.position_id)
    throw new HttpException("BAD_REQUEST", "Position is required");

  // if (!_candidate.party_id)
  //   throw new HttpException("BAD_REQUEST", "Party is required");

  console.log("Body Candidate:", _candidate);

  const uploadedProfilePhoto = await photoUploader.upload(
    "candidate_photos",
    _profilePhoto.tempFilePath
  );

  const uploadedCoverPhoto = await photoUploader.upload(
    "candidate_photos",
    _profilePhoto.tempFilePath
  );

  const candidateProfilePhoto = CandidateProfilePhoto.create({
    public_id: uploadedProfilePhoto.public_id,
    url: uploadedProfilePhoto.secure_url,
  });
  const candidateCoverPhoto = CandidateCoverPhoto.create({
    public_id: uploadedCoverPhoto.public_id,
    url: uploadedCoverPhoto.secure_url,
  });
  const candidateSocials = CandidateSocials.create({
    facebook_url: _candidate.facebook_url,
    linkedin_url: _candidate.linkedin_url,
    twitter_url: _candidate.twitter_url,
    website_url: _candidate.website_url,
    insta_url: _candidate.insta_url,
  });

  await candidateProfilePhoto.save();
  await candidateCoverPhoto.save();
  await candidateSocials.save();

  const candidate = Candidate.create({
    firstname: _candidate.firstname,
    middlename: _candidate.middlename,
    lastname: _candidate.lastname,
    platform: _candidate.platform,
    description: _candidate.description,
    election_id: _candidate.election_id,
    position_id: _candidate.position_id,
    party_id: _candidate.party_id,
    profile_photo: candidateProfilePhoto,
    cover_photo: candidateCoverPhoto,
    socials: candidateSocials,
    use_party_cover_photo: _candidate.use_party_cover_photo,
  });

  const savedCandidate = await candidate.save();

  console.log(savedCandidate);

  return candidate;
};

const update = async (
  _profilePhoto: Photo,
  _coverPhoto: Photo,
  _candidate: UpdateCandidateBody
) => {
  console.log(
    "Update Candiate Data",
    _candidate,
    _candidate.use_party_cover_photo
  );

  if (!_candidate.id) {
    throw new HttpException("BAD_REQUEST", "Candidate ID is required");
  }

  const curCandidate = await Candidate.findOne(_candidate.id, {
    relations: ["profile_photo", "cover_photo", "socials"],
  });

  if (!curCandidate) {
    throw new HttpException("NOT_FOUND", "Candidate not found");
  }
  console.log("Prev:", curCandidate, "Passed:", _candidate);

  if (!_candidate.election_id)
    throw new HttpException("BAD_REQUEST", "Election is required");

  if (!_candidate.position_id)
    throw new HttpException("BAD_REQUEST", "Position is required");

  // if (!_candidate.party_id)
  //   throw new HttpException("BAD_REQUEST", "Party is required");

  let toUpdateSocials = curCandidate.socials;

  if (!curCandidate.socials) {
    toUpdateSocials = CandidateSocials.create({
      facebook_url: _candidate.facebook_url,
      linkedin_url: _candidate.linkedin_url,
      twitter_url: _candidate.twitter_url,
      website_url: _candidate.website_url,
      insta_url: _candidate.insta_url,
    });

    toUpdateSocials.save();
  } else {
    toUpdateSocials = CandidateSocials.merge(toUpdateSocials, {
      facebook_url: _candidate.facebook_url,
      linkedin_url: _candidate.linkedin_url,
      twitter_url: _candidate.twitter_url,
      website_url: _candidate.website_url,
      insta_url: _candidate.insta_url,
    });
  }

  let toUpdateProfilePhoto = curCandidate.profile_photo;

  if (_profilePhoto && _profilePhoto.tempFilePath) {
    if (curCandidate.profile_photo) {
      await photoUploader.destroy(curCandidate.profile_photo.public_id);
    }

    const uploadedProfilePhoto = await photoUploader.upload(
      "candidate_photos",
      _profilePhoto.tempFilePath
    );

    if (!curCandidate.profile_photo) {
      toUpdateProfilePhoto = CandidateProfilePhoto.create({
        public_id: uploadedProfilePhoto.public_id,
        url: uploadedProfilePhoto.url,
      });
      await toUpdateProfilePhoto.save();
    } else {
      toUpdateProfilePhoto = CandidateProfilePhoto.merge(toUpdateProfilePhoto, {
        public_id: uploadedProfilePhoto.public_id,
        url: uploadedProfilePhoto.url,
      });
    }
  }

  let toUpdateCoverPhoto = curCandidate.cover_photo;

  if (_coverPhoto && _coverPhoto.tempFilePath) {
    if (curCandidate.cover_photo) {
      await photoUploader.destroy(curCandidate.cover_photo.public_id);
    }

    const uploadedCoverPhoto = await photoUploader.upload(
      "candidate_photos",
      _coverPhoto.tempFilePath
    );

    if (!curCandidate.cover_photo) {
      toUpdateCoverPhoto = CandidateCoverPhoto.create({
        public_id: uploadedCoverPhoto.public_id,
        url: uploadedCoverPhoto.url,
      });
      await toUpdateCoverPhoto.save();
    } else {
      toUpdateCoverPhoto = CandidateCoverPhoto.merge(toUpdateCoverPhoto, {
        public_id: uploadedCoverPhoto.public_id,
        url: uploadedCoverPhoto.url,
      });
    }
  }

  const toUpdateCandidate = Candidate.merge(curCandidate, {
    firstname: _candidate.firstname,
    middlename: _candidate.middlename,
    lastname: _candidate.lastname,
    platform: _candidate.platform,
    description: _candidate.description,
    position_id: _candidate.position_id,
    party_id: _candidate.party_id,
    profile_photo: toUpdateProfilePhoto,
    cover_photo: toUpdateCoverPhoto,
    socials: toUpdateSocials,
    use_party_cover_photo: Boolean(_candidate.use_party_cover_photo),
  });

  await CandidateProfilePhoto.update(
    toUpdateProfilePhoto.id,
    toUpdateProfilePhoto
  );
  await CandidateCoverPhoto.update(toUpdateCoverPhoto.id, toUpdateCoverPhoto);
  await CandidateSocials.update(toUpdateSocials.id, toUpdateSocials);
  await Candidate.update(_candidate.id, toUpdateCandidate);
  return true;
};

const remove = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Candidate id is required");
  }

  const candidate = await Candidate.findOne(_id);

  if (!candidate) {
    throw new HttpException("NOT_FOUND", "Candidate not found");
  }

  // Soft remove only so that we can restore it
  await candidate.softRemove();

  return true;
};

const restore = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Candidate id is required");
  }

  const candidate = await Candidate.findOne(_id, {
    withDeleted: true,
  });

  if (!candidate) {
    throw new HttpException("NOT_FOUND", "Candidate not found");
  }

  await candidate.recover();
  return true;
};

const archive = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Candidate id is required");
  }

  const candidate = await Candidate.findOne(_id);

  if (!candidate) {
    throw new HttpException("NOT_FOUND", "Candidate not found");
  }

  candidate.archive = true;

  await candidate.save();
  return true;
};

const unarchive = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Candidate id is required");
  }

  const candidate = await Candidate.findOne(_id);

  if (!candidate) {
    throw new HttpException("NOT_FOUND", "Candidate not found");
  }

  candidate.archive = false;

  await candidate.save();
  return true;
};

const exportCandidatesToCSV = async (_electionId: number) => {
  if (!_electionId) {
    throw new HttpException(
      "BAD_REQUEST",
      "Election id is required on exporting candidates"
    );
  }

  const [candidates, count] = await Candidate.findAndCount({
    where: {
      election_id: _electionId,
    },
    relations: [""],
  });

  const fields = [
    {
      label: "firstname",
      value: "firstname",
    },
    {
      label: "lastname",
      value: "firstname",
    },
  ];

  return candidates;
};

const importCandidatesFromCSV = async (_candidateCSV: File) => {
  const data = await parseCsvToJson(_candidateCSV, {});
  console.log("PARSE CSV", data);

  return data;
};

const candidateServices = {
  getAll,
  getById,
  create,
  update,
  remove,
  restore,
  archive,
  unarchive,
  importCandidatesFromCSV,
  exportCandidatesToCSV,
};

export default candidateServices;
