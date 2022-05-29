import { customAlphabet } from "nanoid";
import { getRepository } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import { PickedUser } from "../../type/express-serve-static-core";
import { Organization } from "../organization/entity/organization.entity";

const generateElectionSlug = () => {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 10);
  return nanoid();
};

const isEmptyStringReturnNull = (str: string) => {
  return str === "" ? null : str;
};

const electionOfficerGuard = async (
  user: PickedUser,
  organization_id: number
) => {
  const organizationRepository = getRepository(Organization);
  let organization = await organizationRepository
    .createQueryBuilder("org")
    .leftJoinAndSelect("org.election_officers", "election_officers")
    .leftJoinAndSelect("election_officers.user", "election_officers_user")
    .where("org.id = :organization_id", {
      organization_id,
    })
    .getOne();

  if (!organization) {
    throw new HttpException("NOT_FOUND", "Organization not found");
  }

  const election_officer = user.election_officer;
  console.log(organization, election_officer);

  if (election_officer) {
    const officers = organization.election_officers;

    if (
      !officers.filter((item) => item.user && item.user.id === user.id).length
    ) {
      throw new HttpException(
        "BAD_REQUEST",
        "You are not election officer assigned in this route"
      );
    }
  }
};

const electionHelper = {
  generateElectionSlug,
  isEmptyStringReturnNull,
  electionOfficerGuard,
};

export default electionHelper;
