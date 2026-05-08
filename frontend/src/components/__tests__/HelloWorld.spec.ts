import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import HelloWorld from '../HelloWorld.vue'

const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: HelloWorld }] })

describe('HelloWorld', () => {
  it('renders the msg prop', async () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: 'Test message' },
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('Test message')
  })
})
