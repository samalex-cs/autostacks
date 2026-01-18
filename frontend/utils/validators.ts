/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate name (minimum 2 characters, letters only)
 */
export function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name.trim());
}

/**
 * Validate date is in the future
 */
export function isFutureDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj >= today;
}

/**
 * Validate date is within range
 */
export function isDateInRange(
  date: Date | string,
  minDays = 0,
  maxDays = 30
): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + minDays);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + maxDays);

  return dateObj >= minDate && dateObj <= maxDate;
}

/**
 * Validate required field
 */
export function isRequired(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Validate minimum length
 */
export function hasMinLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

/**
 * Validate maximum length
 */
export function hasMaxLength(value: string, max: number): boolean {
  return value.trim().length <= max;
}

/**
 * Validate price range
 */
export function isValidPrice(price: number, min = 0, max = 100000000): boolean {
  return price >= min && price <= max;
}

/**
 * Form validation helper
 */
export interface ValidationRule {
  validate: (value: unknown) => boolean;
  message: string;
}

export function validateField(
  value: unknown,
  rules: ValidationRule[]
): string | null {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return null;
}

/**
 * Validate entire form
 */
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  validationRules: Record<keyof T, ValidationRule[]>
): Record<keyof T, string | null> {
  const errors = {} as Record<keyof T, string | null>;

  for (const field in validationRules) {
    errors[field] = validateField(data[field], validationRules[field]);
  }

  return errors;
}

/**
 * Check if form has errors
 */
export function hasErrors<T>(errors: Record<keyof T, string | null>): boolean {
  return Object.values(errors).some((error) => error !== null);
}

