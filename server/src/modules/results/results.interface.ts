import { Candidate } from "../candidate/entity/candidate.entity";
import { Position } from "../position/entity/position.entity";

type Candidates = Candidate & {
  votesCount: number;
};

type ElectionResult = Omit<Position, "candidates"> & {
  candidates: Candidates[];
};

export type ElectionResults = ElectionResult[];
