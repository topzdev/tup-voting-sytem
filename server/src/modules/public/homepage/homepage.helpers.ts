export const publicElectionWhereQuery = (alias: string) => {
  return `${alias}.is_public = TRUE AND ${alias}.status >= '2' AND ${alias}.archive = FALSE`;
};

const homepageHelpers = {
  publicElectionWhereQuery,
};

export default homepageHelpers;
