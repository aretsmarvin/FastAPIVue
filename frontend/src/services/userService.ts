import keycloak from './keycloak'
import type { User } from '@/stores/user'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export async function fetchMe(): Promise<User> {
  await keycloak.updateToken(30)
  const response = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${keycloak.token}` },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || 'Failed to fetch /me')
  return data as User
}
