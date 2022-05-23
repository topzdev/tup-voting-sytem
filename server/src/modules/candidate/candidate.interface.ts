import { Party } from "../party/entity/party.entity";
import { Position } from "../position/entity/position.entity";
import { CandidateSocials } from "./entity/candidate-socials.entity";
import { Candidate } from "./entity/candidate.entity";

export interface GetCandidateBody {
  search?: string;
  order?: any;
  page: number;
  take: number;
  party: string | "all";
  position: string | "all";
  withArchive?: boolean;
}

export type CreateCandidateBody = Pick<
  Candidate,
  | "firstname"
  | "lastname"
  | "middlename"
  | "description"
  | "platform"
  | "party_id"
  | "position_id"
  | "election_id"
  | "use_party_cover_photo"
> &
  Pick<
    CandidateSocials,
    | "facebook_url"
    | "linkedin_url"
    | "twitter_url"
    | "website_url"
    | "insta_url"
  >;

export type UpdateCandidateBody = Pick<
  Candidate,
  | "id"
  | "firstname"
  | "lastname"
  | "middlename"
  | "description"
  | "platform"
  | "party_id"
  | "position_id"
  | "election_id"
  | "use_party_cover_photo"
> &
  Pick<
    CandidateSocials,
    | "facebook_url"
    | "linkedin_url"
    | "twitter_url"
    | "website_url"
    | "insta_url"
  >;

export type PositionAvailabilityDTO = {
  party_id: Party["id"];
  position_id: Position["id"];
  exceptCandidate?: Candidate["id"];
};
