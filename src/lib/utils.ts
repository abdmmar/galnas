import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as z from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function flattenErrors<T>(errors: z.ZodFormattedError<T>) {
  type ErrorsKey = keyof typeof errors
  // @ts-expect-error can't type error below
  const result: T = {}

  for (const key in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, key)) {
      if (key === '_errors' && Array.isArray(errors[key]) && errors[key].length === 0) {
        // Skip empty _errors arrays
        continue
      }

      if (
        typeof errors[key as ErrorsKey] === 'object' &&
        // @ts-expect-error can't type error below
        (errors[key as ErrorsKey] as unknown)?._errors?.length > 0
      ) {
        // @ts-expect-error can't type error below
        result[key as ErrorsKey] = (errors[key as ErrorsKey] as unknown)._errors[0]
        // @ts-expect-error can't type error below
      } else if (typeof errors[key] === 'object') {
        // @ts-expect-error can't type error below
        result[key] = flattenErrors(errors[key])
      }
    }
  }

  return result
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce<T extends Function>(cb: T, wait = 20) {
  let h: NodeJS.Timeout | number = 0;
  const callable = (...args: Array<unknown>) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };
  return <T>(<unknown>callable);
}

export function getImageCDN(fileName: string) {
  return `https://cdn.statically.io/img/galnas.abdmmar.com/images/${fileName}`
}