export type PreRegisterVoterInfo = {
  code: string;
  election_id: number;
};

export type GoogleUserInfo = {
  id: string;
  email: string;
  verified_email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  local: string;
  hd: string;
};
