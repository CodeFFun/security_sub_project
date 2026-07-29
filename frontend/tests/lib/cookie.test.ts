import { setAuthToken, getAuthToken, setUserData, getUserData, clearAuthCookies } from '@/lib/cookie'
import { cookies } from 'next/headers'

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

describe('Cookie Utilities', () => {
  let mockCookieStore: {
    set: jest.Mock
    get: jest.Mock
    delete: jest.Mock
  }

  beforeEach(() => {
    mockCookieStore = {
      set: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    }
    ;(cookies as jest.Mock).mockResolvedValue(mockCookieStore)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('setAuthToken', () => {
    it('should set auth token cookie with correct parameters', async () => {
      const token = 'test-token-123'
      
      await setAuthToken(token)

      expect(mockCookieStore.set).toHaveBeenCalledWith({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: false, // NODE_ENV !== 'production' under test
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    })
  })

  describe('getAuthToken', () => {
    it('should return auth token when it exists', async () => {
      const token = 'test-token-123'
      mockCookieStore.get.mockReturnValue({ value: token })
      
      const result = await getAuthToken()
      
      expect(mockCookieStore.get).toHaveBeenCalledWith('auth_token')
      expect(result).toBe(token)
    })

    it('should return null when auth token does not exist', async () => {
      mockCookieStore.get.mockReturnValue(undefined)
      
      const result = await getAuthToken()
      
      expect(result).toBe(null)
    })
  })

  describe('setUserData', () => {
    it('should set user data cookie with JSON stringified value', async () => {
      const userData = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'customer',
      }
      
      await setUserData(userData)

      expect(mockCookieStore.set).toHaveBeenCalledWith({
        name: 'user_data',
        value: JSON.stringify(userData),
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    })

    it('should handle complex user data objects', async () => {
      const userData = {
        id: 1,
        profile: {
          name: 'Test User',
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        },
      }
      
      await setUserData(userData)

      expect(mockCookieStore.set).toHaveBeenCalledWith({
        name: 'user_data',
        value: JSON.stringify(userData),
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      })
    })
  })

  describe('getUserData', () => {
    it('should return parsed user data when it exists', async () => {
      const userData = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      }
      mockCookieStore.get.mockReturnValue({ value: JSON.stringify(userData) })
      
      const result = await getUserData()
      
      expect(mockCookieStore.get).toHaveBeenCalledWith('user_data')
      expect(result).toEqual(userData)
    })

    it('should return null when user data does not exist', async () => {
      mockCookieStore.get.mockReturnValue(undefined)
      
      const result = await getUserData()
      
      expect(result).toBe(null)
    })

    it('should parse complex user data correctly', async () => {
      const userData = {
        id: 1,
        profile: {
          name: 'Test User',
          preferences: {
            theme: 'dark',
          },
        },
      }
      mockCookieStore.get.mockReturnValue({ value: JSON.stringify(userData) })
      
      const result = await getUserData()
      
      expect(result).toEqual(userData)
      expect(result.profile.preferences.theme).toBe('dark')
    })
  })

  describe('clearAuthCookies', () => {
    it('should delete both auth_token and user_data cookies', async () => {
      await clearAuthCookies()
      
      expect(mockCookieStore.delete).toHaveBeenCalledWith('auth_token')
      expect(mockCookieStore.delete).toHaveBeenCalledWith('user_data')
      expect(mockCookieStore.delete).toHaveBeenCalledTimes(2)
    })
  })
})
