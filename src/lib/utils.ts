import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const handleRequest = async (promise: Promise<any>) => {
  try {
    const res = await promise;
    return res.data;
  } catch (error: any) {
    console.error("API Error:", error?.response?.data || error.message);

    return null; // prevent crash
  }
};