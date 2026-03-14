export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getProgressBarClassName(progress: number) {
  if (progress >= 70) {
    return "bg-green";
  }

  if (progress >= 50) {
    return "bg-primary";
  }

  return "bg-[#FFA70B]";
}

export function formatTimeParts(date: string) {
  const time = new Date(date);

  return {
    hourMinute: time.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    meridiem: time
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        hour12: true,
      })
      .split(" ")[1],
  };
}
