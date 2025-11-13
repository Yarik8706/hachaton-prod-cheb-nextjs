import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Возвращает человеко-читаемую разницу между переданной и текущей датой
 * @param isoDate — строка даты в формате ISO, например "2025-10-24T20:40:04.439478Z"
 * @returns строку типа "1 д., 2 ч. 3 мин.", "2 ч. 15 мин.", "3 мин."
 */
/**
 * Возвращает человеко-читаемую разницу между переданной датой и текущим моментом
 * Поддерживает прошлое и будущее время.
 * @param isoDate — строка в ISO формате, например "2025-10-24T20:40:04.439478Z"
 */
export function timeAgo(isoDate: string): string {
  const nowUtc = new Date(new Date().toISOString());
  const targetUtc = new Date(isoDate);
  const diffMs = targetUtc.getTime() - nowUtc.getTime();

  const isFuture = diffMs > 0;
  const absDiff = Math.abs(diffMs);

  const minutes = Math.floor(absDiff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remHours = hours % 24;
  const remMinutes = minutes % 60;

  let result = "";

  if (days > 0) {
    result = remHours > 0 ? `${days} д., ${remHours} ч.` : `${days} д.`;
  } else if (hours > 0) {
    result = remMinutes > 0 ? `${hours} ч. ${remMinutes} мин.` : `${hours} ч.`;
  } else if (minutes > 0) {
    result = `${minutes} мин.`;
  } else {
    result = "меньше минуты";
  } 

  return isFuture ? `${result}` : `${result}`;
}

