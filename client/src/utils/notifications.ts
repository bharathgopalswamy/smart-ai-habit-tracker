

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("Browser notifications are not supported.");
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    new Notification("HabitIQ reminders enabled", {
      body: "You will receive habit reminder notifications.",
    });
  }
}

export function sendHabitReminder(habitName: string) {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification("HabitIQ Reminder", {
      body: `Time to complete: ${habitName}`,
    });
  }
}