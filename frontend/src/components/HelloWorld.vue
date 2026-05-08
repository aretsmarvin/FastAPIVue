<script setup lang="ts">
defineProps<{ msg: string }>()
</script>

<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p>Successfully authenticated via Keycloak SSO.</p>
    <router-link to="/me" class="btn btn-primary">View my profile →</router-link>
  </div>
</template>
