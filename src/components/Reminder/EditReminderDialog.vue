<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        :color="reminder.color"
        v-bind="attrs"
        v-on="on"
        @click="prepareReminderToEdit()"
      >
        Edytuj
      </v-btn>
    </template>
    <v-form v-model="valid" ref="editReminderForm">
      <v-card>
        <v-toolbar :color="reminder.color" dark>
          <v-toolbar-title>Edytuj przypomnienie</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container class="px-6">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Tytuł *"
                  :color="reminder.color"
                  v-model="reminder.title"
                  :counter="100"
                  :rules="titleRules"
                  hint="Podaj tytuł przypomnienia"
                  required
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Treść *"
                  :color="reminder.color"
                  v-model="reminder.description"
                  :counter="255"
                  :rules="descriptionRules"
                  hint="Podaj treść przypomnienia"
                  required
                  clearable
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-switch
                      class="mb-0"
                      v-model="editDate"
                      :color="reminder.color"
                    >
                      <template v-slot:label>
                        Chcę edytować datę przypomnienia
                        <v-tooltip top v-if="isCyclic">
                          <template v-slot:activator="{ on }">
                            <v-icon
                              :color="reminder.color"
                              class="ml-1"
                              v-on="on"
                            >
                              mdi-calendar-question
                            </v-icon>
                          </template>
                          Edycja daty będzie skutkować zmianą i ponownym
                          obliczeniem wszystkich cyklicznych przypomnień
                        </v-tooltip>
                      </template>
                    </v-switch>
                  </v-col>
                  <v-col cols="12">
                    <v-datetime-picker
                      :disabled="!editDate"
                      label="Data i godzina *"
                      v-model="reminder.remind_at"
                      :text-field-props="textProps"
                      :date-picker-props="dateProps"
                      :time-picker-props="timeProps"
                      time-format="HH:mm:ss"
                    >
                      <template slot="dateIcon">
                        <v-icon>mdi-calendar</v-icon>
                      </template>
                      <template slot="timeIcon">
                        <v-icon :color="reminder.color">mdi-clock</v-icon>
                      </template>
                      <template slot="actions" slot-scope="{ parent }">
                        <v-btn
                          color="grey"
                          text
                          @click.native="parent.clearHandler"
                        >
                          Wyczyść
                        </v-btn>
                        <v-btn
                          :color="reminder.color"
                          text
                          @click="parent.okHandler"
                        >
                          Zapisz
                        </v-btn>
                      </template>
                    </v-datetime-picker>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" sm="6" align-self="end">
                <v-autocomplete
                  prepend-icon="mdi-send"
                  :items="['email', 'sms']"
                  v-model="reminder.channels"
                  :color="reminder.color"
                  :item-color="reminder.color"
                  :rules="channelsRules"
                  label="Kanały wysyłki *"
                  multiple
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6">
                <v-switch
                  class="mt-0"
                  v-model="isCyclic"
                  :color="reminder.color"
                  label="Przypominaj cyklicznie"
                ></v-switch>
                <v-expand-transition>
                  <v-row no-gutters v-if="isCyclic" class="align-center">
                    <v-col cols="5">
                      <v-text-field
                        v-model.number="periodicity"
                        :color="reminder.color"
                        label="Co"
                        type="number"
                        style="width: 104px"
                      >
                        <template v-slot:prepend>
                          <v-icon
                            :color="reminder.color"
                            @click="decrement('periodicity')"
                          >
                            mdi-minus
                          </v-icon>
                        </template>
                        <template v-slot:append-outer>
                          <v-icon
                            :color="reminder.color"
                            @click="increment('periodicity')"
                          >
                            mdi-plus
                          </v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        v-model="selectType"
                        :color="reminder.color"
                        :items="getCyclicTypes"
                        :item-color="reminder.color"
                        item-text="name"
                        item-value="id"
                        value="Dni"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-expand-transition>
              </v-col>

              <v-col cols="12" sm="6">
                <v-switch
                  class="mt-0"
                  v-model="hasPreReminder"
                  :color="reminder.color"
                  label="Wysyłaj przedprzypomnienie"
                ></v-switch>
                <v-expand-transition>
                  <v-row no-gutters v-if="hasPreReminder" class="align-center">
                    <v-col cols="3" sm="2">Zawsze</v-col>
                    <v-col cols="6" sm="4">
                      <v-text-field
                        v-model.number="daysBefore"
                        :color="reminder.color"
                        label="Dni"
                        type="number"
                        style="width: 100px"
                      >
                        <template v-slot:prepend>
                          <v-icon
                            :color="reminder.color"
                            @click="decrement('daysBefore')"
                          >
                            mdi-minus
                          </v-icon>
                        </template>
                        <template v-slot:append-outer>
                          <v-icon
                            :color="reminder.color"
                            @click="increment('daysBefore')"
                          >
                            mdi-plus
                          </v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col cols="3" sm="4">przed</v-col>
                  </v-row>
                </v-expand-transition>
              </v-col>
            </v-row>
          </v-container>

          <small>* wymagane pole</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancel()">
            Anuluj
          </v-btn>
          <v-btn
            text
            :color="reminder.color"
            :disabled="!valid"
            @click="editReminder"
          >
            Zapisz
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>
import { getTypeName } from "@/components/Reminder/Cyclic/Type/PolishNameGenerator";
import { format, startOfTomorrow, addMinutes } from "date-fns";
export default {
  name: "EditReminderDialog",
  props: {
    reminder: Object
  },
  data: () => ({
    dialog: false,
    valid: false,
    reminderBeforeEdit: {},
    editDate: false,
    isCyclic: null,
    periodicity: 1,
    selectType: {},
    hasPreReminder: null,
    daysBefore: 1,
    titleRules: [
      v => !!v || "Tytuł jest wymagany",
      v => v.length >= 1 || "Tytuł musi mieć więcej niż 1 znak",
      v => v.length <= 100 || "Tytuł musi mieć mniej niż 100 znaków"
    ],
    descriptionRules: [
      v => v.length <= 255 || "Tytuł musi mieć mniej niż 255 znaków"
    ],
    channelsRules: [
      v =>
        ["email", "sms"].some(value => v.includes(value)) ||
        "Wybierz jeden z wspieranych kanałów wysyłki"
    ]
  }),
  methods: {
    prepareReminderToEdit() {
      this.saveReminderState();
      this.setUpCyclicData();
      this.setUpPreReminderData();
    },
    saveReminderState() {
      this.reminderBeforeEdit = Object.assign({}, this.reminder);
    },
    setUpCyclicData() {
      if (!(this.isCyclic = this.reminder.isCyclic)) {
        this.periodicity = 1;
        this.selectType = { id: 1, name: "Dzień" };
        return;
      }
      this.periodicity = this.reminder.cyclic.periodicity;
      this.selectType = {
        id: this.reminder.cyclic.type_id,
        name: getTypeName(
          this.reminder.cyclic.periodicity,
          this.reminder.cyclic.type_id
        )
      };
    },
    setUpPreReminderData() {
      if (!(this.hasPreReminder = this.reminder.hasPreReminder)) {
        this.daysBefore = 1;
        return;
      }
      this.daysBefore = this.reminder.pre_reminder.days_before;
    },
    increment(value) {
      this[value]++;
    },
    decrement(value) {
      if (this[value] > 1) {
        this[value]--;
      }
    },
    editReminder() {
      if (!this.$refs.editReminderForm.validate()) {
        return;
      }
      // api call update
      console.log(this.reminder);
    },
    cancel() {
      Object.assign(this.reminder, this.reminderBeforeEdit);
      this.dialog = false;
    }
  },
  computed: {
    getCyclicTypes() {
      // @TODO brać typy z VUEX
      return [
        { id: 1, name: getTypeName(this.periodicity, 1) },
        { id: 2, name: getTypeName(this.periodicity, 2) },
        { id: 3, name: getTypeName(this.periodicity, 3) },
        { id: 4, name: getTypeName(this.periodicity, 4) }
      ];
    },
    minRemindAtDate() {
      let minRemindAtDate = startOfTomorrow();
      minRemindAtDate = addMinutes(minRemindAtDate, 30);
      return format(minRemindAtDate, "yyyy-MM-dd HH:mm:ss");
    },
    textProps() {
      return {
        color: this.reminder.color,
        hint: "Wybierz datę i godzinę przypomnienia",
        prependIcon: "mdi-calendar",
        rules: this.editDate
          ? [
              v => !!v || "Data przypomnienia jest wymagana",
              v =>
                new Date(v) > new Date(this.minRemindAtDate) ||
                "Data przypomnienia musi być późniejsza niż 30 minut po dzisiejszej północy (" +
                  this.minRemindAtDate +
                  ")"
            ]
          : []
      };
    },
    dateProps() {
      return {
        color: this.reminder.color,
        min: this.minRemindAtDate
      };
    },
    timeProps() {
      return {
        color: this.reminder.color,
        format: "24hr",
        min: "00:30:00",
        useSeconds: true,
        scrollable: true
      };
    }
  }
};
</script>
<style scoped>
/* disable default number input arrows */
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
