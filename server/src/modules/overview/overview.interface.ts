import { Timestamp } from "../../entity/timestamp.inherit";
import {
  Election,
  ElectionStatusEnum,
} from "../election/entity/election.entity";
import { ElectionWithStatusFinal } from "../launchpad/launchpad.interface";
import { Position } from "../position/entity/position.entity";

export type ElectionUrls = {
  preRegisterUrl: string;
  votingLongUrl: string;
  votingShortUrl: string;
  electionUrl?: string;
};

export type OverviewDetails = Election & {
  votersCount: number;
  votesCount: number;
  votedCount: number;
  partiesCount: number;
  candidatesCount: number;
  positionsCount: number;
  urls: ElectionUrls;
} & Timestamp;
