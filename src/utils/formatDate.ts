import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function (date: Date | string, iso = false, format?: string) {
  if (iso) {
    return dayjs(date).utc(true).toISOString();
  } else {
    // use this as reference: https://day.js.org/docs/en/display/format
    return dayjs(date).utc(true).format(format ?? "MMMM DD, YYYY");
  }
}