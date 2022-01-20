export interface AdminLoginCredentials {
  username: string;
  password: string;
}

export interface VoterLoginCredentials {
  election_id: string;
  voter_id: string;
  pin: string;
}
