export const checkEmptyStr = (str: string) => str.trim() === "";
export type LastEdited = {
  date: string;
  time: string;
};
/**
 * ISOToReadableDate Converts an ISO 8601 timestamp to readable date
 * @param iso the ISO 8601 timestamp
 */
export const ISOToReadableDate = (iso: string) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dateObj = new Date(iso);
  const date = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();
  return `${date} ${months[month]}, ${year} at ${
    hour === 0 ? "00" : hour.toString().padStart(2, "0")
  }:${minute === 0 ? "00" : minute.toString().padStart(2, "0")}`;
};
