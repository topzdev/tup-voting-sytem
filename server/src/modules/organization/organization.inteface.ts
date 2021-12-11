import { Organization } from "./entity/organization.entity";

export interface GetOrganizationParams {
  search?: string;
  order?: any;
  page: number;
  take: number;
  withArchive?: boolean;
}

export type CreateOrganizationParams = Pick<
  Organization,
  | "slug"
  | "title"
  | "description"
  | "ticker"
  | "themePrimary"
  | "themeSecondary"
>;

export type UpdateOrganizationParams = Pick<
  Organization,
  | "id"
  | "slug"
  | "title"
  | "description"
  | "ticker"
  | "themePrimary"
  | "themeSecondary"
>;
