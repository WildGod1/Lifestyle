export function getWeekDaysFromSelected(selectedDate) {
  const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const mondayOffset = (dayOfWeek + 6) % 7; // makes Monday = 0

  const monday = new Date(selectedDate);
  monday.setDate(selectedDate.getDate() - mondayOffset);

  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });

  return week;
}
