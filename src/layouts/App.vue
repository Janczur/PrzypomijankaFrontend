<template>
  <v-app>
    <AppNavigation />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppNavigation from "@/components/AppNavigation";
export default {
  name: "AppLayout",
  components: {
    AppNavigation: AppNavigation
  },
  data: () => ({
    //
  })
};
</script>
