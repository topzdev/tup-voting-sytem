import apiClient from ".";
import transformParamsToUrl from "@/helpers/paramsToUrl.helpers";
import { DataTimestamp } from "./voters.service";

type OrganizationLogo = {
  id: number;
  public_id: string;
  url: string;
  service: string;
};

type OrganizationTheme = {
  id: string;
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
  description: string;
  archive: boolean;
  themePrimary: string;
  themeSecondary: string;
  terms_and_condition: string;
  theme: OrganizationTheme;
  logo: OrganizationLogo;
} & DataTimestamp;

export interface GetOrganizationDto {
  search?: string;
  order?: any;
  page?: number;
  take?: number;
  withArchive?: boolean;
}

export type CreateOrganizationDto = {
  slug: string;
  title: string;
  description: string;
  ticker: string;
  themePrimary: string;
  themeSecondary: string;
  logo: File;
};

export type UpdateOrganizationDto = {
  slug: string;
  title: string;
  description: string;
  ticker: string;
  themePrimary: string;
  themeSecondary: string;
  id: number;
  logo: File;
};

export type UpdateTermsAndCondition = Pick<
  Organization,
  "id" | "terms_and_condition"
>;

const url = "/api/v1/org";

const organizationServices = {
  async getAll(query: GetOrganizationDto) {
    return (await apiClient.get(`${url}/${transformParamsToUrl(query)}`)).data;
  },
  async getById(id: Organization["id"]) {
    return (await apiClient.get(`${url}/${id}`)).data;
  },

  async getBySlug(slug: string) {
    return (await apiClient.get(`${url}/slug/${slug}`)).data;
  },

  async isExistBySlug(slug: string) {
    return (await apiClient.get(`${url}/exist/${slug}`)).data;
  },

  async create(body: CreateOrganizationDto) {
    const formData = new FormData();

    formData.append("slug", body.slug);
    formData.append("title", body.title);
    formData.append("description", body.description);
    formData.append("ticker", body.ticker);
    formData.append("theme_primary", body.themePrimary);
    formData.append("theme_secondary", body.themeSecondary);
    formData.append("logo", body.logo);

    return (
      await apiClient.post(`${url}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  },

  async update(body: UpdateOrganizationDto) {
    const formData = new FormData();

    formData.append("id", body.id.toString());
    formData.append("slug", body.slug);
    formData.append("title", body.title);
    formData.append("description", body.description);
    formData.append("ticker", body.ticker);
    formData.append("theme_primary", body.themePrimary);
    formData.append("theme_secondary", body.themeSecondary);
    formData.append("logo", body.logo);

    return (
      await apiClient.put(`${url}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  },

  async archive(id: Organization["id"]) {
    return (await apiClient.put(`${url}/archive/${id}`)).data;
  },

  async unarchive(id: Organization["id"]) {
    return (await apiClient.put(`${url}/${id}`)).data;
  },

  async restore(id: Organization["id"]) {
    return (await apiClient.put(`${url}/restore/${id}`)).data;
  },

  async delete(id: Organization["id"]) {
    return (await apiClient.delete(`${url}/${id}`)).data;
  },

  async updateTermsAndCondition(dto: UpdateTermsAndCondition) {
    return (await apiClient.put(`${url}/terms-and-condition`, dto)).data;
  },
};

export default organizationServices;
