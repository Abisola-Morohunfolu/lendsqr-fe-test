import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FilterPopup from './FilterPopup'

describe('FilterPopup Component', () => {
  const mockOnFilter = vi.fn()
  const mockOnReset = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all filter inputs', () => {
    render(
      <FilterPopup
        onFilter={mockOnFilter}
        onReset={mockOnReset}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByLabelText('Organization')).toBeInTheDocument()
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
  })

  it('should submit filters with correct values', async () => {
    render(
      <FilterPopup
        onFilter={mockOnFilter}
        onReset={mockOnReset}
        onClose={mockOnClose}
      />
    )

    // Fill in filters
    const orgSelect = screen.getByLabelText('Organization')
    fireEvent.change(orgSelect, { target: { value: 'Lendsqr' } })

    const usernameInput = screen.getByLabelText('Username')
    fireEvent.change(usernameInput, { target: { value: 'grace' } })

    const emailInput = screen.getByLabelText('Email')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    const statusSelect = screen.getByLabelText('Status')
    fireEvent.change(statusSelect, { target: { value: 'Active' } })

    // Submit form
    const filterButton = screen.getByRole('button', { name: /filter/i })
    fireEvent.click(filterButton)

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith({
        organization: 'Lendsqr',
        username: 'grace',
        email: 'test@example.com',
        status: 'Active',
      })
    })
  })

  it('should reset filters to empty', async () => {
    render(
      <FilterPopup
        onFilter={mockOnFilter}
        onReset={mockOnReset}
        onClose={mockOnClose}
      />
    )

    // Fill in some filters
    const orgSelect = screen.getByLabelText('Organization')
    fireEvent.change(orgSelect, { target: { value: 'Lendsqr' } })

    const usernameInput = screen.getByLabelText('Username')
    fireEvent.change(usernameInput, { target: { value: 'grace' } })

    // Reset filters
    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    await waitFor(() => {
      expect(mockOnReset).toHaveBeenCalledTimes(1)
    })

    // Verify inputs are cleared
    expect(orgSelect).toHaveValue('')
    expect(usernameInput).toHaveValue('')
  })

  it('should close popup on backdrop click', () => {
    const { container } = render(
      <FilterPopup
        onFilter={mockOnFilter}
        onReset={mockOnReset}
        onClose={mockOnClose}
      />
    )

    // Find backdrop div (it's the first child div)
    const backdrop = container.firstChild as HTMLElement
    if (backdrop) {
      fireEvent.click(backdrop)
      expect(mockOnClose).toHaveBeenCalled()
    }
  })

  it('should handle date input format', async () => {
    render(
      <FilterPopup
        onFilter={mockOnFilter}
        onReset={mockOnReset}
        onClose={mockOnClose}
      />
    )

    const dateInput = screen.getByLabelText('Date') as HTMLInputElement
    fireEvent.change(dateInput, { target: { value: '2020-05-15' } })

    const filterButton = screen.getByRole('button', { name: /filter/i })
    fireEvent.click(filterButton)

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith({
        date: '2020-05-15',
      })
    })
  })

  it('should handle empty filter values', async () => {
    render(
      <FilterPopup
        onFilter={mockOnFilter}
        onReset={mockOnReset}
        onClose={mockOnClose}
      />
    )

    // Submit without filling any filters
    const filterButton = screen.getByRole('button', { name: /filter/i })
    fireEvent.click(filterButton)

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith({})
    })
  })

  it('should have all status options in status select', () => {
    render(
      <FilterPopup
        onFilter={mockOnFilter}
        onReset={mockOnReset}
        onClose={mockOnClose}
      />
    )

    const statusSelect = screen.getByLabelText('Status')
    const options = Array.from(statusSelect.querySelectorAll('option')).map(
      opt => opt.textContent
    )

    expect(options).toContain('Select')
    expect(options).toContain('Active')
    expect(options).toContain('Inactive')
    expect(options).toContain('Pending')
    expect(options).toContain('Blacklisted')
  })
})

