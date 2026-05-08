import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'

vi.mock('@/services/keycloak', () => ({
  default: {
    init: vi.fn().mockResolvedValue(false),
    login: vi.fn(),
    logout: vi.fn(),
  },
}))

const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: { template: '<div/>' } }] })

describe('App', () => {
  it('shows login button when not authenticated', async () => {
    const wrapper = mount(App, {
      global: { plugins: [createPinia(), router] },
    })
    await new Promise(r => setTimeout(r, 50))
    expect(wrapper.text()).toContain('Login with SSO')
  })
})
