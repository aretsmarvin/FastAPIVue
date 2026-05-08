export interface FetcherOptions extends RequestInit {
  token?: string
}

export async function fetcher<T>(url: string, options: FetcherOptions = {}): Promise<T> {
  const { token, ...init } = options
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(url, { ...init, headers })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || `HTTP ${response.status}`)
  return data as T
}
