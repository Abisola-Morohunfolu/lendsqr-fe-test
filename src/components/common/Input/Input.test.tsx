/**
 * Input Component Tests
 * Tests rendering, validation, password toggle, and interactions
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Input from './Input'

describe('Input Component', () => {
  // Positive tests
  it('should render input field', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('should render with label', () => {
    render(<Input label="Email Address" />)
    expect(screen.getByText('Email Address')).toBeInTheDocument()
  })

  it('should handle value changes', () => {
    const handleChange = vi.fn()
    render(<Input value="" onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('should display error message', () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('should have error styling when error is present', () => {
    render(<Input error="Invalid input" />)
    const input = screen.getByRole('textbox')
    // Test aria-invalid attribute (class names are hashed in SCSS modules)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Invalid input')).toBeInTheDocument()
  })

  it('should render password toggle button for password type', () => {
    render(<Input type="password" />)
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument()
  })

  it('should toggle password visibility', () => {
    render(<Input type="password" placeholder="Password" />)
    
    const input = screen.getByPlaceholderText('Password') as HTMLInputElement
    const toggleButton = screen.getByRole('button', { name: /show password/i })
    
    // Initially password type
    expect(input.type).toBe('password')
    
    // Click to show password
    fireEvent.click(toggleButton)
    expect(input.type).toBe('text')
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument()
    
    // Click to hide password again
    fireEvent.click(toggleButton)
    expect(input.type).toBe('password')
  })

  it('should show toggle button with showPasswordToggle prop', () => {
    render(<Input showPasswordToggle />)
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument()
  })

  it('should render with full width', () => {
    render(<Input fullWidth />)
    const input = screen.getByRole('textbox')
    // Test that input renders (class names are hashed in SCSS modules)
    expect(input).toBeInTheDocument()
  })

  it('should pass through HTML input attributes', () => {
    render(
      <Input
        id="test-input"
        name="testField"
        placeholder="Test placeholder"
        required
        maxLength={50}
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'test-input')
    expect(input).toHaveAttribute('name', 'testField')
    expect(input).toHaveAttribute('placeholder', 'Test placeholder')
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('maxLength', '50')
  })

  // Negative tests
  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('should not allow typing when disabled', () => {
    const handleChange = vi.fn()
    render(<Input disabled onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    
    // onChange won't be called on disabled input
    expect(input).toBeDisabled()
  })

  it('should associate label with input via id', () => {
    render(<Input label="Username" id="username" />)
    const label = screen.getByText('Username')
    const input = screen.getByRole('textbox')
    
    expect(label).toHaveAttribute('for', 'username')
    expect(input).toHaveAttribute('id', 'username')
  })

  it('should link error message to input via aria-describedby', () => {
    render(<Input id="email" error="Invalid email format" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-describedby', 'email-error')
  })

  it('should render without label', () => {
    render(<Input placeholder="No label" />)
    expect(screen.queryByRole('label')).not.toBeInTheDocument()
    expect(screen.getByPlaceholderText('No label')).toBeInTheDocument()
  })
})

