export type UserRole = "tourist" | "guide" | "admin";

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  bio: string;
  languages: string[];
  expertise: string[];
  dailyRate: string;
  city: string;
  travelPreferences: string[];
}

export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  city?: string;
  general?: string;
}

// Options for form fields
export const languageOptions = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Japanese",
  "Chinese",
] as const;

export const expertiseOptions = [
  "History",
  "Food",
  "Art",
  "Nightlife",
  "Adventure",
  "Shopping",
  "Nature",
  "Photography",
] as const;

export const preferenceOptions = [
  "Cultural",
  "Adventure",
  "Food",
  "Relaxation",
  "Shopping",
  "Historical",
  "Nature",
] as const;
