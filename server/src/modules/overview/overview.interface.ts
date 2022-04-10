import { Timestamp } from "../../entity/timestamp.inherit";
import {
  Election,
  ElectionStatusEnum,
} from "../election/entity/election.entity";
import { ElectionWithStatusFinal } from "../launchpad/launchpad.interface";
import { Position } from "../position/entity/position.entity";

export type OverviewUrls = {
  preRegisterUrl: string;
  longUrl: string;
  shortUrl: string;
};

export type OverviewDetails = Election & {
  votersCount: number;
  votesCount: number;
  votedCount: number;
  partiesCount: number;
  candidatesCount: number;
  positionsCount: number;
  urls: OverviewUrls;
} & Timestamp;
