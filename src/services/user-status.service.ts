import type { UserStatus } from '@/types/user.types'

const STORAGE_KEY = 'lendsqr_user_status_overrides'

type StatusOverrides = Record<string, UserStatus>

export const userStatusService = {
  getOverrides(): StatusOverrides {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  },

  setStatus(userId: string, status: UserStatus): void {
    const overrides = this.getOverrides()
    overrides[userId] = status
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  },

  getStatus(userId: string): UserStatus | null {
    const overrides = this.getOverrides()
    return overrides[userId] ?? null
  },

  clearStatus(userId: string): void {
    const overrides = this.getOverrides()
    delete overrides[userId]
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  },

  clearAll(): void {
    sessionStorage.removeItem(STORAGE_KEY)
  },
}
