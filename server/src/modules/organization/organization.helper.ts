import { customAlphabet } from "nanoid";

const generateOrganizationSlug = () => {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 10);
  return nanoid();
};

const organizationHelper = {
  generateOrganizationSlug,
};

export default organizationHelper;
