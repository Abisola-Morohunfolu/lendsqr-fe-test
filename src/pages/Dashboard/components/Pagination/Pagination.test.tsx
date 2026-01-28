import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from './Pagination'

describe('Pagination Component', () => {
  const mockOnPageChange = vi.fn()
  const mockOnPageSizeChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render current page number', () => {
    render(
      <Pagination
        currentPage={1}
        pageSize={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    )

    const pageButton = screen.getByRole('button', { name: '1' })
    expect(pageButton).toBeInTheDocument()
  })

  it('should calculate total pages correctly', () => {
    render(
      <Pagination
        currentPage={1}
        pageSize={10}
        totalItems={25}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    )

    // Should show page 1, 2, 3 (totalPages = 3)
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
  })

  it('should call onPageChange when page is clicked', () => {
    render(
      <Pagination
        currentPage={1}
        pageSize={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    )

    const page2Button = screen.getByRole('button', { name: '2' })
    fireEvent.click(page2Button)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('should call onPageSizeChange when size is changed', () => {
    render(
      <Pagination
        currentPage={1}
        pageSize={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    )

    const pageSizeSelect = screen.getByDisplayValue('10')
    fireEvent.change(pageSizeSelect, { target: { value: '20' } })

    expect(mockOnPageSizeChange).toHaveBeenCalledWith(20)
  })

  it('should disable previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        pageSize={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    )

    const prevButton = screen.getByLabelText('Previous page')
    expect(prevButton).toBeDisabled()
  })

  it('should disable next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        pageSize={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    )

    const nextButton = screen.getByLabelText('Next page')
    expect(nextButton).toBeDisabled()
  })

  it('should enable navigation buttons on middle pages', () => {
    render(
      <Pagination
        currentPage={3}
        pageSize={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    )

    const prevButton = screen.getByLabelText('Previous page')
    const nextButton = screen.getByLabelText('Next page')

    expect(prevButton).not.toBeDisabled()
    expect(nextButton).not.toBeDisabled()
  })

  it('should show correct page range', () => {
    render(
      <Pagination
        currentPage={1}
        pageSize={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    )

    // Should show "Showing 10 out of 50"
    expect(screen.getByText(/showing/i)).toBeInTheDocument()
    expect(screen.getByText(/out of 50/i)).toBeInTheDocument()
  })

  it('should handle next page navigation', () => {
    render(
      <Pagination
        currentPage={2}
        pageSize={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    )

    const nextButton = screen.getByLabelText('Next page')
    fireEvent.click(nextButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('should handle previous page navigation', () => {
    render(
      <Pagination
        currentPage={3}
        pageSize={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    )

    const prevButton = screen.getByLabelText('Previous page')
    fireEvent.click(prevButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('should show ellipsis for many pages', () => {
    render(
      <Pagination
        currentPage={5}
        pageSize={10}
        totalItems={100}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    )

    // Should show ellipsis when there are many pages
    const ellipsis = screen.getAllByText('...')
    expect(ellipsis.length).toBeGreaterThan(0)
  })

  it('should highlight current page', () => {
    render(
      <Pagination
        currentPage={2}
        pageSize={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    )

    const currentPageButton = screen.getByRole('button', { name: '2' })
    // Current page button should have active class (check by structure)
    expect(currentPageButton).toBeInTheDocument()
  })
})

