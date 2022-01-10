import Vue from "vue";

const defaultForm = {
  ticker: "",
  title: "",
  description: "",
  logo: "",
  cover: "",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

const partyFormMixin = Vue.extend({
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
    rules(): any {
      return {
        ticker: [(v: any) => !!v || "Ticker is required"],
        title: [(v: any) => !!v || "Title is required"],
        description: [(v: any) => !!v || "Description is required"],
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

export default partyFormMixin;
