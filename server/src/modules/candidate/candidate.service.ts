import fileUpload from "express-fileupload";
import { Brackets, getRepository, IsNull, Not } from "typeorm";
import {
  File,
  parseCsvToJson,
  parseJsontoCsv,
} from "../../helpers/csv-parser.helper";
import { HttpException } from "../../helpers/errors/http.exception";
import parseDate from "../../helpers/parse-date.helper";
import photoUploader from "../../helpers/photo-uploader.helper";
import { Party } from "../party/entity/party.entity";
import { Photo } from "../photo/photo.service";
import { Position } from "../position/entity/position.entity";
import {
  CreateCandidateBody,
  GetCandidateBody,
  PositionAvailabilityDTO,
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
    .leftJoinAndSelect("party.logo", "party_logo")
    .leftJoinAndSelect("candidate.position", "position")
    .leftJoinAndSelect("candidate.profile_photo", "profile_photo")
    .leftJoinAndSelect("candidate.cover_photo", "cover_photo")
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

  if (_query.party) {
    if (_query.party === "ind") {
      builder = builder.andWhere("candidate.party_id IS NULL");
    } else if (_query.party !== "all") {
      builder = builder.andWhere("candidate.party_id = :partyId", {
        partyId: _query.party,
      });
    }
  }

  if (_query.position) {
    if (_query.position !== "all") {
      builder = builder.andWhere("candidate.position_id = :positionId", {
        positionId: _query.position,
      });
    }
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
  if (!_profilePhoto)
    throw new HttpException("BAD_REQUEST", "Profile Photo is required");

  const uploadedProfilePhoto = await photoUploader.upload(
    "candidate_photos",
    _profilePhoto.tempFilePath
  );

  const candidateProfilePhoto = CandidateProfilePhoto.create({
    public_id: uploadedProfilePhoto.public_id,
    url: uploadedProfilePhoto.secure_url,
  });

  let uploadedCoverPhoto;
  let candidateCoverPhoto;
  if (_coverPhoto) {
    uploadedCoverPhoto = await photoUploader.upload(
      "candidate_photos",
      _coverPhoto.tempFilePath
    );

    candidateCoverPhoto = CandidateCoverPhoto.create({
      public_id: uploadedCoverPhoto.public_id,
      url: uploadedCoverPhoto.secure_url,
    });

    await candidateCoverPhoto.save();
  }

  const candidateSocials = CandidateSocials.create({
    facebook_url: _candidate.facebook_url,
    linkedin_url: _candidate.linkedin_url,
    twitter_url: _candidate.twitter_url,
    website_url: _candidate.website_url,
    insta_url: _candidate.insta_url,
  });

  await candidateProfilePhoto.save();
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

  if (_candidate.party_id) {
    await checkPositionAvailability({
      party_id: _candidate.party_id,
      position_id: _candidate.position_id,
      exceptCandidate: _candidate.id,
    });
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
        url: uploadedProfilePhoto.secure_url,
      });
      await toUpdateProfilePhoto.save();
    } else {
      toUpdateProfilePhoto = CandidateProfilePhoto.merge(toUpdateProfilePhoto, {
        public_id: uploadedProfilePhoto.public_id,
        url: uploadedProfilePhoto.secure_url,
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
        url: uploadedCoverPhoto.secure_url,
      });
      await toUpdateCoverPhoto.save();
    } else {
      toUpdateCoverPhoto = CandidateCoverPhoto.merge(toUpdateCoverPhoto, {
        public_id: uploadedCoverPhoto.public_id,
        url: uploadedCoverPhoto.secure_url,
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
  if (toUpdateCoverPhoto) {
    await CandidateCoverPhoto.update(toUpdateCoverPhoto.id, toUpdateCoverPhoto);
  }
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

const checkPositionAvailability = async (dto: PositionAvailabilityDTO) => {
  const party_id = dto.party_id;
  const position_id = dto.position_id;
  const exceptCandidate = dto.exceptCandidate;

  if (!party_id || !position_id) {
  }
  const candidateBuilder =
    getRepository(Candidate).createQueryBuilder("candidate");
  const positionBuillder =
    getRepository(Position).createQueryBuilder("position");
  const partyBuilder = getRepository(Party).createQueryBuilder("party");

  const party = await partyBuilder
    .where("party.id = :party_id", { party_id })
    .getOne();

  const position = await positionBuillder
    .where("position.id = :position_id", {
      position_id,
    })
    .getOne();

  let candidatesPartial = candidateBuilder
    .addSelect(["candidate.id"])
    .where(
      "candidate.party_id = :party_id AND candidate.position_id = :position_id",
      {
        position_id,
        party_id,
      }
    );

  if (exceptCandidate) {
    candidatesPartial = candidatesPartial.andWhere(
      "candidate.id != :exceptCandidate",
      {
        exceptCandidate,
      }
    );
  }

  let candidates = await candidatesPartial.getMany();

  console.log("Position", position, "Candidates", candidates);

  if (candidates.length >= position.max_selected) {
    throw new HttpException(
      "BAD_REQUEST",
      `No available slot for ${position.title} in party "${party.title}"`
    );
  } else {
    return true;
  }
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
  checkPositionAvailability,
};

export default candidateServices;
