<template>
  <table class="result-report">
    <!-- Result report header -->

    <template v-if="authenticated">
      <template v-if="pageLoading">
        <tr>
          <td align="center">
            <app-loading />
          </td>
        </tr>
      </template>

      <template v-else-if="!pageLoading && election">
        <tr>
          <td>
            <table class="table result-report__header">
              <tr>
                <td class="text-center">
                  <img
                    class="result-report__header-logo"
                    height="100"
                    width="100"
                    src="~/static/tup-logo.png"
                    alt="TUP Vote"
                  />
                </td>

                <td class="text-center" style="width: 85%">
                  <h3>TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES</h3>
                  <p class="mb-0">
                    Ayala Blvd., Ermita, Manila, 1000, Philippines
                  </p>
                  <p class="mb-0">
                    Tel No. +632-301-3001 local 204 | Fax No. +632-521-4063
                  </p>
                  <p class="mb-0">Website: www.tup.edu.ph | www.tupvote.com</p>
                </td>
              </tr>
              <tr>
                <td class="text-center">
                  <b> TOWVS </b>
                </td>
                <td class="text-center px-2 py-2">
                  <b> {{ election.title }} Result Report </b>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Result report header -->

        <!-- Result report body-->
        <tr>
          <table class="result-report__body w-100">
            <tr>
              <td class="py-6 text-center"><h2>Election Information</h2></td>
            </tr>
            <tr>
              <td class="result-report__information">
                <table class="table w-100">
                  <tr v-for="(item, idx) in electionInfoTable" :key="idx">
                    <td class="td--name">
                      <b v-html="item.name"></b>
                    </td>
                    <td class="td--value">
                      <span v-html="item.value"></span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="py-6 text-center">
                <h2 class="mt-5">Election Result</h2>
              </td>
            </tr>
            <tr>
              <td>
                <table
                  v-for="position in tally"
                  :key="position.id"
                  class="table result-report__result w-100 mb-8"
                >
                  <tr>
                    <td colspan="5" class="text-center">
                      <h3>{{ position.title }}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td align="end" class="px-2 py-1" colspan="2">
                      <b> Total Votes </b>
                    </td>
                    <td colspan="3" class="px-2 py-1">
                      {{ position.totalVotes }}
                    </td>
                  </tr>
                  <tr>
                    <th class="th--no">No</th>
                    <th class="th--name">Candidate Name</th>
                    <th class="th--remarks">Remarks</th>
                    <th class="th--count">Vote Count</th>
                    <th class="th--percent">Vote Percent</th>
                  </tr>

                  <tr
                    v-for="(candidate, idx) in position.candidates"
                    :key="candidate.id"
                    :class="candidate.winner ? 'amber black--text' : ''"
                  >
                    <td class="td--no">{{ idx + 1 }}</td>
                    <td class="td--name">
                      {{ candidate.candidateName }}
                      <b
                        >({{
                          candidate.party ? candidate.party.title : "IND"
                        }})</b
                      >
                    </td>
                    <td class="td--remarks">
                      <b>{{ candidate.winner ? "Winner" : "Loser" }}</b>
                    </td>
                    <td class="td--count">
                      <b>{{ candidate.votesCount }}</b>
                    </td>
                    <td class="td--percent">
                      <b>{{ candidate.votePercentage }}%</b>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="result-report__officers">
                <table>
                  <tr>
                    <td><b>List Election Officer:</b></td>
                  </tr>

                  <template v-if="election.election_officers.length">
                    <tr
                      v-for="officers in election.election_officers"
                      :key="officers.id"
                    >
                      <td>
                        {{ officers.user.firstname }},
                        {{ officers.user.lastname }} ({{
                          officers.user.email_address
                        }})
                      </td>
                    </tr>
                  </template>

                  <template v-else>
                    <tr>
                      <td><i>No Election Officer Assigned</i></td>
                    </tr>
                  </template>
                </table>
              </td>
            </tr>

            <tr>
              <td class="text-center">
                <p class="mt-10 pt-10">
                  <b>
                    I hereby certify that the above information are true and
                    correct.</b
                  >
                </p>
              </td>
            </tr>

            <tr>
              <td class="result-report__signatures">
                <table>
                  <tr>
                    <td>
                      <hr />
                      <p>Election Officers</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <hr />
                      <p>Immediate Supervisor</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <hr />
                      <p>Approved By</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </tr>
      </template>

      <template v-else> Something Went Wrong </template>
    </template>

    <template v-else>
      <tr>
        <td align="center">
          You need to authenticate to preview this page <br />
          <v-btn color="primary" class="mt-2" @click="getElectionReport"
            >Authenticate</v-btn
          >
        </td>
      </tr>
    </template>
  </table>
</template>

<script lang="ts">
import dayjs from "dayjs";
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import pageRoles from "../../configs/page-roles";
import authMixin from "../../mixins/auth.mixins";
import restrictionsMixin from "../../mixins/restrictions.mixin";
import { Election } from "../../services/election.service";
import { MetaInfo } from "vue-meta";

