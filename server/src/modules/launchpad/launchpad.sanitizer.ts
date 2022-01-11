import { body, buildSanitizeFunction } from "express-validator";
import { ifEmptyStringReturnNull } from "./launchpad.helper";

const sanitizers = {
  party_id: body("party_id").customSanitizer(ifEmptyStringReturnNull),
  election_id: body("election_id").toInt(),
  position_id: body("position_id").toInt(),
};

const { party_id } = sanitizers;

const create = [party_id];
const update = [party_id];

const launchpadSanitizer = {
  create,
  update,
};
export default launchpadSanitizer;
