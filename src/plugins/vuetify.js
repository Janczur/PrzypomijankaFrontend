import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import DatetimePicker from "vuetify-datetime-picker";
import pl from "vuetify/es5/locale/pl";

Vue.use(Vuetify);
Vue.use(DatetimePicker);

export default new Vuetify({
  lang: {
    locales: { pl },
    current: "pl"
  },
  theme: {
    themes: {
      light: {
        primary: "#4caf50",
        secondary: "#3f51b5",
        accent: "#673ab7",
        error: "#f44336",
        warning: "#ff9800",
        info: "#2196f3",
        success: "#8bc34a",
        inactive: "#272727"
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
    },
    options: {
      customProperties: true
    }
  }
});
