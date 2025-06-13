import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//gets page range for session logs
export function getPaginationRange(currentPage: number, totalPages: number): (number | "...")[] {
  const range: (number | "...")[] = [];

  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) range.push(i);
    return range;
  }

  if (currentPage <= 3) {
    range.push(1, 2, 3, 4, "...", totalPages);
  } else if (currentPage === 4) {
    range.push(1, 2, 3, 4, 5, "...", totalPages);
  } else if (currentPage >= totalPages - 2) {
    range.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    range.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
  }

  return range;
}

/*Returns the name of the progression stage corresponding to the given UUID.
 If the UUID is not found or undefined, returns a placeholder "—". */
export function getProgressionName(progressionStages: { uuid: string; name: string }[], progressionUuid: string | undefined): string {
  if (!progressionUuid) return "—";
  const stage = progressionStages.find(stage => stage.uuid === progressionUuid);
  if (!stage) return "—";

  // Replace the dot after the number with a dash and space, e.g. "1. Beginner" => "1 - Beginner"
  return stage.name.replace(".", " -");
}

export const STATS_TIME_MODES = [
    { label: '12M', resolution: 'month', amount: 12, getLabel: (d) => d.format('MMM') },
    { label: '6M',  resolution: 'month', amount: 6,  getLabel: (d) => d.format('MMM') },
    { label: '12W', resolution: 'week',  amount: 12, getLabel: (d) => d.format('M/D') },
    { label: '6W',  resolution: 'week',  amount: 6,  getLabel: (d) => d.format('MMM D') },
    { label: '30D', resolution: 'day',   amount: 30, 
      //getLabel: (d) => [1, 10, 20].includes(d.date()) && d.format('MMM D') 
      getLabel: (d) => d.format('MMM D')
    },
    { label: '10D', resolution: 'day',   amount: 10, getLabel: (d) => d.format('M/D') },
];