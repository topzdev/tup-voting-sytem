const pageRoutes = {
  homepage() {
    return {
      this: () => ({
        route: "/",
      }),
    };
  },
  election: (slug: string) => {
    const parentPath = `/election/${slug}`;

    return {
      this: () => ({
        route: parentPath,
      }),
      termsAndCondition: () => ({
        route: parentPath + "/terms-and-condition",
      }),
    };
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
    return `${pageRoutes.election(electionSlug).this().route}/party/${id}`;
  },
  candidate: (electionSlug: string, id: number) => {
    return `${pageRoutes.election(electionSlug).this().route}/candidate/${id}`;
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
  developers: () => {
    return {
      this: () => ({
        route: "/about-us",
      }),
    };
  },
  privacyPolicy: () => {
    return {
      this: () => ({
        route: "/privacy-policy",
      }),
    };
  },
};

export default pageRoutes;
