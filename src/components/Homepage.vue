<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <p>Pen</p>
        <p>{{ message }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Homepage",
  props: ["message"],

  data: () => ({})
};
</script>
