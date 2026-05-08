import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetcher } from './Fetcher'

describe('fetcher', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('adds Authorization header when token is provided', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await fetcher('/api/test', { token: 'my-token' })

    const [, options] = mockFetch.mock.calls[0]
    expect((options.headers as Headers).get('Authorization')).toBe('Bearer my-token')
  })

  it('throws when response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ detail: 'Not found' }),
    }))

    await expect(fetcher('/api/missing')).rejects.toThrow('Not found')
  })
})
