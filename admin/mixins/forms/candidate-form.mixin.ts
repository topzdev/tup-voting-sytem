import Vue from "vue";

export const INDEPENDENT = {
  id: null,
  title: "Independent",
  logo: null,
};

const defaultForm = {
  firstname: "",
  lastname: "",
  middlename: "",
  platform: "",
  description: "",
  position_id: "",
  party_id: "",
  election_id: "",
  use_party_cover_photo: false,
  facebook_url: "",
  linkedin_url: "",
  twitter_url: "",
  website_url: "",
  insta_url: "",
  profile_photo: null,
  cover_photo: null,
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

const votersFormMixin = Vue.extend({
  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
      form: Object.assign({}, defaultForm),
      isEdited: false,
    };
  },

  computed: {
    prependParty() {
      return [INDEPENDENT];
    },

    rules() {
      return {
        firstname: [(v: any) => !!v || "First Name is required"],
        lastname: [(v: any) => !!v || "Last Name is required"],
        platform: [(v: any) => !!v || "Platform is required"],
        description: [(v: any) => !!v || "Description is required"],
        position_id: [(v: any) => !!v || "Position is required"],
      };
    },
  },

  methods: {
    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },
});

export default votersFormMixin;
