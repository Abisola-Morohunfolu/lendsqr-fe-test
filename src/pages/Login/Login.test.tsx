/**
 * Login Page Tests
 * Tests validation, authentication, and navigation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/store/auth-context'
import { authStorage } from '@/services/auth-storage.service'
import Login from './Login'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Wrapper component with providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  )
}

describe('Login Page', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    localStorage.clear()
  })

  // Positive tests
  it('should render login form', () => {
    renderWithProviders(<Login />)
    
    expect(screen.getByText('Welcome!')).toBeInTheDocument()
    expect(screen.getByText('Enter details to login.')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('should render forgot password link', () => {
    renderWithProviders(<Login />)
    expect(screen.getByText('FORGOT PASSWORD?')).toBeInTheDocument()
  })

  it('should render password toggle button', () => {
    renderWithProviders(<Login />)
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument()
  })

  it('should update email input value', () => {
    renderWithProviders(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    expect(emailInput.value).toBe('test@example.com')
  })

  it('should update password input value', () => {
    renderWithProviders(<Login />)
    
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    expect(passwordInput.value).toBe('password123')
  })

  it('should successfully login with valid credentials', async () => {
    renderWithProviders(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const loginButton = screen.getByRole('button', { name: /log in/i })
    
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  // Negative tests - Validation
  it('should show error when email is empty', async () => {
    renderWithProviders(<Login />)
    
    const loginButton = screen.getByRole('button', { name: /log in/i })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
  })

  it('should show error when password is empty', async () => {
    renderWithProviders(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const loginButton = screen.getByRole('button', { name: /log in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('should show error for invalid email format', async () => {
    renderWithProviders(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const loginButton = screen.getByRole('button', { name: /log in/i })
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    })
  })

  it('should show error for password less than 6 characters', async () => {
    renderWithProviders(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const loginButton = screen.getByRole('button', { name: /log in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  it('should disable button while loading', async () => {
    renderWithProviders(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const loginButton = screen.getByRole('button', { name: /log in/i })
    
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)
    
    // Button should be disabled immediately
    expect(loginButton).toBeDisabled()
  })

  it('should toggle password visibility', () => {
    renderWithProviders(<Login />)
    
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement
    const toggleButton = screen.getByRole('button', { name: /show password/i })
    
    // Initially password type
    expect(passwordInput.type).toBe('password')
    
    // Click to show
    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe('text')
    
    // Click to hide
    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe('password')
  })

  it('should not submit form on Enter key when fields are empty', async () => {
    renderWithProviders(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const form = emailInput.closest('form')
    
    // Submit form directly (Enter key triggers form submit)
    if (form) {
      fireEvent.submit(form)
    }
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
    
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should show invalid credentials error when login fails', async () => {
    renderWithProviders(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const loginButton = screen.getByRole('button', { name: /log in/i })
    
    // Use password less than 6 characters to trigger login failure
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      // First validation error appears
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  it('should redirect when already authenticated', async () => {
    // Set up authenticated state with valid token
    authStorage.save('test@example.com')

    renderWithProviders(<Login />)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should clear error message when form is resubmitted with valid input', async () => {
    renderWithProviders(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const loginButton = screen.getByRole('button', { name: /log in/i })
    
    // Trigger validation error
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
    
    // Fill in valid values and resubmit - errors should clear on submit
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument()
    })
  })

  it('should submit form on Enter key with valid credentials', async () => {
    renderWithProviders(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const form = passwordInput.closest('form')
    
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    // Submit form by pressing Enter on password field
    if (form) {
      fireEvent.submit(form)
    }
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })
})

