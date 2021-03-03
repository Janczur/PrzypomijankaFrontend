import { format, add, isBefore } from "date-fns";
export default class ReminderCalendarScheduler {
  reminders = [];
  scheduleUntil = null;
  scheduledReminders = [];

  constructor(reminders, date = new Date()) {
    this.reminders = reminders;
    this.scheduleUntil = date;
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
    nextReminder.remind_at = format(nextReminderAt, "yyy-MM-dd HH:mm:ss");
    this.scheduledReminders.push(nextReminder);
    if (isBefore(nextReminderAt, this.scheduleUntil)) {
      this.scheduleNextReminder(nextReminder);
    }
  }

  calculateNextReminderDate(reminder) {
    const cyclicTypeName = reminder.cyclic.type.name.toLowerCase() + "s";
    return add(new Date(reminder.remind_at), {
      [cyclicTypeName]: reminder.cyclic.periodicity
    });
  }

  get allScheduledReminders() {
    return this.reminders.concat(this.scheduledReminders);
  }
}
