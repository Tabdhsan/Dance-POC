import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const placeholderImage = 'https://picsum.photos/200/300'


export const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  return {
    date: date.toLocaleDateString('en-US', dateOptions),
    time: date.toLocaleTimeString('en-US', timeOptions)
  };
};