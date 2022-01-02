import Vue from "vue";
import colors from "vuetify/es5/util/colors";
import { Colors } from "vuetify/lib/util/colors";
import systemColors, { SystemColors } from "../configs/system-colors.config";

type AppTheme = {
  primary: SystemColors;
  secondary: SystemColors;
};

const themeMixin = Vue.extend({
  methods: {
    changeTheme(theme?: AppTheme) {
      const currentTheme = this.$vuetify.theme.themes;

      const defaultPrimary = colors.blue.darken2;
      const defaultSecondary = colors.amber.darken3;

      const darkTheme = {
        ...currentTheme.dark,
        primary: defaultPrimary,
        secondary: defaultSecondary,
      };

      const lightTheme = {
        ...currentTheme.light,
        primary: defaultPrimary,
        secondary: defaultSecondary,
      };

      if (theme) {
        const primaryColor = systemColors[theme.primary];
        const secondaryColor = systemColors[theme.secondary];

        darkTheme.primary = primaryColor.dark;
        darkTheme.secondary = secondaryColor.dark;

        lightTheme.primary = primaryColor.light;
        lightTheme.secondary = secondaryColor.light;
      }

      this.$vuetify.theme.themes.dark = Object.assign({}, darkTheme);
      this.$vuetify.theme.themes.light = Object.assign({}, lightTheme);
    },
  },
});

export default themeMixin;
