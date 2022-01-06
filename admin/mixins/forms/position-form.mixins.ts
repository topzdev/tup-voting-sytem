import Vue from "vue";

const defaultForm = {
  title: "",
  description: "",
  max_selected: 1,
  min_selected: 1,
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

const positionFormMixin = Vue.extend({
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
        title: [(v: any) => !!v || "Title is required"],
        description: [(v: any) => !!v || "Description is required"],
        max_selected: [
          (v: number) => !!v || "this is required",
          (v: number) => v >= 1 || "Positive value only",
          (v: number) => this.form.max_selected <= 255 || "Maximum is 255",
        ],
        min_selected: [
          (v: number) => !!v || "this is required",
          (v: number) => v >= 1 || "Positive value only",
          (v: number) =>
            this.form.min_selected <= this.form.max_selected ||
            `You can select maximum of ${this.form.max_selected} `,
        ],
      };
    },
  },

  methods: {
    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
    shouldNumber(evt: KeyboardEvent): void {
      const keysAllowed: string[] = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
      ];
      const keyPressed: string = evt.key;

      if (!keysAllowed.includes(keyPressed)) {
        evt.preventDefault();
      }
    },
  },
});

export default positionFormMixin;
