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

  const updateGeneral = async (_logo: Photo, _election: UpdateElectionBody) => {
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
    ])
    .addSelect(finalStatusSubquery(builder.alias))

  const election = (await builder.getOne()) as SettingsValidationData;

  if (!election) throw new HttpException("BAD_REQUEST", "Election not exist");
      
  if (!_election.id) {
    throw new HttpException("BAD_REQUEST", "Election ID is required");
  }
  
  const curElection = await Election.findOne(_election.id, {
    relations: ["logo"],
  });

  if (!curElection) {
    throw new HttpException("NOT_FOUND", "Election not found");
  }

  let toUpdateSlug = curElection.slug;

  console.log("Prev:", curElection, "Passed:", _election);
  
    // Check if slug is different from previous record of slug
  if (curElection.slug !== _election.slug) {
    //find if slug exist on other organization
    const slugExist = await Election.findOne({
      where: {
        id: Not(curElection.id),
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
  if (!_election.organization_id) {
    throw new HttpException("BAD_REQUEST", "Organization is required");
  }
  
    let toUpdateLogo = curElection.logo;
  
  if (_logo && _logo.tempFilePath) {
    //since there is a new logo provided we will destroy the exisiting image then replace before uploading a new one, so when error occcured on destory image the whole process will stop
    if (curElection.logo) {
      await photoUploader.destroy(curElection.logo.public_id);
    }

    const uploadedLogo = await photoUploader.upload(
      "org_photos",
      _logo.tempFilePath
    );

    // if the previous logo is null then save the new logo
    // else replaced the old public_id and url
  if (!curElection.logo) {
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

  const toUpdateElection = Election.merge(curElection, {
    title: _election.title,
    description: _election.description,
    slug: toUpdateSlug,
    logo: toUpdateLogo,
  });
  
  await ElectionLogo.update(toUpdateLogo.id, toUpdateLogo);
  await Election.update(_election.id, toUpdateElection);


  return true;
  
  };
  
  const updateDate = async (_id: string, _election: UpdateElectionBody) => {
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
    ])
    .addSelect(finalStatusSubquery(builder.alias))

  const election = (await builder.getOne()) as SettingsValidationData;

    if (!_election.id) {
      throw new HttpException("BAD_REQUEST", "Election ID is required");
    }
    
    const curElection = await Election.findOne(_election.id, {
      relations: ["logo"],
    });
  
    if (!curElection) {
      throw new HttpException("NOT_FOUND", "Election not found");
    }

    let startDate;
    let endDate;
      
    if (election.final_status == "building")
    {
      startDate = parseDate(_election.start_date);
      endDate = parseDate(_election.close_date);
      if(startDate>endDate){
        throw new HttpException("BAD_REQUEST", "Starting Date is greater than End Date");
      }
    }
  
    if (election.final_status == "running")
    {
      if(curElection.start_date != _election.start_date){
        throw new HttpException(
          "BAD_REQUEST",
          "You can't update starting date when election is running!"
        );
      }
      endDate = parseDate(_election.close_date);
    }
  
    if (election.final_status == "completed")
    {
      if(curElection.start_date != _election.start_date){
        throw new HttpException(
          "BAD_REQUEST",
          "You can't update starting date when election has been completed!"
        );
      }
      if(curElection.close_date != _election.close_date){
        throw new HttpException(
          "BAD_REQUEST",
          "You can't update starting date when election has been completed!"
        );
      }
    }

    const toUpdateElection = Election.merge(curElection, {
      start_date: parseDate(startDate),
      close_date: parseDate(endDate),
    });
    
    await Election.update(_election.id, toUpdateElection);

    return true;
  }

  const archive = async (_id: string) => {
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
    ])
    .addSelect(finalStatusSubquery(builder.alias))

  const election = (await builder.getOne()) as SettingsValidationData;
    if (!_id) {
      throw new HttpException("BAD_REQUEST", "Election id is required");
    }
  
    const curElection = await Election.findOne(_id);
  
    if (!curElection) {
      throw new HttpException("NOT_FOUND", "Election not found");
    }
    
    if(election.final_status == "building"){
      curElection.archive = true;
    }

    if(election.final_status == "running"){
      throw new HttpException("BAD_REQUEST", "Cannot Archive Election when it's Running");
    }

    if(election.final_status == "completed"){
      curElection.archive = true;
    }

    await curElection.save();
    return true;
  };

  const closeElection = async (_id: string) => {
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
    ])
    .addSelect(finalStatusSubquery(builder.alias))

  const election = (await builder.getOne()) as SettingsValidationData;
    if (!_id) {
      throw new HttpException("BAD_REQUEST", "Election id is required");
    }
  
    const curElection = await Election.findOne(_id);
  
    if (!curElection) {
      throw new HttpException("NOT_FOUND", "Election not found");
    }
    
    if(election.final_status == "running"){
      curElection.status = 3;
    }else{
      throw new HttpException("BAD_REQUEST", "Cannot Close Election When it's not Running!");
    }


    await curElection.save();
    return true;
  };

  const settingsService = {
    updateGeneral,
    updateDate,
    archive,
    closeElection,
  };
  export default settingsService;