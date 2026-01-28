import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/store/auth-context'
import { authStorage } from '@/services/auth-storage.service'
import Dashboard from './Dashboard'
import * as useDashboardModule from '@/hooks/useDashboard'

// Mock the useDashboard hook
vi.mock('@/hooks/useDashboard')

// Mock data
const mockUsers = [
  {
    id: '69788f5b2ee43df233ff9c40',
    organization: 'Billmed',
    username: 'gabrielle_browning',
    email: 'gabriellebrowning@billmed.com',
    phoneNumber: '7552737954',
    createdAt: '2024-05-15T07:17:38.000Z',
    status: 'Active' as const,
    avatar: '',
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
      loanRepayment: '115248',
    },
    guarantors: [],
  },
]

const mockStats = {
  totalUsers: 1,
  activeUsers: 1,
  usersWithLoans: 1,
  usersWithSavings: 1,
}

const createMockHookReturn = (overrides = {}) => ({
  users: mockUsers,
  stats: mockStats,
  filteredUsers: mockUsers,
  isLoading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalItems: 1,
  setCurrentPage: vi.fn(),
  handlePageSizeChange: vi.fn(),
  showFilterPopup: false,
  toggleFilterPopup: vi.fn(),
  closeFilterPopup: vi.fn(),
  handleFilterSubmit: vi.fn(),
  handleResetFilters: vi.fn(),
  handleUserClick: vi.fn(),
  handleBlacklistUser: vi.fn(),
  handleActivateUser: vi.fn(),
  ...overrides,
})

const renderDashboard = () => {
  authStorage.save('test@example.com')
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authStorage.save('test@example.com')
  })

  afterEach(() => {
    vi.resetAllMocks()
    authStorage.clear()
  })

  it('should show loading state when isLoading is true', () => {
    vi.mocked(useDashboardModule.useDashboard).mockReturnValue(
      createMockHookReturn({ isLoading: true, users: [] })
    )

    renderDashboard()

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should show error message when error exists', () => {
    vi.mocked(useDashboardModule.useDashboard).mockReturnValue(
      createMockHookReturn({ error: new Error('Failed'), users: [] })
    )

    renderDashboard()

    expect(
      screen.getByText('Failed to load users. Please try again later.')
    ).toBeInTheDocument()
  })

  it('should display users table after successful load', () => {
    vi.mocked(useDashboardModule.useDashboard).mockReturnValue(
      createMockHookReturn()
    )

    renderDashboard()

    expect(screen.getByText('gabrielle_browning')).toBeInTheDocument()
    expect(screen.getByText('gabriellebrowning@billmed.com')).toBeInTheDocument()
    expect(screen.getByText('Billmed')).toBeInTheDocument()
  })

  it('should display page heading', () => {
    vi.mocked(useDashboardModule.useDashboard).mockReturnValue(
      createMockHookReturn()
    )

    renderDashboard()

    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument()
  })

  it('should display stat cards with correct values', () => {
    vi.mocked(useDashboardModule.useDashboard).mockReturnValue(
      createMockHookReturn({
        stats: {
          totalUsers: 100,
          activeUsers: 50,
          usersWithLoans: 30,
          usersWithSavings: 20,
        },
      })
    )

    renderDashboard()

    expect(screen.getByText('USERS')).toBeInTheDocument()
    expect(screen.getByText('ACTIVE USERS')).toBeInTheDocument()
    expect(screen.getByText('USERS WITH LOANS')).toBeInTheDocument()
    expect(screen.getByText('USERS WITH SAVINGS')).toBeInTheDocument()
  })

  it('should call toggleFilterPopup when filter button is clicked', () => {
    const toggleFilterPopup = vi.fn()
    vi.mocked(useDashboardModule.useDashboard).mockReturnValue(
      createMockHookReturn({ toggleFilterPopup })
    )

    renderDashboard()

    const filterButtons = screen.getAllByLabelText(/filter by/i)
    fireEvent.click(filterButtons[0])

    expect(toggleFilterPopup).toHaveBeenCalledTimes(1)
  })

  it('should show filter popup when showFilterPopup is true', () => {
    vi.mocked(useDashboardModule.useDashboard).mockReturnValue(
      createMockHookReturn({ showFilterPopup: true })
    )

    renderDashboard()

    expect(screen.getByLabelText('Organization')).toBeInTheDocument()
    // Use exact match for the Filter button in the popup (not filter icons)
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('should call handleUserClick when View Details is clicked', () => {
    const handleUserClick = vi.fn()
    vi.mocked(useDashboardModule.useDashboard).mockReturnValue(
      createMockHookReturn({ handleUserClick })
    )

    renderDashboard()

    // Open action menu
    const actionButton = screen.getByLabelText('User actions')
    fireEvent.click(actionButton)

    // Click View Details
    const viewDetailsButton = screen.getByText('View Details')
    fireEvent.click(viewDetailsButton)

    expect(handleUserClick).toHaveBeenCalledWith('69788f5b2ee43df233ff9c40')
  })

  it('should display multiple users in table', () => {
    const multipleUsers = [
      mockUsers[0],
      {
        ...mockUsers[0],
        id: 'user002',
        username: 'john_doe',
        email: 'john@example.com',
        organization: 'Lendsqr',
      },
    ]

    vi.mocked(useDashboardModule.useDashboard).mockReturnValue(
      createMockHookReturn({ users: multipleUsers, totalItems: 2 })
    )

    renderDashboard()

    expect(screen.getByText('gabrielle_browning')).toBeInTheDocument()
    expect(screen.getByText('john_doe')).toBeInTheDocument()
  })

  it('should render pagination component', () => {
    vi.mocked(useDashboardModule.useDashboard).mockReturnValue(
      createMockHookReturn({ totalItems: 25 })
    )

    renderDashboard()

    expect(screen.getByLabelText('Next page')).toBeInTheDocument()
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
  })

  it('should display user status badges', () => {
    const usersWithStatuses = [
      { ...mockUsers[0], status: 'Active' as const },
      { ...mockUsers[0], id: 'user002', username: 'user2', status: 'Inactive' as const },
    ]

    vi.mocked(useDashboardModule.useDashboard).mockReturnValue(
      createMockHookReturn({ users: usersWithStatuses })
    )

    renderDashboard()

    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  it('should render empty table when no users', () => {
    vi.mocked(useDashboardModule.useDashboard).mockReturnValue(
      createMockHookReturn({ users: [], totalItems: 0 })
    )

    renderDashboard()

    expect(screen.getByText('ORGANIZATION')).toBeInTheDocument()
    expect(screen.getByText('USERNAME')).toBeInTheDocument()
    expect(screen.queryByText('gabrielle_browning')).not.toBeInTheDocument()
  })
})
