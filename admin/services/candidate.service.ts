import apiClient from ".";
import transformParamsToUrl from "@/helpers/paramsToUrl.helpers";
import { Election } from "./election.service";
import { Position } from "./position.service";
import { DataTimestamp } from "./voters.service";
import { Party } from "./party.service";

export type GetCandidateReturn = {
  items: Candidate[];
  itemsCount: number;
  totalCount: number;
};

type CandidateProfilePhoto = {
  id: number;
  public_id: number;
  url: string;
  service: string;
};
type CandidateCoverPhoto = {
  id: number;
  public_id: number;
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

export interface GetCandidateDto {
  search?: string;
  order?: any;
  page?: number;
  take?: number;
  withArchive?: boolean;
  party?: string | null;
  position: string | null;
}

export type CreateCandidateDto = Pick<
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
  > & {
    profile_photo: File;
    cover_photo: File;
  };

export type UpdateCandidateDto = Pick<
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
  > & {
    profile_photo: File;
    cover_photo: File;
  };

const url = "/api/v1/candidate";

const candidateServices = {
  async getAll(
    electionId: number,
    query: GetCandidateDto
  ): Promise<GetCandidateReturn> {
    return (
      await apiClient.get(
        `${url}/all/${electionId}/${transformParamsToUrl(query)}`
      )
    ).data;
  },
  async getById(id: string): Promise<Candidate> {
    return (await apiClient.get(`${url}/${id}`)).data;
  },

  async create(body: CreateCandidateDto): Promise<Candidate> {
    const formData = new FormData();

    console.log("Body Test", body);

    formData.append("firstname", body.firstname);
    formData.append("lastname", body.lastname);
    formData.append("middlename", body.middlename);
    formData.append("description", body.description);
    formData.append("platform", body.platform);
    formData.append("facebook_url", body.facebook_url || "");
    formData.append("linkedin_url", body.linkedin_url || "");
    formData.append("twitter_url", body.twitter_url || "");
    formData.append("insta_url", body.insta_url || "");
    formData.append("website_url", body.website_url || "");
    formData.append(
      "use_party_cover_photo",
      JSON.stringify(body.use_party_cover_photo)
    );
    formData.append("election_id", body.election_id.toString());
    formData.append("position_id", body.position_id.toString());
    formData.append("party_id", body.party_id ? body.party_id.toString() : "");
    formData.append("profile_photo", body.profile_photo);
    formData.append("cover_photo", body.cover_photo);

    return (
      await apiClient.post(`${url}`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
    ).data;
  },

  async update(body: UpdateCandidateDto): Promise<boolean> {
    const formData = new FormData();

    formData.append("id", body.id.toString());
    formData.append("firstname", body.firstname);
    formData.append("lastname", body.lastname);
    formData.append("middlename", body.middlename);
    formData.append("description", body.description);
    formData.append("platform", body.platform);
    formData.append("facebook_url", body.facebook_url || "");
    formData.append("linkedin_url", body.linkedin_url || "");
    formData.append("twitter_url", body.twitter_url || "");
    formData.append("insta_url", body.insta_url || "");
    formData.append("website_url", body.website_url || "");
    formData.append(
      "use_party_cover_photo",
      JSON.stringify(body.use_party_cover_photo)
    );
    formData.append("election_id", body.election_id.toString());
    formData.append("position_id", body.position_id.toString());
    formData.append("party_id", body.party_id ? body.party_id.toString() : "");
    formData.append("profile_photo", body.profile_photo);
    formData.append("cover_photo", body.cover_photo);

    return (
      await apiClient.put(`${url}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  },

  async archive(id: number): Promise<boolean> {
    return (await apiClient.put(`${url}/archive/${id}`)).data;
  },

  async unarchive(id: number): Promise<boolean> {
    return (await apiClient.put(`${url}/${id}`)).data;
  },

  async restore(id: number): Promise<boolean> {
    return (await apiClient.put(`${url}/restore/${id}`)).data;
  },

  async delete(id: number): Promise<boolean> {
    return (await apiClient.delete(`${url}/${id}`)).data;
  },
};

export default candidateServices;
