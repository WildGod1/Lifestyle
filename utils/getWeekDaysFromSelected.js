export default function getWeekDaysFromSelected(selectedDate) {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay(); // 0 (Sun) to 6 (Sat)
    const diffToMonday = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
  
    const week = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date(startOfWeek);
      current.setDate(startOfWeek.getDate() + i);
      week.push(current);
    }
  
    return week;
  }
  