<script setup>
import { onMounted, ref } from 'vue'
import keycloak from './services/keycloak'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()
const loading = ref(true)
const authenticated = ref(false)

const login = () => keycloak.login({ redirectUri: window.location.origin })
const logout = () => {
  userStore.clear()
  keycloak.logout({ redirectUri: window.location.origin })
}

onMounted(async () => {
  try {
    const isAuthenticated = await keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    })
    authenticated.value = isAuthenticated
    if (isAuthenticated) await userStore.fetchUser()
  } catch (e) {
    userStore.error = `Keycloak init failed: ${e.message || e}`
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

            <div v-if="userStore.user" class="profile">
              <h2>Your profile</h2>
              <dl class="profile-grid">
                <dt>Cn</dt>
                <dd>{{ userStore.user.cn }}</dd>
                <dt>Employee</dt>
                <dd>{{ userStore.user.employee_id }}</dd>
                <dt>Weergave naam</dt>
                <dd>{{ userStore.user.display_name }}</dd>
                <dt>Voornaam</dt>
                <dd>{{ userStore.user.given_name }}</dd>
                <dt>Achternaam</dt>
                <dd>{{ userStore.user.family_name }}</dd>
                <dt>Email</dt>
                <dd>{{ userStore.user.email }}</dd>
              </dl>
            </div>

            <p v-if="userStore.loading" class="status">Loading profile…</p>
            <div v-if="userStore.error" class="error-box">{{ userStore.error }}</div>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
