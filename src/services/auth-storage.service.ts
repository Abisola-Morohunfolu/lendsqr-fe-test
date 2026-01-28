const AUTH_TOKEN_KEY = 'lendsqr_auth_token'
const DEFAULT_EXPIRY_HOURS = 24

interface TokenPayload {
  email: string
  exp: number // expiration timestamp
  iat: number // issued at timestamp
}

function encodeToken(payload: TokenPayload): string {
  return btoa(JSON.stringify(payload))
}

function decodeToken(token: string): TokenPayload | null {
  try {
    return JSON.parse(atob(token))
  } catch {
    return null
  }
}

export const authStorage = {
  save(email: string, expiryHours: number = DEFAULT_EXPIRY_HOURS): void {
    const now = Date.now()
    const payload: TokenPayload = {
      email,
      iat: now,
      exp: now + expiryHours * 60 * 60 * 1000,
    }
    localStorage.setItem(AUTH_TOKEN_KEY, encodeToken(payload))
  },

  getPayload(): TokenPayload | null {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) return null

    const payload = decodeToken(token)
    if (!payload) {
      this.clear()
      return null
    }

    if (Date.now() > payload.exp) {
      this.clear()
      return null
    }

    return payload
  },

  clear(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  },

  isValid(): boolean {
    return this.getPayload() !== null
  },

  getEmail(): string | null {
    return this.getPayload()?.email ?? null
  },

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },

  getRemainingTime(): number {
    const payload = this.getPayload()
    if (!payload) return 0
    return Math.max(0, payload.exp - Date.now())
  },
}
