import { buildSanitizeFunction } from "express-validator";
import { ifEmptyStringReturnNull } from "./candidate.helper";
const sanitizeBodyAndQuery = buildSanitizeFunction(["body", "query"]);

const sanitizers = {
  party_id: sanitizeBodyAndQuery("party_id").customSanitizer(
    ifEmptyStringReturnNull
  ),
  election_id: sanitizeBodyAndQuery("election_id").toInt(),
  position_id: sanitizeBodyAndQuery("position_id").toInt(),
};

const { party_id } = sanitizers;

const create = [party_id];
const update = [party_id];

const candidateSanitizer = {
  create,
  update,
};
export default candidateSanitizer;
