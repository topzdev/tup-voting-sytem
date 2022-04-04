import { CandidateSocials } from "../../candidate/entity/candidate-socials.entity";
import { Candidate } from "../../candidate/entity/candidate.entity";

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
