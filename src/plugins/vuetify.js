import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#4caf50",
        secondary: "#3f51b5",
        accent: "#673ab7",
        error: "#f44336",
        warning: "#ff9800",
        info: "#2196f3",
        success: "#8bc34a"
      },
      dark: {
        primary: "#607d8b",
        secondary: "#3f51b5",
        accent: "#673ab7",
        error: "#f44336",
        warning: "#ff9800",
        info: "#03a9f4",
        success: "#4caf50"
      }
    }
  }
});
