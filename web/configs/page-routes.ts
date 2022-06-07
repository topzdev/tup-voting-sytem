const pageRoutes = {
  election: (slug: string) => {
    return `/election/${slug}`;
  },
  voting: (slug: string) => {
    const parentPath = `/vote/${slug}`;

    return {
      this: () => ({
        route: parentPath,
      }),
      ballot: () => ({
        route: parentPath + "/ballot",
      }),
      review: () => ({
        route: parentPath + "/ballot/review",
      }),
      final: () => ({
        route: parentPath + "/ballot/final",
      }),
    };
  },
  party: (electionSlug: string, id: number) => {
    return `${pageRoutes.election(electionSlug)}/party/${id}`;
  },
  candidate: (electionSlug: string, id: number) => {
    return `${pageRoutes.election(electionSlug)}/candidate/${id}`;
  },
  preRegister: (slug: string) => {
    return `/pre-register?election=${slug}`;
  },
  ballotMain: (slug: string) => {
    return `/vote/${slug}/ballot`;
  },
  ballotReview: (slug: string) => {
    return `/vote/${slug}/ballot/review`;
  },
};

export default pageRoutes;
