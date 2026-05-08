import { ClientListRow } from "@/types/dashboard";

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

export function initials(name: string) {
  return name
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getStatusTone(status: ClientListRow["status"]) {
  if (status === "Active") {
    return "bg-green/15 text-green";
  }

  if (status === "Due Entry") {
    return "bg-[#FFA70B]/15 text-[#FFA70B]";
  }

  return "bg-primary/15 text-primary";
}

export function getAccent(index: number) {
  const accents = [
    "bg-green/15 text-green",
    "bg-pink-400/15 text-pink-300",
    "bg-cyan-400/15 text-cyan-300",
    "bg-orange-400/15 text-orange-300",
  ];

  return accents[index % accents.length];
}

export function capitalize(str: string = "") {
 return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}
