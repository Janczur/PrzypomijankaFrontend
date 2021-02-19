<template>
  <nav>
    <v-app-bar app color="primary" dark>
      <router-link :to="{ name: 'Home' }">
        <v-btn text>
          <v-icon>mdi-home</v-icon>
          <span class="ml-2 text--white">Przypomijanka</span>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>

      <router-link :to="{ name: 'Login' }">
        <v-btn text>
          <span class="mr-2">Login</span>
          <v-icon>mdi-login</v-icon>
        </v-btn>
      </router-link>
      <router-link :to="{ name: 'Register' }">
        <v-btn text>
          <span class="mr-2">Register</span>
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
      </router-link>
    </v-app-bar>
  </nav>
</template>

<script>
export default {
  name: "PublicNavigation"
};
</script>
