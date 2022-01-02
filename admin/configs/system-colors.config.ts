const systemColors = {
  red: { light: "#f44336", dark: "#f44336" },
  pink: { light: "#e91e63", dark: "#e91e63" },
  purple: { light: "#9c27b0", dark: "#9c27b0" },
  "deep-purple": { light: "#673ab7", dark: "#673ab7" },
  indigo: { light: "#3f51b5", dark: "#3f51b5" },
  blue: { light: "#2196f3", dark: "#2196f3" },
  "light-blue": { light: "#03a9f4", dark: "#03a9f4" },
  cyan: { light: "#00bcd4", dark: "#00bcd4" },
  teal: { light: "#009688", dark: "#009688" },
  green: { light: "#4caf50", dark: "#4caf50" },
  "light-green": { light: "#8bc34a", dark: "#8bc34a" },
  lime: { light: "#cddc39", dark: "#cddc39" },
  yellow: { light: "#ffeb3b", dark: "#ffeb3b" },
  amber: { light: "#ffc107", dark: "#ffc107" },
  orange: { light: "#ff9800", dark: "#ff9800" },
  "deep-orange": { light: "#ff5722", dark: "#ff5722" },
  brown: { light: "#795548", dark: "#795548" },
  "blue-grey": { light: "#607d8b", dark: "#607d8b" },
  grey: { light: "#9e9e9e", dark: "#9e9e9e" },
};

export type SystemColors = keyof typeof systemColors;

export default systemColors;
