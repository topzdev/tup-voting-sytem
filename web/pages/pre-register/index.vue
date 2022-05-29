<template>
  <v-row class="my-0" style="height: 100%">
    <v-col class="py-0" cols="12" lg="8">
      <v-img
        class="d-flex align-end px-5"
        height="100%"
        width="100%"
        alt="Technological University of the Philippines Art by strryblstar"
        :src="background"
      >
        <p class="text-primary white--text">
          <a
            class="white--text text-decoration-none"
            href="https://www.deviantart.com/strryblstar/art/Technological-University-of-the-Philippines-TUP-573058166"
            >"Technological University of the Philippines"</a
          >
          Art by
          <a
            class="text-decoration-underline white--text font-weight-bold"
            href="https://www.deviantart.com/strryblstar"
            >strryblstar</a
          >
        </p>
      </v-img>
    </v-col>
    <v-col cols="12" lg="4">
      <v-card
        flat
        style="height: 100%"
        class="d-flex flex-column justify-center align-center"
      >
        <v-card-text class="text--primary text-center">
          <pre-register-header v-if="election" :election="election" />

          <template
            v-if="!success && !error"
            cols="12"
            class="d-flex justify-center"
          >
            <v-btn
              class="mt-5"
              color="red white--text"
              large
              @click="showGoogleConsent"
              ><v-icon>mdi-google</v-icon>
              <span>Pre-Register with Google</span>
            </v-btn>
          </template>
          <template v-if="!error && success" class="text-center" cols="12">
            <h2 class="mt-5">You're Successfully Registered</h2>
            <p>
              After the admin verifiy your accoun proceed to election ballot. We
              will sent you your credentials thru email when election is started
            </p>
            <v-btn color="primary" to="/">Go to Homepage</v-btn>
          </template>
          <template v-else-if="error" class="text-center mt-5">
            <election-error class="mt-5" :electionError="error" />
            <v-btn large class="mt-5" color="error" @click="reset"
              >Reload</v-btn
            >
          </template>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import PageCenter from "@/components/utils/PageCenter.vue";
import preRegisterServices from "../../services/pre-register.services";
import PreRegisterHeader from "@/components/pages/pre-register/PreRegisterHeader.vue";
import { Election } from "../../types/app";
import ElectionError from "~/components/pages/voting/ElectionError.vue";
export default Vue.extend({
  components: { PageCenter, PreRegisterHeader, ElectionError },

  data() {
    return {
      background: require("~/static/pre-register-background.gif"),
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