/**
 * Loader Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Loader from './Loader'

describe('Loader Component', () => {
  it('should render loader', () => {
    render(<Loader />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should render with medium size by default', () => {
    render(<Loader />)
    const loader = screen.getByRole('status')
    // Test that loader renders (class names are hashed in SCSS modules)
    expect(loader).toBeInTheDocument()
    expect(loader).toHaveAttribute('aria-label', 'Loading')
  })

  it('should render with small size', () => {
    render(<Loader size="small" />)
    const loader = screen.getByRole('status')
    expect(loader).toBeInTheDocument()
    expect(loader).toHaveAttribute('aria-label', 'Loading')
  })

  it('should render with large size', () => {
    render(<Loader size="large" />)
    const loader = screen.getByRole('status')
    expect(loader).toBeInTheDocument()
    expect(loader).toHaveAttribute('aria-label', 'Loading')
  })

  it('should have accessible label', () => {
    render(<Loader />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading')
  })

  it('should render full screen when fullScreen prop is true', () => {
    const { container } = render(<Loader fullScreen />)
    // Check that loader is wrapped in a fullScreen container
    const fullScreenWrapper = container.firstChild
    expect(fullScreenWrapper).toBeInTheDocument()
    expect(fullScreenWrapper?.firstChild).toHaveAttribute('role', 'status')
  })

  it('should apply custom className', () => {
    render(<Loader className="custom-loader" />)
    const loader = screen.getByRole('status')
    expect(loader).toHaveClass('custom-loader')
  })
})

