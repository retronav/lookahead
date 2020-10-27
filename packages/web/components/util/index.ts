export const checkEmptyStr = (str: string) => str.trim() === "";
export type LastEdited = {
  date: string;
  time: string;
};
export const getDate = (dateObj?: Date) => {
  const date = dateObj ?? new Date();
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
  return {
    date: `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`,
    time: `${date.getHours() === 0 ? "00" : date.getHours()}:${
      date.getMinutes() === 0 ? "00" : date.getMinutes()
    }`,
  };
};
