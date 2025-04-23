import moment from "moment-jalaali";

export function jalaliToGregorian(jalaliDate: string): string {
  const gregorianDate = moment(jalaliDate, "jYYYY/jM/jD").startOf("day");

  return (
    gregorianDate.utcOffset("+03:30").format("YYYY-MM-DDTHH:mm:ss.SSS") +
    "+03:30"
  );
}
