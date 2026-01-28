/**
 * Utility functions for formatting data
 * Pure functions with no side effects
 */

/**
 * Formats a number as Nigerian Naira currency
 * 
 * @param amount - The amount to format
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(200000) // "₦200,000.00"
 */
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) {
    return '₦0.00'
  }
  
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(numAmount)
}

/**
 * Formats a date string to readable format
 * 
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 * 
 * @example
 * formatDate('2020-05-15T10:00:00.000Z') // "May 15, 2020 10:00 AM"
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  
  return date.toLocaleDateString('en-US', options || defaultOptions)
}

/**
 * Formats a phone number for display
 * 
 * @param phoneNumber - Phone number string
 * @returns Formatted phone number
 * 
 * @example
 * formatPhoneNumber('07060780922') // "0706 078 0922"
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  // Format Nigerian phone numbers (11 digits)
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  
  return phoneNumber
}

/**
 * Truncates a string to a specified length
 * 
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string with ellipsis
 * 
 * @example
 * truncateString('Long email address', 10) // "Long email..."
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str
  }
  
  return `${str.slice(0, maxLength)}...`
}

/**
 * Capitalizes the first letter of a string
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 * 
 * @example
 * capitalize('hello world') // "Hello world"
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Generates initials from a full name
 * 
 * @param fullName - Full name string
 * @returns Initials (up to 2 characters)
 * 
 * @example
 * getInitials('Grace Effiom') // "GE"
 */
export function getInitials(fullName: string): string {
  if (!fullName) return ''
  
  const names = fullName.trim().split(' ')
  
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase()
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

/**
 * Formats a large number with K/M/B suffixes
 * 
 * @param num - Number to format
 * @returns Formatted number string
 * 
 * @example
 * formatCompactNumber(2453) // "2.5K"
 * formatCompactNumber(1000000) // "1M"
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString()
  
  const suffixes = ['', 'K', 'M', 'B', 'T']
  const tier = Math.floor(Math.log10(Math.abs(num)) / 3)
  
  if (tier <= 0) return num.toString()
  
  const suffix = suffixes[tier]
  const scale = Math.pow(10, tier * 3)
  const scaled = num / scale
  
  return scaled.toFixed(1) + suffix
}

