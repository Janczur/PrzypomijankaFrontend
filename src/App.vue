<template>
  <v-app>
    <AppNavigation />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app>
      Stopka
    </v-footer>
  </v-app>
</template>

<script>
import AppNavigation from "@/components/AppNavigation";
export default {
  name: "App",
  components: {
    AppNavigation: AppNavigation
  },
  data: () => ({
    //
  })
};
</script>
