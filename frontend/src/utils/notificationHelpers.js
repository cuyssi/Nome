export function getNextNotificationDate(notifyDays, notifyTime, notifyDayBefore) {
  const [hour, minute] = notifyTime.split(":").map(Number);
  const now = new Date();

  // Map días → índice getDay()
  const map = { D: 0, L: 1, M: 2, X: 3, J: 4, V: 5, S: 6 };
  const daysIndexes = (notifyDays || []).map(d => map[d]);

  for (let offset = 0; offset < 7; offset++) {
    const candidate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + offset,
      hour,
      minute,
      0
    );
    const candidateDay = candidate.getDay();

    if (daysIndexes.includes(candidateDay)) {
      // Si es mochila escolar (avisar día antes)
      if (notifyDayBefore) {
        candidate.setDate(candidate.getDate() - 1);
      }
      
      console.log("🔔 notifyBackend llamado con:", { candidate });

      return candidate;
    }
  }

  
  return null;
}
