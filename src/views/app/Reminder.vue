<template>
  <div>
    <h1 class="text-sm-h5 text-md-h4 grey--text px-3 py-4 lighten-5 heading">
      Przypomnienia
    </h1>
    <v-container>
      <v-sheet height="600">
        <Calendar></Calendar>
      </v-sheet>
    </v-container>
  </div>
</template>

<script>
import Calendar from "@/components/Reminder/Calendar.vue";

export default {
  name: "Reminder",
  components: {
    Calendar
  },
  methods: {},
  data: () => ({
    mounted() {
      this.$refs.calendar.scrollToTime("08:00");
    }
  })
};
</script>

<style scoped>
.heading {
  border-left: 4px solid var(--v-primary-base);
}
</style>
