/**
 * User-related TypeScript interfaces
 * Based on Figma design and API schema requirements
 */

/**
 * User status enum for status badge rendering
 */
export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Blacklisted'

/**
 * User tier level (1-3 stars)
 */
export type UserTier = 1 | 2 | 3

/**
 * Guarantor information
 */
export interface IGuarantor {
  fullName: string
  phoneNumber: string
  email?: string
  relationship: string
}

/**
 * Education and employment details
 */
export interface IEducationAndEmployment {
  levelOfEducation: string
  employmentStatus: string
  sectorOfEmployment: string
  durationOfEmployment: string
  officeEmail: string
  monthlyIncome: string // e.g., "N200,000.00 - N400,000.00"
  loanRepayment: string // e.g., "40,000"
}

/**
 * Personal information section
 */
export interface IPersonalInfo {
  gender: string
  maritalStatus: string
  children: string // e.g., "None", "2"
  typeOfResidence: string
  email: string
  facebook: string
  twitter: string
  instagram: string
}

/**
 * Main User interface
 * Represents complete user data from API
 */
export interface IUser {
  // Core identifiers
  id: string // e.g., "L5QFFB7G90"
  organization: string // e.g., "Lendsqr"
  username: string // e.g., "adedeji"
  
  // Contact information
  email: string
  phoneNumber: string
  
  // Status and metadata
  dateJoined: string // ISO date string
  status: UserStatus
  avatar: string // URL to avatar image
  
  // User details header
  fullName: string // e.g., "Grace Effiom"
  userTier: UserTier
  
  // Financial information
  accountBalance: string // e.g., "200,000.00"
  accountBank: string // e.g., "Providus Bank"
  accountNumber: string // e.g., "9912345678"
  bvn: string
  
  // Nested detailed information
  personalInfo: IPersonalInfo
  educationAndEmployment: IEducationAndEmployment
  guarantors: IGuarantor[] // Array of 1-2 guarantors
}

/**
 * Filter parameters for users table
 */
export interface IUserFilters {
  organization?: string
  username?: string
  email?: string
  date?: string
  phoneNumber?: string
  status?: UserStatus
}

/**
 * Pagination parameters
 */
export interface IPagination {
  page: number
  pageSize: number
  total: number
}

/**
 * API response wrapper for users list
 */
export interface IUsersResponse {
  users: IUser[]
  pagination: IPagination
}

