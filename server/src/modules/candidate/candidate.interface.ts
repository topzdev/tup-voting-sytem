import { CandidateSocials } from "./entity/candidate-socials.entity";
import { Candidate } from "./entity/candidate.entity";

export interface GetCandidateBody {
  search?: string;
  order?: any;
  page: number;
  take: number;
  electionId: number;
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
    "facebook_url" | "linkedin_url" | "twitter_url" | "website_url"
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
    "facebook_url" | "linkedin_url" | "twitter_url" | "website_url"
  >;
