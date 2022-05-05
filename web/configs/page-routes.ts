const pageRoutes = {
  election: (slug: string) => {
    return `/election/${slug}`;
  },
  voting: (slug: string) => {
    return `/vote/${slug}`;
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
};

export default pageRoutes;
