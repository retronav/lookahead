// Though this function is defined in packages/web/components/util.index.ts,
// This is going to be pushed to the serverless env
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
    time: `${
      date.getHours() === 0 ? "00" : date.getHours().toString().padStart(2, "0")
    }:${
      date.getMinutes() === 0
        ? "00"
        : date.getMinutes().toString().padStart(2, "0")
    }`,
  };
};
