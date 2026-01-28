/**
 * Validation utility functions
 * Pure functions for form validation
 */

/**
 * Validates email format using regex
 * 
 * @param email - Email string to validate
 * @returns True if valid, false otherwise
 * 
 * @example
 * validateEmail('test@example.com') // true
 * validateEmail('invalid-email') // false
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates password strength
 * 
 * @param password - Password string to validate
 * @param minLength - Minimum length requirement (default: 6)
 * @returns Object with isValid flag and error message
 * 
 * @example
 * validatePassword('weak') // { isValid: false, error: 'Password must be at least 6 characters' }
 */
export function validatePassword(
  password: string,
  minLength: number = 6
): { isValid: boolean; error?: string } {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password is required' }
  }
  
  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters` }
  }
  
  return { isValid: true }
}

/**
 * Validates Nigerian phone number format
 * 
 * @param phoneNumber - Phone number string
 * @returns True if valid, false otherwise
 * 
 * @example
 * validatePhoneNumber('07060780922') // true
 * validatePhoneNumber('123') // false
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  // Nigerian phone numbers are 11 digits starting with 0
  // or 10 digits without the leading 0
  return /^0\d{10}$/.test(cleaned) || /^\d{10}$/.test(cleaned)
}

/**
 * Validates BVN (Bank Verification Number)
 * 
 * @param bvn - BVN string
 * @returns True if valid (11 digits), false otherwise
 */
export function validateBVN(bvn: string): boolean {
  const cleaned = bvn.replace(/\D/g, '')
  return cleaned.length === 11
}

/**
 * Checks if a value is not empty
 * 
 * @param value - Value to check
 * @returns True if not empty, false otherwise
 */
export function isNotEmpty(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0
}

/**
 * Validates a date string
 * 
 * @param dateString - Date string to validate
 * @returns True if valid date, false otherwise
 */
export function validateDate(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

