import { format, add, isBefore } from "date-fns";

// @TODO wywalić to stąd. Może pobierać typy przez API?
const cyclicTypeNames = {
  1: "days",
  2: "weeks",
  3: "months",
  4: "years"
};

export default class ReminderCalendarScheduler {
  reminders = [];
  scheduleUntil = null;
  scheduledReminders = [];

  constructor(reminders, scheduleUntil = new Date()) {
    this.reminders = reminders;
    this.scheduleUntil = scheduleUntil;
  }

  scheduleReminders() {
    Array.prototype.forEach.call(this.reminders, reminder => {
      if (reminder.cyclic) {
        this.scheduleNextReminder(reminder);
      }
    });
  }

  scheduleNextReminder(reminder) {
    const nextReminder = Object.assign({}, reminder);
    const nextReminderAt = this.calculateNextReminderDate(reminder);
    nextReminder.remind_at = format(nextReminderAt, "yyyy-MM-dd HH:mm:ss");
    this.scheduledReminders.push(nextReminder);
    if (isBefore(nextReminderAt, this.scheduleUntil)) {
      this.scheduleNextReminder(nextReminder);
    }
  }

  calculateNextReminderDate(reminder) {
    return add(new Date(reminder.remind_at), {
      [cyclicTypeNames[reminder.cyclic.type_id]]: reminder.cyclic.periodicity
    });
  }

  get allScheduledReminders() {
    return this.reminders.concat(this.scheduledReminders);
  }
}
