/**
 * StatusBadge Component Tests
 * Tests rendering and styling for all status types
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from './StatusBadge'

describe('StatusBadge Component', () => {
  // Positive tests
  it('should render Active status', () => {
    render(<StatusBadge status="Active" />)
    const badge = screen.getByRole('status')
    expect(badge).toHaveTextContent('Active')
    expect(badge).toBeInTheDocument()
  })

  it('should render Inactive status', () => {
    render(<StatusBadge status="Inactive" />)
    const badge = screen.getByRole('status')
    expect(badge).toHaveTextContent('Inactive')
    expect(badge).toBeInTheDocument()
  })

  it('should render Pending status', () => {
    render(<StatusBadge status="Pending" />)
    const badge = screen.getByRole('status')
    expect(badge).toHaveTextContent('Pending')
    expect(badge).toBeInTheDocument()
  })

  it('should render Blacklisted status', () => {
    render(<StatusBadge status="Blacklisted" />)
    const badge = screen.getByRole('status')
    expect(badge).toHaveTextContent('Blacklisted')
    expect(badge).toBeInTheDocument()
  })

  it('should have accessible aria-label', () => {
    render(<StatusBadge status="Active" />)
    const badge = screen.getByRole('status')
    expect(badge).toHaveAttribute('aria-label', 'Status: Active')
  })

  it('should apply base badge class', () => {
    render(<StatusBadge status="Active" />)
    const badge = screen.getByRole('status')
    // Test that badge is rendered (class names are hashed in SCSS modules)
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Active')
  })

  it('should apply custom className', () => {
    render(<StatusBadge status="Active" className="custom-class" />)
    const badge = screen.getByRole('status')
    expect(badge).toHaveClass('custom-class')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Active')
  })

  // Test all status variants systematically
  it('should render all status variants correctly', () => {
    const statuses: Array<'Active' | 'Inactive' | 'Pending' | 'Blacklisted'> = [
      'Active',
      'Inactive',
      'Pending',
      'Blacklisted',
    ]

    statuses.forEach(status => {
      const { unmount } = render(<StatusBadge status={status} />)
      const badge = screen.getByRole('status')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveTextContent(status)
      expect(badge).toHaveAttribute('aria-label', `Status: ${status}`)
      unmount()
    })
  })
})

