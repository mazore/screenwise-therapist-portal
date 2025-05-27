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