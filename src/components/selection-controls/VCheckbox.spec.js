import { test } from '~util/testing'
import VCheckbox from '~components/selection-controls/VCheckbox'

test('VCheckbox.js', ({ mount }) => {
  it('should return true when clicked', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        inputValue: false
      }
    })

    const change = jest.fn()
    wrapper.instance().$on('change', change)
    wrapper.find('.input-group--selection-controls__ripple')[0].trigger('click')

    expect(change).toBeCalledWith(true)
  })

  it('should return a value when clicked with a specified value', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        value: 'John',
        inputValue: null
      }
    })

    const change = jest.fn()
    wrapper.instance().$on('change', change)
    wrapper.find('.input-group--selection-controls__ripple')[0].trigger('click')

    expect(change).toBeCalledWith('John')
  })

  it('should return null when clicked with a specified value', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        value: 'John',
        inputValue: 'John'
      }
    })

    const change = jest.fn()
    wrapper.instance().$on('change', change)
    wrapper.find('.input-group--selection-controls__ripple')[0].trigger('click')

    expect(change).toBeCalledWith(null)
  })

  it('should toggle when label is clicked', () => {
    const change = jest.fn()
    const wrapper = mount(VCheckbox, {
      propsData: {
        label: 'Label',
        value: null
      }
    })

    const label = wrapper.find('label')[0]
    wrapper.instance().$on('change', change)
    label.trigger('click')

    expect(change).toBeCalled()
  })

  it('should toggle on space and enter with default toggleKeys', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        inputValue: false
      }
    })

    const change = jest.fn()
    wrapper.instance().$on('change', change)

    wrapper.vm.$el.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13 }))
    expect(change).toBeCalled()

    wrapper.vm.$el.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 }))
    expect(change).toBeCalled()
  })

  it('should not toggle on space or enter with blank toggleKeys', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        inputValue: false,
        toggleKeys: []
      }
    })

    const change = jest.fn()
    wrapper.instance().$on('change', change)

    wrapper.vm.$el.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13 }))
    expect(change).not.toBeCalled()

    wrapper.vm.$el.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 }))
    expect(change).not.toBeCalled()
  })

  it('should toggle on just space with custom toggleKeys', () => {
    const wrapper = mount(VCheckbox, {
      propsData: {
        inputValue: false,
        toggleKeys: [32]
      }
    })

    const change = jest.fn()
    wrapper.instance().$on('change', change)

    wrapper.vm.$el.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13 }))
    expect(change).not.toBeCalled()

    wrapper.vm.$el.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 }))
    expect(change).toBeCalled()
  })
})
