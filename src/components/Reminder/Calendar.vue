<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Dzisiaj
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Dzień</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Tydzień</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Miesiąc</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 Dni</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="500">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="reminderEvents"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" width="500px" flat>
            <v-toolbar :color="getEventColor(selectedEvent)" dark>
              <v-switch
                v-model="selectedEvent.active"
                @change="toggleReminderState(selectedEvent)"
                class="mt-5"
              ></v-switch>
              <v-toolbar-title
                v-html="selectedEvent.name"
                class="ml-2"
              ></v-toolbar-title>
              <v-spacer></v-spacer>
              <div
                v-for="(channel, index) in selectedEvent.channels"
                :key="index"
              >
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip color="white" class="ml-3" v-bind="attrs" v-on="on">
                      <v-icon :color="getEventColor(selectedEvent)">{{
                        getReminderChannelIcon(channel)
                      }}</v-icon>
                    </v-chip>
                  </template>
                  <span>Wyślemy Ci wiadomość {{ channel }}!</span>
                </v-tooltip>
              </div>
            </v-toolbar>
            <v-card-text>
              {{ selectedEvent.description }}
              {{ selectedEvent.id }}
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                :color="getEventColor(selectedEvent)"
                @click="selectedOpen = false"
              >
                Anuluj
              </v-btn>
              <v-btn
                v-if="currentlyEditing !== selectedEvent.id"
                text
                :color="getEventColor(selectedEvent)"
                @click.prevent="editEvent(selectedEvent)"
              >
                Edytuj </v-btn
              ><v-btn
                v-else
                text
                :color="getEventColor(selectedEvent)"
                @click.prevent="updateEvent(selectedEvent)"
              >
                Zapisz
              </v-btn>

              <v-btn @click="deleteEvent(selectedEvent.id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import ReminderCalendarScheduler from "@/components/Reminder/ReminderCalendarScheduler.js";
import { addYears } from "date-fns";
export default {
  name: "Calendar",
  data: () => ({
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Miesiąc",
      week: "Tydzień",
      day: "Dzień",
      "4day": "4 Dni"
    },
    reminders: [],
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    dialog: false,
    events: [],
    rules: {
      required: value => !!value || "Pole wymagane.",
      counter: value => value.length <= 255 || "Maksymalnie 255 znaków"
    }
  }),
  computed: {
    reminderEvents() {
      const reminderEvents = this.reminders;
      Array.prototype.forEach.call(reminderEvents, reminder => {
        reminder.name = reminder.title;
        reminder.start = reminder.remind_at;
        reminder.isCyclic = reminder.cyclic ? true : false;
      });
      return reminderEvents;
    }
  },
  mounted() {
    this.$refs.calendar.checkChange();
    this.getReminders();
  },
  methods: {
    ReminderCalendarScheduler: ReminderCalendarScheduler,
    getReminders() {
      // api
      let reminders = [
        {
          id: 1,
          title: "Co miesiąc",
          description: "opis",
          cyclic: {
            type: {
              name: "Month"
            },
            periodicity: 1
          },
          remind_at: "2021-02-24 12:30:01",
          pre_remind_at: null,
          pre_reminded: false,
          channels: ["email", "sms"],
          active: true,
          created_at: "2021-02-07 13:03:41"
        },
        {
          id: 2,
          title: "Zjeść jedzonko",
          description:
            "W przeciwieństwie do rozpowszechnionych opinii, Lorem Ipsum nie jest tylko przypadkowym tekstem. Ma ono korzenie w klasycznej łacińskiej literaturze z 45 roku przed Chrystusem, czyli ponad 2000 lat temu! Richard McClintock, wykładowca",
          cyclic: null,
          remind_at: "2021-03-27 14:00:00",
          pre_remind_at: null,
          pre_reminded: false,
          channels: ["email", "sms"],
          active: true,
          created_at: "2021-02-07 13:03:58"
        },
        {
          id: 3,
          title: "Kupić bułki",
          description:
            "W przeciwieństwie do rozpowszechnionych opinii, Lorem Ipsum nie jest tylko przypadkowym tekstem. Ma ono korzenie w klasycznej łacińskiej literaturze z 45 roku przed Chrystusem, czyli ponad 2000 lat temu! Richard McClintock, wykładowca",
          cyclic: null,
          remind_at: "2021-03-10 15:15:00",
          pre_remind_at: null,
          pre_reminded: false,
          channels: ["email", "sms"],
          active: true,
          created_at: "2021-02-07 13:03:59"
        },
        {
          id: 4,
          title: "Co 2 tygodnie",
          description:
            "W przeciwieństwie do rozpowszechnionych opinii, Lorem Ipsum nie jest tylko przypadkowym tekstem. Ma ono korzenie w klasycznej łacińskiej literaturze z 45 roku przed Chrystusem, czyli ponad 2000 lat temu! Richard McClintock, wykładowca",
          cyclic: {
            type: {
              name: "Week"
            },
            periodicity: 2
          },
          remind_at: "2021-02-07 23:51:04",
          pre_remind_at: null,
          pre_reminded: false,
          channels: ["email", "sms"],
          active: true,
          created_at: "2021-02-07 13:04:00"
        },
        {
          id: 4,
          title: "Co 24 dni",
          description:
            "W przeciwieństwie do rozpowszechnionych opinii, Lorem Ipsum nie jest tylko przypadkowym tekstem. Ma ono korzenie w klasycznej łacińskiej literaturze z 45 roku przed Chrystusem, czyli ponad 2000 lat temu! Richard McClintock, wykładowca",
          cyclic: {
            type: {
              name: "Day"
            },
            periodicity: 24
          },
          remind_at: "2021-02-07 23:51:04",
          pre_remind_at: null,
          pre_reminded: false,
          channels: ["email", "sms"],
          active: true,
          created_at: "2021-02-07 13:04:00"
        }
      ];
      let OneYearFromNow = addYears(new Date(), 3);
      let ReminderCalendarScheduler = new this.ReminderCalendarScheduler(
        reminders,
        OneYearFromNow
      );

      ReminderCalendarScheduler.scheduleReminders();
      this.reminders = ReminderCalendarScheduler.allScheduledReminders;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      if (!event.active) {
        return "inactive";
      }
      return event.isCyclic ? "primary" : "secondary";
    },
    getReminderChannelIcon(channel) {
      const channelIcons = {
        email: "mdi-email",
        sms: "mdi-cellphone-iphone"
      };
      return channelIcons[channel];
    },
    toggleReminderState(reminder) {
      // api call set active
      console.log(reminder.id);
      console.log(reminder.active);
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    editEvent(event) {
      this.currentlyEditing = event.id;
    },
    updateEvent(event) {
      this.selectedOpen = false;
      this.currentlyEditing = null;
      console.log(this.events, event);
    }
  }
};
</script>
