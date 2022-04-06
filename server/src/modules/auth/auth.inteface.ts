export interface AdminLoginCredentials {
  username: string;
  password: string;
}

export interface VoterLoginCredentials {
  election_id: string;
  voter_id: string;
  pin: string;
}

export interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
