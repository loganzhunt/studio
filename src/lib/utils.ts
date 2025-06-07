import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Clamps a value between min and max (inclusive).
 * @param value The value to clamp
 * @param min The minimum value (defaults to 0)
 * @param max The maximum value (defaults to 1)
 * @returns The clamped value
 */
export function clamp(value: number, min: number = 0, max: number = 1): number {
  return Math.max(min, Math.min(max, value))
} { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Clamps a value between min and max (inclusive).
 * @param value The value to clamp
 * @param min The minimum value (defaults to 0)
 * @param max The maximum value (defaults to 1)
 * @returns The clamped value
 */
export function clamp(
  value: number,
  min: number = 0,
  max: number = 1
): number {
  return Math.max(min, Math.min(max, value));
}
