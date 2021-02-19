<template>
  <div>
    <div class="home">
      <v-btn class="primary">Przycisk</v-btn>
      <v-btn dark depressed color="primary">Przycisk</v-btn>
      <v-btn text color="primary">Przycisk</v-btn>
      <v-btn depressed class="primary white--text">
        <v-icon left>mdi-email</v-icon>
        <span>Email me</span>
      </v-btn>
      <v-btn depressed small class="primary white--text">
        <v-icon left>mdi-email</v-icon>
        <span>Email me</span>
      </v-btn>

      <v-btn depressed large class="primary white--text">
        <span>Email me</span>
        <v-icon right large>mdi-email</v-icon>
      </v-btn>

      <v-btn small dark color="primary">
        <span>Email me</span>
        <v-icon right>mdi-email</v-icon>
      </v-btn>

      <v-btn icon small dark color="primary">
        <v-icon>mdi-heart</v-icon>
      </v-btn>
    </div>
    <v-container>
      <v-btn class="hidden-md-and-down">Penis</v-btn>

      <v-btn class="hidden-md-and-up">Up</v-btn>

      <v-btn class="hidden-sm-only">SM</v-btn>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>
<style scoped>
.home {
  display: flex;
  justify-content: space-around;
}
</style>
