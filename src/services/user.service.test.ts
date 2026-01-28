import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getUsers, getUserById, paginateUsers } from './user.service'
import { createMockUser } from '@/test/test-utils'

globalThis.fetch = vi.fn() as typeof fetch

describe('User Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getUsers', () => {
    it('should fetch and return users', async () => {
      const mockUsers = [
        createMockUser({ id: 'user001' }),
        createMockUser({ id: 'user002' }),
      ]

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers,
      } as Response)

      const users = await getUsers()

      expect(users).toHaveLength(2)
      expect(users[0].id).toBe('user001')
      expect(fetch).toHaveBeenCalledWith('/users.json')
    })

    it('should throw error when fetch fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(getUsers()).rejects.toThrow('Unable to fetch user data')
    })

    it('should normalize user data correctly', async () => {
      const rawUser = {
        id: 'TEST001',
        organization: 'Test Org',
        username: 'testuser',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        createdAt: '2020-01-01T00:00:00Z',
        status: 'Active',
        fullName: 'Test User',
        accountBalance: 1000.5,
        userTier: 2,
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [rawUser],
      } as Response)

      const users = await getUsers()

      expect(users[0].accountBalance).toBe('1000.50')
      expect(users[0].id).toBe('TEST001')
      expect(users[0].userTier).toBe(2)
    })

    it('should handle nested users array', async () => {
      const mockUsers = [createMockUser({ id: 'user001' })]

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ users: mockUsers }),
      } as Response)

      const users = await getUsers()

      expect(users).toHaveLength(1)
      expect(users[0].id).toBe('user001')
    })
  })

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const mockUsers = [
        createMockUser({ id: 'user001' }),
        createMockUser({ id: 'user002', username: 'user2' }),
      ]

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers,
      } as Response)

      const user = await getUserById('user002')

      expect(user).not.toBeNull()
      expect(user?.id).toBe('user002')
      expect(user?.username).toBe('user2')
    })

    it('should return null when user not found', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [createMockUser({ id: 'user001' })],
      } as Response)

      const user = await getUserById('NONEXISTENT')

      expect(user).toBeNull()
    })

    it('should throw error when fetch fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(getUserById('user001')).rejects.toThrow()
    })
  })

  describe('paginateUsers', () => {
    it('should paginate correctly', () => {
      const users = Array.from({ length: 25 }, (_, i) =>
        createMockUser({ id: `user${String(i + 1).padStart(3, '0')}` })
      )

      const result = paginateUsers(users, 1, 10)

      expect(result.users).toHaveLength(10)
      expect(result.pagination.page).toBe(1)
      expect(result.pagination.pageSize).toBe(10)
      expect(result.pagination.total).toBe(25)
      expect(result.pagination.totalPages).toBe(3)
      expect(result.pagination.hasNext).toBe(true)
      expect(result.pagination.hasPrev).toBe(false)
    })

    it('should return correct middle page', () => {
      const users = Array.from({ length: 25 }, (_, i) =>
        createMockUser({ id: `user${String(i + 1).padStart(3, '0')}` })
      )

      const result = paginateUsers(users, 2, 10)

      expect(result.users).toHaveLength(10)
      expect(result.pagination.hasPrev).toBe(true)
      expect(result.pagination.hasNext).toBe(true)
    })

    it('should handle last page', () => {
      const users = Array.from({ length: 25 }, (_, i) =>
        createMockUser({ id: `user${String(i + 1).padStart(3, '0')}` })
      )

      const result = paginateUsers(users, 3, 10)

      expect(result.users).toHaveLength(5)
      expect(result.pagination.hasNext).toBe(false)
      expect(result.pagination.hasPrev).toBe(true)
    })

    it('should handle empty array', () => {
      const result = paginateUsers([], 1, 10)

      expect(result.users).toHaveLength(0)
      expect(result.pagination.total).toBe(0)
      expect(result.pagination.totalPages).toBe(0)
    })
  })
})
