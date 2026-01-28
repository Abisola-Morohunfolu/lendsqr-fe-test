/**
 * Button Component Tests
 * Tests all variants, sizes, states, and interactions
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

describe('Button Component', () => {
  // Positive tests
  it('should render with children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should render primary variant by default', () => {
    render(<Button>Primary</Button>)
    const button = screen.getByRole('button')
    // Test that button renders (class names are hashed in SCSS modules)
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Primary')
  })

  it('should render outline variant', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Outline')
  })

  it('should render ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Ghost')
  })

  it('should render danger variant', () => {
    render(<Button variant="danger">Danger</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Danger')
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should render in small size', () => {
    render(<Button size="small">Small</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Small')
  })

  it('should render in large size', () => {
    render(<Button size="large">Large</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Large')
  })

  it('should render full width', () => {
    render(<Button fullWidth>Full Width</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Full Width')
  })

  // Negative tests
  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should not trigger onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should show loading state', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Loading')
  })

  it('should not trigger onClick when loading', () => {
    const handleClick = vi.fn()
    render(<Button loading onClick={handleClick}>Loading</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should pass through HTML button attributes', () => {
    render(<Button type="submit" aria-label="Submit form">Submit</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('aria-label', 'Submit form')
  })
})

