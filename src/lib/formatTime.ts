export function padWithZero(num: string): string {
  return num.length === 1 ? '0' + num : num;
}

export function formatTime(time: string): string {
  const [hours, minutes, seconds] = time.split(':');
  const paddedHours = padWithZero(hours);
  const paddedMinutes = padWithZero(minutes);
  const paddedSecondss = padWithZero(seconds);
  return `${paddedHours}:${paddedMinutes}:${paddedSecondss}`;
}
