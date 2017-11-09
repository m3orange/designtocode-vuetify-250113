import VBottomNav from './VBottomNav'
import VBtn from '../VBtn'
import { test } from '~util/testing'
import Vue from 'vue/dist/vue.common'

function createBtn (val = null) {
  const options = {
    props: { flat: true }
  }
  if (val) options.attrs = { value: val }

  return Vue.component('test', {
    components: {
      VBtn
    },
    render (h) {
      return h('v-btn', options)
    }
  })
}

test('VBottomNav.js', ({ mount }) => {
  it('should have a bottom-nav class', () => {
    const wrapper = mount(VBottomNav, {
      slots: {
        default: [VBtn, VBtn]
      }
    })

    expect(wrapper.hasClass('bottom-nav')).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have prop classes', () => {
    const wrapper = mount(VBottomNav, {
      propsData: {
        absolute: true,
        shift: true
      },
      slots: {
        default: [VBtn, VBtn]
      }
    })

    expect(wrapper.hasClass('bottom-nav--absolute')).toBe(true)
    expect(wrapper.hasClass('bottom-nav--shift')).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should be hidden with a false value', () => {
    const wrapper = mount(VBottomNav, {
      propsData: { value: false },
      slots: {
        default: [VBtn, VBtn]
      }
    })

    expect(wrapper.hasClass('bottom-nav--active')).toBe(false)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should be visible with a true value', () => {
    const wrapper = mount(VBottomNav, {
      propsData: { value: true },
      slots: {
        default: [VBtn, VBtn]
      }
    })

    expect(wrapper.hasClass('bottom-nav--active')).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should output active btn when clicked', () => {
    const wrapper = mount(VBottomNav, {
      propsData: { value: true, active: 1 },
      slots: {
        default: [
          createBtn(),
          createBtn()
        ]
      }
    })

    const btn = wrapper.find('.btn')[0]

    const change = jest.fn()
    wrapper.instance().$on('update:active', change)

    btn.trigger('click')
    expect(change).toBeCalledWith(0)
  })
})
