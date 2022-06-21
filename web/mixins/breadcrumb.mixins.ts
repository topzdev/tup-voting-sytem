import Vue from "vue";
import pageRoutes from "../configs/page-routes";
import { Candidate, Election, Organization, Party } from "../types/app";

const breadcrumbMixins = Vue.extend({
  methods: {
    homepageRoute() {
      const route = "/";

      return [
        {
          text: "Home",
          to: route,
          exact: true,
        },
      ];
    },

    publicElectionLink(election: Election) {
      const route = pageRoutes.election(election.slug).this().route;
      return [
        {
          text: election.title,
          to: route,
          exact: true,
        },
      ];
    },

    electionTermsAndConditionLink(election: Election) {
      const route = pageRoutes
        .election(election.slug)
        .termsAndCondition().route;
      return [
        {
          text: "Terms and Condition",
          to: route,
          exact: true,
        },
      ];
    },

    publicCandidateLink(election: Election, candidate: Candidate) {
      const route = pageRoutes.candidate(election.slug, candidate.id);
      return [
        {
          text: candidate.firstname + " " + candidate.lastname,
          to: route,
          exact: true,
        },
      ];
    },

    publicPartyLink(election: Election, party: Party) {
      const route = pageRoutes.party(election.slug, party.id);
      return [
        {
          text: party.title,
          // to: route,
          to: route,
          exact: true,
        },
      ];
    },

    electionBreadcrumb(election: Election) {
      return [...this.homepageRoute(), ...this.publicElectionLink(election)];
    },

    electionTermsAndConditionBreadcrumb(election: Election) {
      return [
        ...this.homepageRoute(),
        ...this.publicElectionLink(election),
        ...this.electionTermsAndConditionLink(election),
      ];
    },

    candidateBreadcrumb(election: Election, candidate: Candidate) {
      return [
        ...this.homepageRoute(),
        ...this.publicElectionLink(election),
        ...this.publicCandidateLink(election, candidate),
      ];
    },

    partyBreadcrumb(election: Election, party: Party) {
      return [
        ...this.homepageRoute(),
        ...this.publicElectionLink(election),
        ...this.publicPartyLink(election, party),
      ];
    },
  },
});

export default breadcrumbMixins;
