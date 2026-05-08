<script setup>
import { onMounted, ref } from 'vue'
import keycloak from './services/keycloak'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const loading = ref(true)
const authenticated = ref(false)
const me = ref(null)
const error = ref('')

const login = () => keycloak.login({ redirectUri: window.location.origin })
const logout = () => keycloak.logout({ redirectUri: window.location.origin })

const fetchMe = async () => {
  error.value = ''
  try {
    await keycloak.updateToken(30)
    const response = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${keycloak.token}` },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch /me')
    me.value = data
  } catch (e) {
    error.value = e.message
  }
}

onMounted(async () => {
  try {
    const isAuthenticated = await keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    })
    authenticated.value = isAuthenticated
    if (isAuthenticated) await fetchMe()
  } catch (e) {
    error.value = `Keycloak init failed: ${e.message || e}`
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="page">
    <div class="card">
      <div class="card-header">
        <h1>Vue + Keycloak + FastAPI</h1>
      </div>

      <div class="card-body">
        <p v-if="loading" class="status">Checking authentication…</p>

        <template v-else>
          <div v-if="!authenticated" class="unauthenticated">
            <p>You are not signed in.</p>
            <button class="btn btn-primary" @click="login">Login with SSO</button>
          </div>

          <div v-else class="authenticated">
            <div class="top-row">
              <span class="badge">✓ Signed in</span>
              <button class="btn btn-secondary" @click="logout">Logout</button>
            </div>

            <div v-if="me" class="profile">
              <h2>Your profile</h2>
              <dl class="profile-grid">
                <dt>Sub</dt>
                <dd>{{ me.sub }}</dd>
                <dt>Username</dt>
                <dd>{{ me.username }}</dd>
                <dt>Email</dt>
                <dd>{{ me.email }}</dd>
                <dt>Roles</dt>
                <dd>{{ (me.roles || []).join(', ') || 'None' }}</dd>
              </dl>
            </div>

            <p v-else-if="!error" class="status">Loading profile…</p>
          </div>

          <div v-if="error" class="error-box">{{ error }}</div>
        </template>
      </div>
    </div>
  </main>
</template>
