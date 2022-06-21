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
          <template v-if="!$fetchState.pending">
            <pre-register-header v-if="election" :election="election" />
            <template v-if="!loading">
              <template
                v-if="!success && !error"
                cols="12"
                class="d-flex justify-center"
              >
                <v-row>
                  <v-col cols="12">
                    <v-btn
                      :disabled="!isInit"
                      class="mt-5"
                      color="red white--text"
                      large
                      @click="showGoogleConsent"
                      ><v-icon>mdi-google</v-icon>
                      <span>Pre-Register with Google</span>
                    </v-btn>
                  </v-col>
                  <v-col cols="8" class="text-center mx-auto">
                    <election-legal-text
                      class="body-2 text--secondary"
                      :election="election"
                    />
                  </v-col>
                </v-row>
              </template>
              <template v-if="!error && success" class="text-center" cols="12">
                <h2
                  class="display-1 font-weight-bold text--primary mx-auto mt-5"
                >
                  You're Successfully Pre-Registered
                </h2>
                <p class="subtitle-1 text--secondary mt-2">
                  After the admin verify your account, please proceed to
                  election ballot. We will send you your credentials thru email
                  when election is started
                </p>
                <v-btn color="primary" to="/">Go to Homepage</v-btn>
              </template>
              <template v-else-if="error" class="text-center mt-5">
                <election-error class="mt-5" :electionError="error" />
                <v-btn large class="mt-5" color="error" @click="reset"
                  >Reload</v-btn
                >
              </template>
            </template>
            <template v-else>
              <h3 class="mt-5">One Moment...</h3>
              <app-loading />
            </template>
          </template>

          <template v-else>
            <app-loading />
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
import ElectionLegalText from "@/components/pages/election/ElectionLegalText.vue";
export default Vue.extend({
  components: {
    PageCenter,
    PreRegisterHeader,
    ElectionError,
    ElectionLegalText,
  },

  data() {
    return {
      background: require("~/static/pre-register-background.gif"),
      election: null as Election | null,
      success: null,
      error: null,
      loading: false,
      isInit: false,
      isSignIn: false,
    };
  },

  async fetch() {
    await this.getElection();
    // await this.fetchUserInfo();
  },

  methods: {
    async showGoogleConsent() {
      if (this.election) {
        try {
          const googleUser = await this.$gAuth.signIn();

          console.log(googleUser);
          this.loading = true;
          if (!googleUser) {
            return null;
          }

          const rawUser = googleUser.getBasicProfile();

          const user = {
            id: rawUser.getId(),
            given_name: rawUser.getGivenName(),
            family_name: rawUser.getFamilyName(),
            email: rawUser.getEmail(),
          };

          console.log(user);

          const response = await preRegisterServices.preRegister({
            user,
            election_id: this.election.id,
          });

          this.success = response;
        } catch (err: any) {
          console.error(err);
          if (err.response) {
            const error = err.response.data.error.message;
            console.error(error);
            this.error = error;
          }
        } finally {
          this.loading = false;
        }
      }
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

    reset() {
      this.$nuxt.refresh();
    },
  },

  computed: {
    slug() {
      return this.$route.query.election;
    },
  },
  created() {
    let that = this;
    let checkGauthLoad = setInterval(function () {
      if (that.$gAuth) {
        that.isInit = that.$gAuth.isInit;
        that.isSignIn = that.$gAuth.isAuthorized;
        if (that.isInit) clearInterval(checkGauthLoad);
      }
    }, 1000);
  },
});
</script>

<style>
</style>