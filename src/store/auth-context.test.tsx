/**
 * Auth Context Tests
 * Tests login, logout, and token persistence
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { AuthProvider, useAuth } from './auth-context'
import { authStorage } from '@/services/auth-storage.service'

describe('Auth Context', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    localStorage.clear()
    vi.useRealTimers()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  )

  it('should login and set authentication state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAuthenticated).toBe(false)

    await act(async () => {
      const loginPromise = result.current.login('test@example.com', 'password123')
      vi.advanceTimersByTime(500)
      const success = await loginPromise
      expect(success).toBe(true)
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.userEmail).toBe('test@example.com')
  })

  it('should store token in localStorage on login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const loginPromise = result.current.login('test@example.com', 'password123')
      vi.advanceTimersByTime(500)
      await loginPromise
    })

    // Token should be stored (JWT-like format with encoded email)
    expect(authStorage.getToken()).toBeTruthy()
    expect(authStorage.getEmail()).toBe('test@example.com')
  })

  it('should logout and clear authentication', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const loginPromise = result.current.login('test@example.com', 'password123')
      vi.advanceTimersByTime(500)
      await loginPromise
    })

    expect(result.current.isAuthenticated).toBe(true)

    act(() => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.userEmail).toBeNull()
  })

  it('should remove token from localStorage on logout', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const loginPromise = result.current.login('test@example.com', 'password123')
      vi.advanceTimersByTime(500)
      await loginPromise
    })

    expect(authStorage.getToken()).toBeTruthy()

    act(() => {
      result.current.logout()
    })

    expect(authStorage.getToken()).toBeNull()
    expect(authStorage.getEmail()).toBeNull()
  })

  it('should restore auth state from localStorage on mount', () => {
    // Save a valid token using authStorage
    authStorage.save('saved@example.com')

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.userEmail).toBe('saved@example.com')
  })

  it('should return false for invalid login (password too short)', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const loginPromise = result.current.login('test@example.com', '12345')
      vi.advanceTimersByTime(500)
      const success = await loginPromise
      expect(success).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(authStorage.getToken()).toBeNull()
  })

  it('should return false for invalid login (empty email)', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const loginPromise = result.current.login('', 'password123')
      vi.advanceTimersByTime(500)
      const success = await loginPromise
      expect(success).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should handle login with valid credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const loginPromise = result.current.login('user@example.com', 'validpassword')
      vi.advanceTimersByTime(500)
      const success = await loginPromise
      expect(success).toBe(true)
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.userEmail).toBe('user@example.com')
  })

  it('should generate unique tokens for different logins', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const loginPromise1 = result.current.login('user1@example.com', 'password123')
      vi.advanceTimersByTime(500)
      await loginPromise1
    })

    const token1 = authStorage.getToken()

    act(() => {
      result.current.logout()
    })

    await act(async () => {
      const loginPromise2 = result.current.login('user2@example.com', 'password123')
      vi.advanceTimersByTime(500)
      await loginPromise2
    })

    const token2 = authStorage.getToken()

    expect(token1).not.toBe(token2)
  })
})
