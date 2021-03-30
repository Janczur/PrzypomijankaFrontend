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
      <v-sheet height="600">
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
          max-width="550px"
        >
          <v-card flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <div
                v-for="(channel, index) in selectedEvent.channels"
                :key="index"
              >
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip color="white" class="ml-3" v-bind="attrs" v-on="on">
                      <v-icon :color="selectedEvent.color">{{
                        getReminderChannelIcon(channel)
                      }}</v-icon>
                    </v-chip>
                  </template>
                  <span>Wyślemy Ci wiadomość {{ channel }}!</span>
                </v-tooltip>
              </div>
            </v-toolbar>
            <v-card-text style="position: relative;">
              <v-chip
                class="pa-4"
                :color="selectedEvent.color"
                text-color="white"
                elevation-10
                style="position: absolute; top:-16px; left:0;"
              >
                <v-icon left>{{
                  selectedEvent.sent
                    ? "mdi-bell-check-outline"
                    : "mdi-bell-ring-outline"
                }}</v-icon>

                {{ displayHumanReadableReminderDateDistance(selectedEvent) }}
              </v-chip>
              <div class="mt-2">
                {{ selectedEvent.description }}
              </div>
            </v-card-text>
            <v-card-actions>
              <edit-reminder-dialog
                :reminder="selectedEvent"
              ></edit-reminder-dialog>

              <v-spacer></v-spacer>

              <v-btn text color="grey" @click="selectedOpen = false">
                Anuluj
              </v-btn>

              <v-btn @click="deleteEvent(selectedEvent.id)" icon>
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
            <v-expand-transition
              v-if="selectedEvent.hasPreReminder || selectedEvent.isCyclic"
            >
              <v-expansion-panels accordion focusable multiple>
                <v-expansion-panel v-if="selectedEvent.hasPreReminder">
                  <v-expansion-panel-header class="px-4" ripple>
                    <div class="flex align-center">
                      <v-icon :color="selectedEvent.color">
                        mdi-bell-alert-outline
                      </v-icon>
                      <span class="ml-2">Przypomnij</span>
                      <span class="font-weight-bold">
                        {{ selectedEvent.pre_reminder.days_before }}
                        {{
                          selectedEvent.pre_reminder.days_before === 1
                            ? "dzień"
                            : "dni"
                        }}
                      </span>
                      <span>wcześniej</span>
                    </div>
                    <template v-slot:actions>
                      <v-icon :color="selectedEvent.color">
                        $expand
                      </v-icon>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="pt-3 grey--text text--darken-1 text-body-2">
                      <div>
                        Przedprzypomnienie będzie wysyłane zawsze
                        <span class="font-weight-bold">
                          {{ selectedEvent.pre_reminder.days_before }}
                          {{
                            selectedEvent.pre_reminder.days_before === 1
                              ? "dzień"
                              : "dni"
                          }}
                        </span>
                        przed głównym przypomnieniem.
                      </div>
                      <div class="mt-2">
                        <span>Wysyłka</span>
                        <v-icon :color="selectedEvent.color">
                          mdi-calendar-clock
                        </v-icon>
                        {{
                          displayHumanReadablePreReminderDateDistance(
                            selectedEvent
                          )
                        }}
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-if="selectedEvent.isCyclic" readonly>
                  <v-expansion-panel-header class="px-4" disable-icon-rotate>
                    <div>
                      <v-icon :color="selectedEvent.color">
                        mdi-calendar-multiple-check
                      </v-icon>
                      <span class="ml-2">Przypominaj cyklicznie co</span>
                      <span class="font-weight-bold">
                        {{ displayReminderCyclic(selectedEvent.cyclic) }}
                      </span>
                    </div>
                    <template v-slot:actions>
                      <v-icon :color="selectedEvent.color">
                        mdi-check-all
                      </v-icon>
                    </template>
                  </v-expansion-panel-header>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-expand-transition>
            <ConfirmDialog ref="confirm" />
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import ReminderCalendarScheduler from "@/components/Reminder/ReminderCalendarScheduler.js";
import {
  subDays,
  addMinutes,
  addYears,
  isBefore,
  formatDistance,
  format
} from "date-fns";
import pl from "date-fns/locale/pl";
import ConfirmDialog from "@/components/Common/ConfirmDialog.vue";
import EditReminderDialog from "@/components/Reminder/EditReminderDialog.vue";
export default {
  components: { ConfirmDialog, EditReminderDialog },
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
    currentlyEditingId: null,
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
      reminderEvents.forEach(reminder => {
        reminder.name = reminder.title;
        reminder.start = reminder.remind_at;
        reminder.end = format(
          addMinutes(new Date(reminder.remind_at), 1),
          "yyyy-MM-dd HH:mm:ss"
        );
        reminder.isCyclic = !!reminder.cyclic;
        reminder.hasPreReminder = !!reminder.pre_reminder;
        reminder.sent = isBefore(new Date(reminder.remind_at), new Date());
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
      const reminders = [
        {
          id: 7,
          title: "Jednorazowy kupić bułki",
          description: "pamiętaj",
          pre_reminder: {
            days_before: 5,
            remind_at: "2021-03-03 05:30:01"
          },
          cyclic: null,
          remind_at: "2021-03-12 13:40:01",
          channels: ["email", "sms"],
          color: "info",
          created_at: "2021-03-04 21:02:06"
        },
        {
          id: 8,
          title: "Umyć włosy",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type speci",
          pre_reminder: {
            days_before: 6,
            remind_at: "2021-03-16 22:03:45"
          },
          cyclic: {
            periodicity: 2,
            type_id: 2
          },
          remind_at: "2021-03-04 22:03:45",
          channels: ["email", "sms"],
          color: "#F06292",
          created_at: "2021-03-04 21:02:28"
        },
        {
          id: 9,
          title: "Iść do fryzjera",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type speci",
          pre_reminder: null,
          cyclic: {
            periodicity: 1,
            type_id: 3
          },
          remind_at: "2021-03-08 13:30:01",
          channels: ["email", "sms"],
          color: "primary",
          created_at: "2021-03-04 21:02:36"
        },
        {
          id: 10,
          title: "Posprzątać domek",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type speci",
          pre_reminder: null,
          cyclic: {
            periodicity: 8,
            type_id: 1
          },
          remind_at: "2021-03-03 23:00:00",
          channels: ["email", "sms"],
          color: "#4E342E",
          created_at: "2021-03-04 21:02:56"
        },
        {
          id: 11,
          title: "Zrobić masaż dudusiowi",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type speci",
          pre_reminder: {
            days_before: 1,
            remind_at: "2021-03-04 05:30:01"
          },
          cyclic: {
            periodicity: 7,
            type_id: 1
          },
          remind_at: "2021-03-02 13:30:00",
          channels: ["email", "sms"],
          color: "primary",
          created_at: "2021-03-04 21:03:04"
        },
        {
          id: 12,
          title: "Iść do sklepu",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type speci",
          pre_reminder: null,
          cyclic: null,
          remind_at: "2021-03-16 13:30:00",
          channels: ["email", "sms"],
          color: "accent",
          created_at: "2021-03-04 21:03:09"
        }
      ];
      const ThreeYearsFromNow = addYears(new Date(), 3);
      const ReminderCalendarScheduler = new this.ReminderCalendarScheduler(
        reminders,
        ThreeYearsFromNow
      );

      ReminderCalendarScheduler.scheduleReminders();
      this.reminders = ReminderCalendarScheduler.allScheduledReminders;
    },
    displayHumanReadableReminderDateDistance(reminder) {
      if (!reminder.remind_at) {
        return;
      }
      return formatDistance(new Date(reminder.remind_at), new Date(), {
        addSuffix: true,
        locale: pl
      });
    },
    displayHumanReadablePreReminderDateDistance(reminder) {
      const preRemindAt = subDays(
        new Date(reminder.remind_at),
        reminder.pre_reminder.days_before
      );
      return formatDistance(preRemindAt, new Date(), {
        addSuffix: true,
        locale: pl
      });
    },
    displayReminderCyclic(cyclic) {
      return (
        cyclic.periodicity +
        " " +
        this.getLocaleCyclicTypeName(cyclic.periodicity, cyclic.type_id)
      );
    },
    getLocaleCyclicTypeName(periodicity, type_id) {
      const cyclicTypeNames = {
        1: periodicity === 1 ? "dzień" : "dni",
        2: periodicity === 1 ? "tydzień" : "tygodnie",
        3: periodicity === 1 ? "miesiąc" : "miesiące",
        4: periodicity === 1 ? "rok" : "lata"
      };
      return cyclicTypeNames[type_id];
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
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
    getEventColor(event) {
      return event.color;
    },
    getReminderChannelIcon(channel) {
      const channelIcons = {
        email: "mdi-email",
        sms: "mdi-cellphone-iphone"
      };
      return channelIcons[channel];
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
      this.currentlyEditingId = event.id;
    },
    updateEvent(reminder) {
      this.currentlyEditingId = null;
      console.log(reminder);
    },
    async deleteEvent(reminderId) {
      if (
        !(await this.$refs.confirm.open(
          "Potwierdź",
          "Czy na pewno chcesz usunąć to powiadomienie?"
        ))
      ) {
        return;
      }
      //api call
      this.selectedOpen = false;
      this.reminders = this.reminders.filter(function(reminder) {
        return reminder.id !== reminderId;
      });
    }
  }
};
</script>
