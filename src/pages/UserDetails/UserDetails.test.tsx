import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/store/auth-context'
import { authStorage } from '@/services/auth-storage.service'
import UserDetails from './UserDetails'
import * as userService from '@/services/user.service'

// Mock user service
vi.mock('@/services/user.service')

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockUser = {
  id: '69788f5b2ee43df233ff9c40',
  organization: 'Billmed',
  username: 'gabrielle_browning',
  email: 'gabriellebrowning@billmed.com',
  phoneNumber: '7552737954',
  createdAt: '2024-05-FridayT07:17:38.SSS-01:00',
  status: 'Inactive' as const,
  avatar: 'https://i.pravatar.cc/150?u=gabriellebrowning@billmed.com',
  fullName: 'Gabrielle Browning',
  userTier: 2 as const,
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

const renderWithProviders = (userId: string = '69788f5b2ee43df233ff9c40') => {
  authStorage.save('test@example.com')
  const queryClient = createTestQueryClient()

  return render(
    <MemoryRouter initialEntries={[`/users/${userId}`]}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/users/:userId" element={<UserDetails />} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  )
}

// Helper to wait for component to load
const waitForUserDetails = async () => {
  await waitFor(
    () => {
      expect(screen.getAllByText('Gabrielle Browning').length).toBeGreaterThan(0)
    },
    { timeout: 3000 }
  )
}

describe('UserDetails Page', () => {
  beforeEach(() => {
    localStorage.clear()
    authStorage.save('test@example.com')
    mockNavigate.mockClear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should display user details after successful fetch', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser)

    renderWithProviders()

    await waitForUserDetails()

    expect(screen.getAllByText('Gabrielle Browning').length).toBeGreaterThan(0)
    expect(screen.getByText('69788f5b2ee43df233ff9c40')).toBeInTheDocument()
    // Account balance is formatted with toLocaleString
    expect(screen.getByText(/₦38[,.]?149/)).toBeInTheDocument()
  })

  it('should display personal information section', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser)

    renderWithProviders()

    await waitForUserDetails()

    expect(screen.getByText('Personal Information')).toBeInTheDocument()
    expect(screen.getByText('gabrielle@gmail.com')).toBeInTheDocument()
    expect(screen.getByText('Female')).toBeInTheDocument()
  })

  it('should display guarantor information', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser)

    renderWithProviders()

    await waitForUserDetails()

    expect(screen.getByText('Guarantor 1')).toBeInTheDocument()
    expect(screen.getByText('Wilder Obrien')).toBeInTheDocument()
    expect(screen.getByText('Colleague')).toBeInTheDocument()
  })

  it('should show error message on fetch failure', async () => {
    vi.mocked(userService.getUserById).mockRejectedValue(new Error('Failed to fetch'))

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Failed to load user details')).toBeInTheDocument()
    })
  })

  it('should switch tabs correctly', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser)

    renderWithProviders()

    await waitForUserDetails()

    expect(screen.getByText('Personal Information')).toBeInTheDocument()

    // Click on Documents tab
    const documentsTab = screen.getByText('Documents')
    fireEvent.click(documentsTab)

    await waitFor(() => {
      expect(screen.getByText(/Documents coming soon/i)).toBeInTheDocument()
    })

    // Click on Bank Details tab
    const bankTab = screen.getByText('Bank Details')
    fireEvent.click(bankTab)

    await waitFor(() => {
      expect(screen.getByText('Bank Information')).toBeInTheDocument()
      expect(screen.getByText('GTBank')).toBeInTheDocument()
    })
  })

  it('should navigate back when back button is clicked', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser)

    renderWithProviders()

    await waitForUserDetails()

    const backButtons = screen.getAllByText('Back to Users')
    fireEvent.click(backButtons[0])

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })

  it('should call getUserById with correct userId', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser)

    renderWithProviders('69788f5b2ee43df233ff9c40')

    await waitForUserDetails()

    expect(userService.getUserById).toHaveBeenCalledWith('69788f5b2ee43df233ff9c40')
  })

  it('should display multiple guarantors', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser)

    renderWithProviders()

    await waitForUserDetails()

    expect(screen.getByText('Guarantor 1')).toBeInTheDocument()
    expect(screen.getByText('Guarantor 2')).toBeInTheDocument()
    expect(screen.getByText('Wilder Obrien')).toBeInTheDocument()
    expect(screen.getByText('Johanna Bowen')).toBeInTheDocument()
  })

  it('should handle missing userId parameter', async () => {
    authStorage.clear()

    const queryClient = createTestQueryClient()

    render(
      <MemoryRouter initialEntries={['/users']}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              <Route path="/users/:userId" element={<UserDetails />} />
              <Route path="/users" element={<UserDetails />} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    )

    await waitFor(
      () => {
        const errorMessage = screen.queryByText('User ID not provided')
        const loginPage = screen.queryByText('Login Page')
        expect(errorMessage || loginPage).toBeTruthy()
      },
      { timeout: 3000 }
    )
  })

  it('should display action buttons', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser)

    renderWithProviders()

    await waitForUserDetails()

    const blacklistButton = screen.getByRole('button', { name: /blacklist user/i })
    const activateButton = screen.getByRole('button', { name: /activate user/i })

    expect(blacklistButton).toBeInTheDocument()
    expect(activateButton).toBeInTheDocument()
  })

  it('should blacklist user when blacklist button is clicked', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser)

    renderWithProviders()

    await waitForUserDetails()

    const blacklistButton = screen.getByRole('button', { name: /blacklist user/i })
    fireEvent.click(blacklistButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /blacklisted/i })).toBeDisabled()
    })
  })

  it('should activate user when activate button is clicked', async () => {
    const blacklistedUser = { ...mockUser, status: 'Blacklisted' as const }
    vi.mocked(userService.getUserById).mockResolvedValue(blacklistedUser)

    renderWithProviders()

    await waitForUserDetails()

    const activateButton = screen.getByRole('button', { name: /activate user/i })
    fireEvent.click(activateButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^active$/i })).toBeDisabled()
    })
  })

  it('should display all tab options', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser)

    renderWithProviders()

    await waitForUserDetails()

    expect(screen.getByText('General Details')).toBeInTheDocument()
    expect(screen.getByText('Documents')).toBeInTheDocument()
    expect(screen.getByText('Bank Details')).toBeInTheDocument()
    expect(screen.getAllByText('Loans').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Savings').length).toBeGreaterThan(0)
    expect(screen.getByText('App and System')).toBeInTheDocument()
  })

  it('should show general details by default', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser)

    renderWithProviders()

    await waitForUserDetails()

    expect(screen.getByText('Personal Information')).toBeInTheDocument()
    expect(screen.getByText('Education and Employment')).toBeInTheDocument()
    expect(screen.getByText('Socials')).toBeInTheDocument()
  })

  it('should display education and employment information', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser)

    renderWithProviders()

    await waitForUserDetails()

    expect(screen.getByText('MSc')).toBeInTheDocument()
    expect(screen.getByText('Employed')).toBeInTheDocument()
    expect(screen.getByText('Commerce')).toBeInTheDocument()
    expect(screen.getByText('115,248')).toBeInTheDocument()
  })

  it('should display social information', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser)

    renderWithProviders()

    await waitForUserDetails()

    // @gabrielle_browning appears in both twitter and instagram
    expect(screen.getAllByText('@gabrielle_browning').length).toBeGreaterThan(0)
    // gabrielle_browning appears in facebook
    expect(screen.getAllByText('gabrielle_browning').length).toBeGreaterThan(0)
  })

  it('should display guarantor email when provided', async () => {
    const userWithGuarantorEmail = {
      ...mockUser,
      guarantors: [
        {
          fullName: 'Wilder Obrien',
          phoneNumber: '8663155662',
          email: 'wilder@example.com',
          relationship: 'Colleague',
        },
      ],
    }

    vi.mocked(userService.getUserById).mockResolvedValue(userWithGuarantorEmail)

    renderWithProviders()

    await waitForUserDetails()

    expect(screen.getByText('wilder@example.com')).toBeInTheDocument()
  })
})
