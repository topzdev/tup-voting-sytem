import { User } from "../user/entity/user.entity";

export interface AdminLoginCredentials {
  token: string;
  usernameOrEmail: string;
  password: string;
}

export interface SystemLoginCredentials {
  usernameOrEmail: string;
  password: string;
  allowedRole?: "sadmin" | "admin";
}

export interface VoterLoginCredentials {
  election_id: string;
  voter_id: string;
  pin: string;
  token: string;
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

export type DisabledError = {
  disabled: boolean;
};

export type VerfiyAdminLoginOTP = {
  user_id: User["id"];
  otp: string;
};
