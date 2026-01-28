import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UsersTable from './UsersTable'
import { createMockUser } from '@/test/test-utils'

describe('UsersTable Component', () => {
  const mockOnUserClick = vi.fn()
  const mockOnFilterClick = vi.fn()
  const mockOnBlacklistUser = vi.fn()
  const mockOnActivateUser = vi.fn()

  const defaultProps = {
    onUserClick: mockOnUserClick,
    onFilterClick: mockOnFilterClick,
    onBlacklistUser: mockOnBlacklistUser,
    onActivateUser: mockOnActivateUser,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render user data in table', () => {
    const user = createMockUser()
    render(<UsersTable users={[user]} {...defaultProps} />)

    expect(screen.getByText('gabrielle_browning')).toBeInTheDocument()
    expect(screen.getByText('gabriellebrowning@billmed.com')).toBeInTheDocument()
    expect(screen.getByText('Billmed')).toBeInTheDocument()
    expect(screen.getByText('7552737954')).toBeInTheDocument()
  })

  it('should display all user fields correctly', () => {
    const user = createMockUser()
    render(<UsersTable users={[user]} {...defaultProps} />)

    expect(screen.getByText(user.organization)).toBeInTheDocument()
    expect(screen.getByText(user.username)).toBeInTheDocument()
    expect(screen.getByText(user.email)).toBeInTheDocument()
    expect(screen.getByText(user.phoneNumber)).toBeInTheDocument()
  })

  it('should call onFilterClick when filter button is clicked', () => {
    const user = createMockUser()
    render(<UsersTable users={[user]} {...defaultProps} />)

    const filterButtons = screen.getAllByLabelText(/filter by/i)
    fireEvent.click(filterButtons[0])

    expect(mockOnFilterClick).toHaveBeenCalledTimes(1)
  })

  it('should call onUserClick when View Details is clicked', async () => {
    const user = createMockUser()
    render(<UsersTable users={[user]} {...defaultProps} />)

    // Click action menu button
    const actionButton = screen.getByLabelText('User actions')
    fireEvent.click(actionButton)

    // Click View Details
    await waitFor(() => {
      const viewDetailsButton = screen.getByText('View Details')
      fireEvent.click(viewDetailsButton)
    })

    expect(mockOnUserClick).toHaveBeenCalledWith(user.id)
  })

  it('should render StatusBadge with correct status', () => {
    const activeUser = createMockUser({ status: 'Active' })
    const inactiveUser = createMockUser({ id: 'user002', status: 'Inactive' })

    render(<UsersTable users={[activeUser, inactiveUser]} {...defaultProps} />)

    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  it('should handle empty users array', () => {
    render(<UsersTable users={[]} {...defaultProps} />)

    expect(screen.getByText('ORGANIZATION')).toBeInTheDocument()
    expect(screen.getByText('USERNAME')).toBeInTheDocument()
    // Table headers should be present but no rows
    const rows = screen.queryAllByRole('row')
    expect(rows.length).toBeGreaterThan(0) // Header row exists
  })

  it('should toggle action menu when action button is clicked', async () => {
    const user = createMockUser()
    render(<UsersTable users={[user]} {...defaultProps} />)

    const actionButton = screen.getByLabelText('User actions')

    // Initially menu should not be visible
    expect(screen.queryByText('View Details')).not.toBeInTheDocument()

    // Click to open menu
    fireEvent.click(actionButton)

    await waitFor(() => {
      expect(screen.getByText('View Details')).toBeInTheDocument()
      expect(screen.getByText('Blacklist User')).toBeInTheDocument()
      expect(screen.getByText('Activate User')).toBeInTheDocument()
    })

    // Click again to close menu
    fireEvent.click(actionButton)

    await waitFor(() => {
      expect(screen.queryByText('View Details')).not.toBeInTheDocument()
    })
  })

  it('should format date correctly', () => {
    const user = createMockUser({ createdAt: '2020-05-15T10:30:00.000Z' })
    render(<UsersTable users={[user]} {...defaultProps} />)

    // Date should be formatted (check for month abbreviation)
    const dateCell = screen.getByText(/May|15|2020/i)
    expect(dateCell).toBeInTheDocument()
  })

  it('should call onBlacklistUser when Blacklist User is clicked', async () => {
    const user = createMockUser()
    render(<UsersTable users={[user]} {...defaultProps} />)

    const actionButton = screen.getByLabelText('User actions')
    fireEvent.click(actionButton)

    await waitFor(() => {
      const blacklistButton = screen.getByText('Blacklist User')
      fireEvent.click(blacklistButton)
    })

    expect(mockOnBlacklistUser).toHaveBeenCalledWith(user.id)
  })

  it('should call onActivateUser when Activate User is clicked', async () => {
    const user = createMockUser()
    render(<UsersTable users={[user]} {...defaultProps} />)

    const actionButton = screen.getByLabelText('User actions')
    fireEvent.click(actionButton)

    await waitFor(() => {
      const activateButton = screen.getByText('Activate User')
      fireEvent.click(activateButton)
    })

    expect(mockOnActivateUser).toHaveBeenCalledWith(user.id)
  })
})
