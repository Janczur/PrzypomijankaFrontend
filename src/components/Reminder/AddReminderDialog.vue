<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" v-on="on">
        <v-icon left>mdi-plus</v-icon>
        Dodaj przypomnienie
      </v-btn>
    </template>
    <v-form v-model="valid" ref="addReminderForm">
      <v-card>
        <v-toolbar :color="color" dark>
          <v-toolbar-title>Dodaj przypomnienie</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container class="px-6">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Tytuł *"
                  :color="color"
                  v-model="title"
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
                  :color="color"
                  v-model="description"
                  :counter="255"
                  :rules="descriptionRules"
                  hint="Podaj treść przypomnienia"
                  required
                  clearable
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-datetime-picker
                  label="Data i godzina *"
                  v-model="remind_at"
                  :text-field-props="textProps"
                  :date-picker-props="dateProps"
                  :time-picker-props="timeProps"
                  time-format="HH:mm:ss"
                >
                  <template slot="dateIcon">
                    <v-icon>mdi-calendar</v-icon>
                  </template>
                  <template slot="timeIcon">
                    <v-icon :color="color">mdi-clock</v-icon>
                  </template>
                  <template slot="actions" slot-scope="{ parent }">
                    <v-btn
                      color="grey"
                      text
                      @click.native="parent.clearHandler"
                    >
                      Wyczyść
                    </v-btn>
                    <v-btn :color="color" text @click="parent.okHandler">
                      Zapisz
                    </v-btn>
                  </template>
                </v-datetime-picker>
              </v-col>
              <v-col cols="12" sm="6" align-self="end">
                <v-autocomplete
                  prepend-icon="mdi-send"
                  :items="['email', 'sms']"
                  v-model="channels"
                  :color="color"
                  :item-color="color"
                  :rules="channelsRules"
                  label="Kanały wysyłki *"
                  multiple
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6">
                <v-switch
                  class="mt-0"
                  v-model="isCyclic"
                  :color="color"
                  label="Przypominaj cyklicznie"
                ></v-switch>
                <v-expand-transition>
                  <v-row no-gutters v-if="isCyclic" class="align-center">
                    <v-col cols="5">
                      <v-text-field
                        v-model.number="periodicity"
                        :color="color"
                        label="Co"
                        type="number"
                        style="width: 104px"
                      >
                        <template v-slot:prepend>
                          <v-icon
                            :color="color"
                            @click="decrement('periodicity')"
                          >
                            mdi-minus
                          </v-icon>
                        </template>
                        <template v-slot:append-outer>
                          <v-icon
                            :color="color"
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
                        :color="color"
                        :items="getCyclicTypes"
                        :item-color="color"
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
                  :color="color"
                  label="Wysyłaj przedprzypomnienie"
                ></v-switch>
                <v-expand-transition>
                  <v-row no-gutters v-if="hasPreReminder" class="align-center">
                    <v-col cols="3" sm="2">Zawsze</v-col>
                    <v-col cols="6" sm="4">
                      <v-text-field
                        v-model.number="daysBefore"
                        :color="color"
                        label="Dni"
                        type="number"
                        style="width: 100px"
                      >
                        <template v-slot:prepend>
                          <v-icon
                            :color="color"
                            @click="decrement('daysBefore')"
                          >
                            mdi-minus
                          </v-icon>
                        </template>
                        <template v-slot:append-outer>
                          <v-icon
                            :color="color"
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
          <v-btn text :color="color" :disabled="!valid" @click="saveReminder">
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
  name: "AddReminderDialog",
  data: () => ({
    dialog: false,
    valid: false,
    color: "primary",
    title: null,
    description: null,
    remind_at: null,
    channels: null,
    isCyclic: false,
    periodicity: 1,
    cyclic_type_id: 1,
    selectType: {
      id: this.cyclic_type_id,
      name: getTypeName(this.periodicity, this.cyclic_type_id)
    },
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
    increment(value) {
      this[value]++;
    },
    decrement(value) {
      if (this[value] > 1) {
        this[value]--;
      }
    },
    saveReminder() {
      if (!this.$refs.editReminderForm.validate()) {
        return;
      }
      // api call update
      console.log(this.reminder);
      this.dialog = false;
    },
    cancel() {
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
        color: this.color,
        hint: "Wybierz datę i godzinę przypomnienia",
        prependIcon: "mdi-calendar",
        rules: [
          v => !!v || "Data przypomnienia jest wymagana",
          v =>
            new Date(v) > new Date(this.minRemindAtDate) ||
            "Data przypomnienia musi być późniejsza niż 30 minut po dzisiejszej północy (" +
              this.minRemindAtDate +
              ")"
        ]
      };
    },
    dateProps() {
      return {
        color: this.color,
        min: this.minRemindAtDate
      };
    },
    timeProps() {
      return {
        color: this.color,
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
