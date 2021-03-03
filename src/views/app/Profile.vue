<template>
  <div>
    <h1 class="subheading grey--text">Profil</h1>
    <div class="">
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit sequi,
      ex fugit alias molestias quidem, animi sit et blanditiis quis aliquid
      iusto ducimus ipsam, accusamus nam obcaecati reprehenderit voluptatibus
      eaque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, ad
      qui obcaecati assumenda distinctio praesentium tenetur harum provident
      error, quam nulla vero adipisci! Enim officia exercitationem quam incidunt
      sint! Vero?
    </div>
    <v-row>
      <v-col>
        <v-btn small text color="grey" @click="sortBy('title')">
          <v-icon left small>mdi-folder</v-icon>
          <span class="caption lower-case">By project name</span>
        </v-btn>
        <v-btn small text color="grey" @click="sortBy('person')">
          <v-icon left small>mdi-account</v-icon>
          <span class="caption lower-case">By name</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-card elevation="2" class="pa-3">
      <div v-for="reminder in reminders" :key="reminder.id">
        <v-row>
          <v-col xs="12" sm="6" md="3">
            <div class="caption grey--text">Tytuł</div>
            <div>{{ reminder.title }}</div>
          </v-col>
          <v-col xs="12" sm="6" md="3">
            <div class="caption grey--text">Treść</div>
            <div>{{ reminder.description }}</div>
          </v-col>
          <v-col xs="2">
            <div class="caption grey--text">Typ</div>
            <div>
              {{ isCyclic(reminder.cyclic) ? "Cykliczne" : "Jednorazowe" }}
            </div>
          </v-col>
          <v-col xs="2">
            <div class="caption grey--text">Data Wysyłki</div>
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  {{ reminder.remind_at }}
                </div>
              </template>
              <span>{{ reminder.remind_at }}</span>
            </v-tooltip>
          </v-col>
          <v-col xs="2">
            <div class="caption grey--text">Kanały wysyłki</div>
            <div>{{ reminder.channels }}</div>
          </v-col>
        </v-row>
        <v-divider class="my-3"></v-divider>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Profile"
};
</script>
