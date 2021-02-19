<template>
  <v-app>
    <PublicNavigation />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app>
      Stopka publiczna
    </v-footer>
  </v-app>
</template>

<script>
import PublicNavigation from "@/components/PublicNavigation";
export default {
  name: "PublicLayout",
  components: {
    PublicNavigation: PublicNavigation
  },
  data: () => ({
    //
  })
};
</script>
