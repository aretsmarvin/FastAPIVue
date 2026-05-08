import { defineStore } from 'pinia'
import { ref } from 'vue'
import keycloak from '../services/keycloak'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref('')

  async function fetchUser() {
    loading.value = true
    error.value = ''
    try {
      await keycloak.updateToken(30)
      const response = await fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${keycloak.token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Failed to fetch /me')
      user.value = data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function clear() {
    user.value = null
    error.value = ''
  }

  return { user, loading, error, fetchUser, clear }
})
