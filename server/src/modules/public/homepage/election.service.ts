import { validate } from "class-validator";
import { Brackets, getRepository, Not } from "typeorm";
import { HttpException } from "../../../helpers/errors/http.exception";
import photoUploader from "../../../helpers/photo-uploader.helper";
import { Photo } from "../../photo/photo.service";
import { Election } from "../../election/entity/election.entity";
import {
  GetElectionBody,
} from "../../election/election.interface";
import { ElectionLogo } from "../../election/entity/election-logo.entity";
import { Organization } from "../../organization/entity/organization.entity";
import parseDate from "../../../helpers/parse-date.helper";
import { finalStatusSubquery } from "../../launchpad/launchpad.helper";

const getAll = async (_orgId: string, _query: GetElectionBody) => {
  const electionRepository = getRepository(Election);
  const searchStirng = _query.search ? _query.search : "";

  if (!_orgId) {
    throw new HttpException("BAD_REQUEST", "Organization Id is required");
  }

  let builder = electionRepository.createQueryBuilder("election");

  builder = builder
    .addSelect(finalStatusSubquery(builder.alias))
    .leftJoinAndSelect("election.logo", "logo")
    .where("election.organization_id = :orgId", {
      orgId: _orgId,
    })
    .andWhere("election.is_public = :isPublic", {
      isPublic: true,
    })

  // if (searchStirng) {
  //   builder = builder.andWhere(
  //     new Brackets((sqb) => {
  //       sqb.orWhere("election.title ILIKE :title", {
  //         title: `%${searchStirng}%`,
  //       });
  //     })
  //   );
  // }

  builder = builder.orderBy({
    "election.created_at": "DESC",
  });

  if (_query.order) {
    builder = builder.addOrderBy("election.title", _query.order);
  }

  if (_query.page && _query.take) {
    const offset = _query.page * _query.take - _query.take;
    builder = builder.offset(offset).limit(_query.take);
  }

  const items = await builder.getMany();

  const totalCount = await electionRepository.count({
    where: { organization_id: _orgId },
  });

  return {
    items,
    totalCount,
    itemsCount: items.length,
  };
};

const electionServices = {
    getAll,
  };
  
  export default electionServices;