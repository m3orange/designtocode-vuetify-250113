import Vue from 'vue'
import Vuetify, { checkVueVersion } from '@/components/Vuetify'
import { test } from '@/test'

test('Vuetify.install.js', () => {
  it('should install transitions, directives and components', async () => {
    const { component, directive, use } = Vue

    Vue.component = jest.fn()
    Vue.directive = jest.fn()
    Vue.use = jest.fn()

    const noopInstallPack = { install: () => { } }

    Vuetify.installed = false
    Vuetify.install(Vue, {
      components: {
        ComponentPack: noopInstallPack,
        OneComponent: {}
      },
      directives: {
        directive: {
          name: 'foobarbaz'
        }
      },
      transitions: {
        transition: {
          name: 'transition'
        },
        'v-foobarbaz': {
          name: 'v-foobarbaz'
        },
        'undefined': {}
      }
    })

    expect(Vue.use.mock.calls).toEqual([[noopInstallPack]])
    expect(Vue.directive.mock.calls).toEqual([["foobarbaz", {"name": "foobarbaz"}]])
    expect(Vue.component.mock.calls).toEqual([["v-foobarbaz", {"name": "v-foobarbaz"}],["OneComponent", {}]])

    Vue.use = jest.fn()
    Vuetify.install(Vue, {
      components: {
        component: 'component'
      }
    })
    expect(Vue.use).not.toBeCalled()

    Vue.component = component
    Vue.directive = directive
    Vue.use = use
  })

  describe('should warn about an unsupported version of Vue', () => {
    it('older version', () => {
      checkVueVersion({ version: '2.5.0' }, '^2.5.10')
      expect('Vuetify requires Vue version ^2.5.10').toHaveBeenTipped()
    })

    it('newer version', () => {
      checkVueVersion({ version: '2.5.12' }, '^2.5.10')
    })

    it('newer, prerelease version', () => {
      checkVueVersion({ version: '2.5.17-beta.0' }, '^2.5.10')
    })
  })
})
