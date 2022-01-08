import Vue from "vue";
import { TiptapVuetifyPlugin } from "tiptap-vuetify";
import "tiptap-vuetify/dist/main.css";
import { Plugin } from "@nuxt/types";

const tiptapVuetify: Plugin = ({ app }) => {
  Vue.use(TiptapVuetifyPlugin, {
    vuetify: app.vuetify,
    iconsGroup: "mdi",
  });
};

export default tiptapVuetify;
