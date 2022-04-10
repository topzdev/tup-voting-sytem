<template>
  <page-center class="d-flex flex-start" style="height: 100vh">
    <v-row>
      <v-col cols="4" class="mx-auto d-flex align-center flex-column">
        <pre-register-header v-if="election" :election="election" />

        <v-row style="width: 100%" class="mt-5">
          <v-col
            v-if="!success && !error"
            cols="12"
            class="d-flex justify-center"
          >
            <v-btn color="red white--text" large @click="showGoogleConsent"
              ><v-icon>mdi-google</v-icon>
              <span class="ml-2">Pre-Register with Google</span>
            </v-btn>
          </v-col>
          <v-col v-if="!error && success" class="text-center" cols="12">
            <h1>You're Successfully Registered</h1>
            <p>
              After the admin verifiy your accoun proceed to election ballot. We
              will sent you your credentials thru email when election is started
            </p>
            <v-btn color="primary" to="/">Go to Homepage</v-btn>
          </v-col>
          <v-col v-else-if="error" class="text-center mt-5">
            <election-error :electionError="error" />
            <v-btn large class="mt-5" color="error" @click="reset"
              >Reload</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </page-center>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PageCenter from "@/components/utils/PageCenter.vue";
import preRegisterServices from "../../services/pre-register.services";
import PreRegisterHeader from "@/components/pages/pre-register/PreRegisterHeader.vue";
import { Election } from "../../types/app";
import ElectionError from "@/components/pages/election/ElectionError.vue";
export default Vue.extend({
  components: { PageCenter, PreRegisterHeader, ElectionError },

  data() {
    return {
      election: null as Election | null,
      success: null,
      error: null,
    };
  },

  async fetch() {
    await this.getElection();
    await this.fetchUserInfo();
  },

  methods: {
    showGoogleConsent() {
      this.$auth.loginWith("google", {
        params: {
          state: JSON.stringify({ slug: this.slug }),
        },
      });
    },

    async getElection() {
      const slug = this.slug;

      if (slug && typeof slug == "string") {
        const response = await preRegisterServices.getElectionBySlug(slug);

        console.log(slug, this.election);
        this.election = response.election;
        this.error = response.error;
      }
    },

    setElectionSlug() {
      const state = this.$route.query.state as string;

      if (state) {
        const query = this.$route.query;
        const slug = JSON.parse(state).slug;
        this.$router.push({
          query: {
            election: slug,
          },
        });
      }
    },

    async fetchUserInfo() {
      console.log(this.$route.query);
      const code = this.$route.query.code as string;

      if (code && this.election) {
        try {
          const response = await preRegisterServices.preRegister({
            code,
            election_id: this.election.id,
          });
          console.log(code);

          this.success = response;
        } catch (err: any) {
          const error = err.response.data.error.message;
          console.error(error);
          this.error = error;
          this.$router.push({
            query: {
              election: this.slug,
            },
          });
        }
      }
    },

    reset() {
      this.$nuxt.refresh();
    },
  },

  computed: {
    slug() {
      const state = this.$route.query.state as string;

      if (state) {
        const query = this.$route.query;
        const slug = JSON.parse(state).slug;
        // this.$router.push({
        //   query: {
        //     ...query,
        //     election: slug,
        //   },
        // });

        return slug;
      }

      return this.$route.query.election;
    },
  },
});
</script>

<style>
</style>