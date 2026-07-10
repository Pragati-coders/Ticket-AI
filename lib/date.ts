export function subMonths(date: Date, months: number) {
  const clone = new Date(date);
  clone.setMonth(clone.getMonth() - months);
  return clone;
}
