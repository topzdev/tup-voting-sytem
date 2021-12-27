import { Position } from "./entity/position.entity";

export interface GetPositionBody {
  search?: string;
  order?: any;
  page: number;
  take: number;
  electionId: number;
}

export type CreatePositionBody = Pick<
  Position,
  "election_id" | "title" | "description" | "max_selected" | "min_selected"
>;

export type UpdatePositionBody = Pick<
  Position,
  | "id"
  | "election_id"
  | "title"
  | "description"
  | "max_selected"
  | "min_selected"
>;

export type UpdatePositionDisplayOrder = {
  election_id: number;
  displayOrder: {
    id: number;
    order: number;
  }[];
};
