import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as userService from '../userService'

vi.mock('../keycloak', () => ({
  default: { updateToken: vi.fn().mockResolvedValue(true), token: 'mock-token' },
}))

describe('userService', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('fetchMe returns user data on success', async () => {
    const mockUser = { cn: 'devuser', employee_id: 'EMP-001', display_name: 'Dev User',
      given_name: 'Dev', family_name: 'User', email: 'devuser@example.local' }

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    }))

    const user = await userService.fetchMe()
    expect(user.cn).toBe('devuser')
    expect(user.employee_id).toBe('EMP-001')
  })

  it('fetchMe throws on error response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ detail: 'Unauthorized' }),
    }))

    await expect(userService.fetchMe()).rejects.toThrow('Unauthorized')
  })
})