import resultsServices, {
  PrintElectionResult,
} from "../../services/results.service";

export default mixins(authMixin).extend({
  layout: "print",
  data() {
    return {
      pageLoading: false,
      authenticated: false,
      election: null as PrintElectionResult["election"] | null,
      tally: [] as PrintElectionResult["tally"],
    };
  },

  head(): MetaInfo {
    if (!this.election) return {};

    return {
      title: this.election.title,
      titleTemplate: "%s Result Report",
      meta: [
        {
          name: "description",
          hid: "description",
          content: this.election.description,
        },
      ],
    };
  },

  computed: {
    electionInfoTable(): any[] {
      if (!this.election) return [];

      return [
        {
          name: "Election Title",
          value: `${this.election.title}`,
        },
        {
          name: "Organization",
          value: `${this.election.organization.title} (${this.election.organization.ticker})`,
        },
        {
          name: "Date this report is generated",
          value: this.formatDate(new Date().toString()),
        },
        {
          name: "No. of Registered Voters",
          value: this.election.votersCount,
        },
        {
          name: "No. of Voters Participates",
          value: this.election.votedCount,
        },
        {
          name: "No of Registered Candidates",
          value: this.election.candidatesCount,
        },
        {
          name: "No of Registered Party",
          value: this.election.partiesCount,
        },
        {
          name: "Start Date",
          value: this.formatDate(this.election.start_date),
        },
        {
          name: "End Date",
          value: this.formatDate(this.election.close_date),
        },

        {
          name: "Voting Link",
          value: this.generateLink(this.election.urls.votingLongUrl),
        },
        {
          name: "Preview Link",
          value: this.election.is_public
            ? this.generateLink(this.election.urls.electionUrl || "")
            : "<i>Election is private</i>",
        },
        {
          name: "Pre-Registration Link",
          value: this.election.allow_pre_register
            ? this.generateLink(this.election.urls.preRegisterUrl)
            : "<i>Pre-Registration Disabled</i>",
        },
      ];
    },
  },

  async created() {
    await this.getElectionReport();
  },

  methods: {
    generateLink(link: string, name?: string) {
      return `<a href="${link}" target="_blank">${link ? link : name}</a>`;
    },
    formatDate(date: string) {
      return dayjs(date).format("MMMM DD, YYYY hh:mm a");
    },
    async getElectionReport() {
      this.$accessor.system.showAppDialog({
        show: true,
        title: "Print Election Report",
        message:
          "Please do not alter the report once the report downloaded. <a target='_blank' rel='nofollow noindex' href='https://comelec.gov.ph/index.html?r=References/RelatedLaws/ElectionLaws/SynchronizedNationalandLocal/RA7166#sec30'>RA7166 Section 30</a>",
        button: {
          anyEventHide: false,
          yesFunction: async ({ hideDialog }) => {
            hideDialog();

            this.systemAuthentication(
              {
                button: {
                  yesFunction: async () => {
                    this.authenticated = true;
                    this.pageLoading = true;
                    try {
                      const election_id = this.$route.query[
                        "election_id"
                      ] as any;

                      if (election_id) {
                        const result = await resultsServices.printResult(
                          election_id
                        );

                        this.election = result.election;
                        this.tally = result.tally;
                      }
                    } catch (error) {
                    } finally {
                      this.pageLoading = false;
                    }
                  },
                },
              },
              "current-only-password",
              pageRoles.dialogs.downloadResults
            );
          },
          noFunction: ({ hideDialog }) => {
            hideDialog();
          },
        },
      });
    },
  },
});
</script>

<style lang="scss">
@mixin result-report {
  .result-report {
    width: 100%;

    &__header {
      width: 100%;
    }

    &__header-logo {
      margin: 10px 10px;
    }

    &__body {
      border-collapse: collapse;
    }

    &__information {
      td {
        padding: 5px;
        width: 50%;
      }

      .td {
        &--name {
          width: 25%;
          text-align: right;
        }

        &--value {
        }
      }
    }

    // .amber {
    //   background-color: #ffc107 !important;
    //   border-color: #ffc107 !important;
    // }
    // .black--text {
    //   color: #000000 !important;
    //   caret-color: #000000 !important;
    // }

    &__result {
      .th,
      .td {
        &--no {
          text-align: center;
        }
        &--name {
          text-align: center;
          width: 400px;
        }

        &--remarks {
          text-align: center;
        }

        &--count {
          text-align: center;
        }

        &--percent {
          text-align: center;
        }
      }
    }

    &__officers {
      padding-top: 30px;
    }

    &__signatures {
      padding: 60px 0;
      table {
        width: 300px;
        margin-left: auto;
      }
      td {
        text-align: center;
        padding: 10px 0;
      }
    }
  }
}

@include result-report();
</style>