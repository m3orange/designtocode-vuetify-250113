// Components
import VBanner from '../VBanner'

// Utilities
import { createTheme, VuetifyThemeSymbol } from '@/composables/theme'
import { mount } from '@vue/test-utils'
import { VuetifySymbol } from '@/framework'
import { h } from 'vue'

describe('VBanner', () => {
  function mountFunction (options = {}) {
    return mount(VBanner, {
      global: {
        provide: {
          [VuetifySymbol as symbol]: { defaults: { global: {} } },
          [VuetifyThemeSymbol as symbol]: createTheme(),
        },
      },
      ...options,
    })
  }

  it('should match a snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should generate actions slot', () => {
    const wrapper = mountFunction({
      slots: { actions: '<div>foobar</div>' },
    })

    expect(wrapper.html()).toContain('<div>foobar</div>')
  })
})
