import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchMe } from '@/services/userService'

export interface User {
  sub?: string
  cn?: string
  employee_id?: string
  display_name?: string
  given_name?: string
  family_name?: string
  email?: string
  roles?: string[]
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref('')

  async function fetchUser(): Promise<void> {
    loading.value = true
    error.value = ''
    try {
      user.value = await fetchMe()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  function clear(): void {
    user.value = null
    error.value = ''
  }

  return { user, loading, error, fetchUser, clear }
})
