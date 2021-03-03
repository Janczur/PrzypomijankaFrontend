<template>
  <nav>
    <v-app-bar app color="primary" elevation="2" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="text-uppercase">
        <v-icon left>mdi-bell</v-icon>
        <span>Przypomi</span>
        <span class="font-weight-bold">Janka</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <router-link :to="{ name: 'Home' }">
        <v-btn text>
          <span class="mr-2">Logout</span>
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </router-link>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer" color="secondary">
      <div class="d-flex justify-center mt-5">
        <div class="d-flex flex-column align-center">
          <v-avatar size="100">
            <img src="/img/default-avatar.png" alt="" />
          </v-avatar>
          <span class="white--text text-center subtitle-1 mt-2"
            >Nazwa użytkownika</span
          >
          <div class="my-5">
            <ReminderDialog />
          </div>
        </div>
      </div>
      <v-list>
        <v-list-item
          v-for="link in links"
          :key="link.text"
          router
          :to="{ name: link.routeName }"
        >
          <v-list-item-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">
              {{ link.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import ReminderDialog from "./Reminder/ReminderDialog.vue";

export default {
  components: { ReminderDialog: ReminderDialog },
  name: "AppNavigation",
  data: () => ({
    drawer: true,
    links: [
      { icon: "mdi-view-dashboard", text: "Panel", routeName: "Dashboard" },
      { icon: "mdi-bell", text: "Przypomnienia", routeName: "Reminders" },
      { icon: "mdi-account", text: "Profil", routeName: "Profile" }
    ]
  })
};
</script>
