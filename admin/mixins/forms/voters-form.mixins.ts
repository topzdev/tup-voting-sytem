import Vue from "vue";
import generateId from "@/helpers/generate-id.helper";

const defaultForm = {
  firstname: "",
  lastname: "",
  username: generateId(),
  pin: generateId(),
  email_address: "",
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
    };
  },

  computed: {
    rules(): any {
      return {
        firstname: [(v: any) => !!v || "Firstname is required"],
        lastname: [(v: any) => !!v || "Lastname is required"],
        username: [(v: any) => !!v || "Voters ID is required"],
        email_address: [
          (v: any) => !!v || "Email Address is required",
          (v: any) =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            "Email Address must be valid",
        ],
        pin: [(v: any) => !!v || "Pin is required"],
      };
    },
  },
  methods: {
    forceUppercase() {
      this.form.username = this.form.username.toUpperCase();
      this.form.pin = this.form.pin.toUpperCase();
    },

    generateVoterId() {
      this.form.username = generateId();
    },

    generatePin() {
      this.form.pin = generateId();
    },

    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },
});

export default votersFormMixin;
