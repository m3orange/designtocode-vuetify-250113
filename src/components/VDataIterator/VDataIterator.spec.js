import Vue from 'vue'
import { test } from '~util/testing'
import { mount } from 'avoriaz'
import VDataIterator from './VDataIterator'

test('VDataIterator.js', () => {
  function dataIteratorTestData () {
    return {
      propsData: {
        pagination: {
          descending: false,
          sortBy: 'col1',
          rowsPerPage: 5,
          page: 1
        },
        items: [
          { other: 1, col1: 'foo', col2: 'a', col3: 1 },
          { other: 2, col1: null, col2: 'b', col3: 2 },
          { other: 3, col1: undefined, col2: 'c', col3: 3 }
        ]
      }
    }
  }

  it('should match a snapshot - no matching records', () => {
    const data = dataIteratorTestData()
    data.propsData.search = "asdf"
    const wrapper = mount(VDataIterator, data)

    expect(wrapper.html()).toMatchSnapshot()
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should match a snapshot - no data', () => {
    const data = dataIteratorTestData()
    data.propsData.items = []
    const wrapper = mount(VDataIterator, data)

    expect(wrapper.html()).toMatchSnapshot()
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })

  it('should match a snapshot - with data', () => {
    const data = dataIteratorTestData()

    const vm = new Vue()
    const item = props => vm.$createElement('div', [props.item.col2])
    const component = Vue.component('test', {
      components: {
        VDataIterator
      },
      render (h) {
        return h('v-data-iterator', {
          props: {
            tag: 'span',
            ...data.propsData
          },
          attrs: {
            row: true,
            wrap: true
          },
          scopedSlots: {
            item
          }
        })
      }
    })

    const wrapper = mount(component)

    expect(wrapper.html()).toMatchSnapshot()
    expect('Application is missing <v-app> component.').toHaveBeenTipped()
  })
})
