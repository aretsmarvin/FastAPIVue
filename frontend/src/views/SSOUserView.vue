<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <div class="profile">
    <h2>Your profile</h2>
    <p v-if="userStore.loading" class="status">Loading profile…</p>
    <dl v-else-if="userStore.user" class="profile-grid">
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
</template>
