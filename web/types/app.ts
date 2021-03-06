export type GetPositionReturn = {
  items: Position[];
  itemsCount: number;
  totalCount: number;
};

export type DataTimestamp = {
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
};

export type Position = {
  election_id: number;
  id: number;
  title: string;
  description: string;
  max_selected: number;
  min_selected: number;
  election: Election;
  candidates?: Candidate[];
  display_order: number | null;
  tie_resolved_message?: boolean;
  is_tie_resolved?: boolean;
} & DataTimestamp;

type PartyLogo = {
  id: number;
  public_id: string;
  url: string;
  service: string;
};

type PartyCoverPhoto = {
  id: number;
  public_id: string;
  url: string;
  service: string;
};

export type Party = {
  id: number;
  description: string;
  ticker: string;
  title: string;
  election_id: number;
  election?: Election;
  logo: PartyLogo | null;
  cover_photo: PartyCoverPhoto;
  archive: boolean;
} & DataTimestamp;

type OrganizationLogo = {
  id: number;
  public_id: string;
  url: string;
  service: string;
};

type OrganizationTheme = {
  id: number;
  primary: string;
  secondary: string;
};

export type Organization = {
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  id: number;
  slug: string;
  ticker: string;
  title: string;
  description?: string;
  archive: boolean;
  themePrimary: string;
  themeSecondary: string;
  terms_and_condition: string;
  terms_and_condition_last_update: string;
  theme: OrganizationTheme;
  logo: OrganizationLogo;
} & DataTimestamp;

export type ElectionStatus =
  | "building"
  | "preview"
  | "running"
  | "completed"
  | "archived";

type ElectionLogo = {
  id: number;
  public_id: string;
  url: string;
  service: string;
};

export type GetElectionReturn = {
  items: Election[];
  itemsCount: number;
  totalCount: number;
};

export type Election = {
  id: number;
  slug: string;
  title: string;
  description: string;
  start_date: string;
  close_date: string;
  organization_id: number;
  organization?: Organization;
  logo: ElectionLogo;
  final_status: ElectionStatus;
  allow_pre_register: boolean;
  is_public: boolean;
  is_tally_public: boolean;
  archive: boolean;
} & DataTimestamp;

type CandidateProfilePhoto = {
  id: number;
  public_id: string;
  url: string;
  service: string;
};
type CandidateCoverPhoto = {
  id: number;
  public_id: string;
  url: string;
  service: string;
};

export type CandidateSocials = {
  id: number;
  facebook_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
  insta_url: string | null;
};

export type Candidate = {
  id: number;
  firstname: string;
  lastname: string;
  middlename: string;
  description: string;
  platform: string;
  facebook_url: string;
  linked_url: string;
  twitter_url: string;
  website_url: string;
  use_party_cover_photo: boolean;
  archive: boolean;
  election_id: number;
  election?: Election;
  position_id: number;
  position?: Position;
  party_id: number;
  party?: Party | null;
  cover_photo: CandidateCoverPhoto;
  profile_photo: CandidateProfilePhoto;
  socials?: CandidateSocials;
} & DataTimestamp;

export type ElectionBallot = {
  id: number;
  ip: string;
  ua: string;
  receipt_id: string;
  voter_id: string;
  election_id: number;
};

export type BallotVote = {
  position_id: Position["id"];
  candidate_id: Candidate["id"];
};

export type BallotVotes = {
  election_id: Election["id"];
  votes: BallotVote[];
};

export type BallotOtherInfo = {
  ip: string | any;
  ua: string;
};

export type BallotItem = Position & {
  candidates: Candidate[];
};

export type BallotError = {
  title: Position["title"];
  position_id: Position["id"];
  messages: string[];
  totalVotes?: number;
  min_selected?: number;
  max_selected?: number;
};

export type Voter = {
  id: number;
  firstname: string;
  lastname: string;
  usernamne: string;
  email_address: string;
  pin: string;
  disabled: boolean;
  election_id: number;
  election: Election;
  voted: ElectionVoted;
  archive: boolean;
} & DataTimestamp;

export type ElectionVoted = {
  id: number;
  ip: string;
  ua: string;
  receipt_id: string;
  voted_id: number;
  voter: Voter;
  election_id: number;
  election: Election;
} & DataTimestamp;

export type BallotReceipt = Pick<
  ElectionVoted,
  "created_at" | "id" | "receipt_id" | "ip" | "ua"
> & {
  election_title: Election["title"];
};

export type SocialLink = {
  href: string | null;
  icon: string;
  title: string;
};

declare module "vue/types/vue" {
  interface Vue {
    $gAuth: any;
  }
}
