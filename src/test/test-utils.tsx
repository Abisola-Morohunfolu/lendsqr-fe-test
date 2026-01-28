/**
 * Test Utilities
 * Shared helper functions for rendering components with providers
 */

import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/store/auth-context'
import type { IUser } from '@/types/user.types'

/**
 * Creates a test QueryClient with retry disabled for faster tests
 */
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  })

/**
 * Renders component with Router provider
 */
export function renderWithRouter(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    ...options,
  })
}

/**
 * Renders component with QueryClient provider
 */
export function renderWithQueryClient(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const queryClient = createTestQueryClient()
  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    ...options,
  })
}

/**
 * Renders component with Auth provider
 */
export function renderWithAuth(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    ...options,
  })
}

/**
 * Renders component with all providers (Router, QueryClient, Auth)
 */
export function renderWithAllProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const queryClient = createTestQueryClient()
  return render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    ),
    ...options,
  })
}

/**
 * Mock user data factory
 * Creates mock user objects for testing
 */
export function createMockUser(overrides?: Partial<IUser>): IUser {
  const baseUser: IUser = {
    id: '69788f5b2ee43df233ff9c40',
    organization: 'Billmed',
    username: 'gabrielle_browning',
    email: 'gabriellebrowning@billmed.com',
    phoneNumber: '7552737954',
    createdAt: '2024-05-FridayT07:17:38.SSS-01:00',
    status: 'Inactive',
    avatar: 'https://i.pravatar.cc/150?u=gabriellebrowning@billmed.com',
    fullName: 'Gabrielle Browning',
    userTier: 2,
    accountBalance: '38149.17',
    accountBank: 'GTBank',
    accountNumber: '5050190115',
    bvn: '1354110296',
    personalInfo: {
      gender: 'Female',
      maritalStatus: 'Single',
      children: '4',
      typeOfResidence: 'Personal Property',
      email: 'gabrielle@gmail.com',
      facebook: 'gabrielle_browning',
      twitter: '@gabrielle_browning',
      instagram: '@gabrielle_browning',
    },
    educationAndEmployment: {
      levelOfEducation: 'MSc',
      employmentStatus: 'Employed',
      sectorOfEmployment: 'Commerce',
      durationOfEmployment: '1 years',
      officeEmail: 'gabriellebrowning@billmed.com',
      monthlyIncome: 'N100,000 - N200,000',
      loanRepayment: '115,248',
    },
    guarantors: [
      {
        fullName: 'Wilder Obrien',
        phoneNumber: '8663155662',
        relationship: 'Colleague',
      },
      {
        fullName: 'Johanna Bowen',
        phoneNumber: '8797819254',
        relationship: 'Sibling',
      },
    ],
  }

  return { ...baseUser, ...overrides }
}

/**
 * Creates an array of mock users
 */
export function createMockUsers(count: number, overrides?: Partial<IUser>[]): IUser[] {
  return Array.from({ length: count }, (_, index) =>
    createMockUser({
      id: `user${String(index + 1).padStart(3, '0')}`,
      username: `user${index + 1}`,
      email: `user${index + 1}@example.com`,
      ...(overrides?.[index] || {}),
    })
  )
}
