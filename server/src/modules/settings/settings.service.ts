import { unflatten } from "flat";
import { stat } from "fs";
import { close } from "inspector";
import { Brackets, getRepository, Not } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import photoUploader from "../../helpers/photo-uploader.helper";
import { Photo } from "../photo/photo.service";
import {
  Election,
  ElectionStatusEnum,
} from "../election/entity/election.entity";
import {
    UpdateElectionBody,
  } from "./settings.interface";
import { ElectionLogo } from "../election/entity/election-logo.entity";
import { Organization } from "../organization/entity/organization.entity";
import parseDate from "../../helpers/parse-date.helper";
import {
  finalStatusSubquery,
  launchpadValidationChecker,
  validationMessages,
} from "./settings.helper";
import {
  ElectionWithStatusFinal,
  SettingsValidation,
  SettingsValidationData,
  SettingsValidations,
} from "./settings.interface";

const updateGeneral = async (_logo: Photo, _election: UpdateElectionBody, _election_id: number) => {
  const electionRepository = getRepository(Election);
  
  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
  .select([
    "election.title",
    "election.slug",
    "election.start_date",
    "election.close_date",
    "election.status",
    "election.archive",
    "election.final_status",
    "election.logo",
  ])
  .addSelect(finalStatusSubquery(builder.alias))
  .where("election.id = :_election_id", {
    _election_id,
  });

  const election = (await builder.getOne()) as SettingsValidationData;

  if (!election) throw new HttpException("BAD_REQUEST", "Election not exist");

  if (election.final_status == "archived"){
    throw new HttpException("BAD_REQUEST", "Cannot update general settings when election is archived");
  }

  let toUpdateSlug = election.slug;

  console.log("Prev:", election, "Passed:", election.slug);
  
    // Check if slug is different from previous record of slug
  if (election.slug !== _election.slug) {
    //find if slug exist on other organization
    const slugExist = await Election.findOne({
      where: {
        id: Not(_election.id),
        slug: _election.slug,
      },
    });

    // if slug exist on other organization then return an error
    if (slugExist) {
      throw new HttpException("BAD_REQUEST", "Election slug has been used");
    }

  toUpdateSlug = _election.slug;
  }
    
      // check if organization is not empty
    
  let toUpdateLogo = election.logo;
  
  if (_logo && _logo.tempFilePath) {
    //since there is a new logo provided we will destroy the exisiting image then replace before uploading a new one, so when error occcured on destory image the whole process will stop
    if (election.logo) {
      await photoUploader.destroy(election.logo.public_id);
    }

    const uploadedLogo = await photoUploader.upload(
      "org_photos",
      _logo.tempFilePath
    );

      // if the previous logo is null then save the new logo
      // else replaced the old public_id and url
    if (!election.logo) {
      toUpdateLogo = ElectionLogo.create({
        public_id: uploadedLogo.public_id,
        url: uploadedLogo.url,
      });
      await toUpdateLogo.save();
    } else {
      toUpdateLogo.public_id = uploadedLogo.public_id;
      toUpdateLogo.url = uploadedLogo.url;
    }
  }
    console.log(election.final_status);

  const toUpdateElection = Election.merge(election, {
    title: _election.title,
    description: _election.description,
    slug: toUpdateSlug,
    logo: toUpdateLogo,
  });

  await ElectionLogo.update(toUpdateLogo.id, toUpdateLogo);
  await Election.update(_election.id, toUpdateElection);


  return true;
  
};
    
const updateDate = async (_election: UpdateElectionBody, _election_id: number) => {
  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
  .select([
    "election.start_date",
    "election.close_date",
    "election.status",
    "election.final_status",
  ])
  .addSelect(finalStatusSubquery(builder.alias))
  .where("election.id = :_election_id", {
    _election_id,
  });

  const election = (await builder.getOne()) as SettingsValidationData;

  if (!election) throw new HttpException("BAD_REQUEST", "Election not exist");

  let startDate;
  let endDate;

  if (election.final_status == "building")
  {
    startDate = parseDate(_election.start_date);
    endDate = parseDate(_election.close_date);
    if(startDate > endDate){
      throw new HttpException("BAD_REQUEST", "Starting Date is greater than End Date");
    }
  }

  if (election.final_status == "running")
  {
    if(parseDate(election.start_date) != parseDate(_election.start_date)){
      throw new HttpException(
        "BAD_REQUEST",
        "You can't update starting date when election is running!"
      );
    }
    endDate = parseDate(_election.close_date);
  }
    
  if (election.final_status == "completed")
  {
    throw new HttpException(
      "BAD_REQUEST",
      "You can't update starting date when election has been completed!"
    );
  }

  if (election.final_status == 'archived')
  {
    throw new HttpException(
      "BAD_REQUEST",
      "You can't update starting date when election has been Archived!"
    );
  }

  const toUpdateElection = Election.merge(election, {
    start_date: startDate,
    close_date: endDate,
  });
  
  await Election.update(_election_id, toUpdateElection);

  return true;
};

const archive = async (_election_id: number) => {
  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
  .select([
    "election.status",
    "election.archive",
    "election.final_status",
  ])
  .addSelect(finalStatusSubquery(builder.alias))

const election = (await builder.getOne()) as SettingsValidationData;

  if (!election) {
    throw new HttpException("NOT_FOUND", "Election not found");
  }
  

  if(election.final_status == "completed"){
    election.archive = true;
    election.status = 4;
  }
  else {
    throw new HttpException("BAD_REQUEST", "You can't archived an election when it's not completed!");
  }

  const toUpdateElection = Election.merge(election, {
    status: election.status,
    archive: election.archive,
  });
  
  await Election.update(_election_id, toUpdateElection);
  return true;
};

const unArchive = async (_election_id: number) => {
  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
  .select([
    "election.status",
    "election.archive",
    "election.final_status",
  ])
  .addSelect(finalStatusSubquery(builder.alias))

const election = (await builder.getOne()) as SettingsValidationData;
  if (!_election_id) {
    throw new HttpException("BAD_REQUEST", "Election id is required");
  }

  if (!election) {
    throw new HttpException("NOT_FOUND", "Election not found");
  }
  
  if(election.final_status == "archived"){
    election.status = 3;
    election.archive = false;
  }

  const toUpdateElection = Election.merge(election, {
    status: election.status,
    archive: election.archive,
  });
  
  await Election.update(_election_id, toUpdateElection);
  return true;
};

const closeElection = async (_election_id: number) => {
  const electionRepository = getRepository(Election);

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
  .select([
    "election.status",
    "election.final_status",
  ])
  .addSelect(finalStatusSubquery(builder.alias))

  const election = (await builder.getOne()) as SettingsValidationData;

  if (!election) {
    throw new HttpException("NOT_FOUND", "Election not found");
  }

  if(election.final_status == "running"){
    election.status = 3;
  }else{
    throw new HttpException("BAD_REQUEST", "Cannot Close Election When it's not Running!");
  }


  const toUpdateElection = Election.merge(election, {
    status: election.status,
  });
  
  await Election.update(_election_id, toUpdateElection);
  return true;
};

const settingsService = {
  updateGeneral,
  updateDate,
  archive,
  unArchive,
  closeElection,
};

export default settingsService;