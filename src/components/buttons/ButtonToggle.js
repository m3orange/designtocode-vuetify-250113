export default {
  name: 'button-toggle',

  model: {
    prop: 'inputValue',
    event: 'change'
  },

  props: {
    items: {
      type: Array,
      default: () => []
    },
    multiple: Boolean,
    mandatory: Boolean,
    inputValue: {
      required: false
    }
  },

  computed: {
    classes () {
      return {
        'btn-toggle': true,
        'btn-toggle--selected': this.inputValue && !this.multiple || this.inputValue && this.inputValue.length > 0
      }
    }
  },

  methods: {
    isSelected (item) {
      if (!this.multiple) {
        return this.inputValue === item.value
      }

      return this.inputValue.includes(item.value)
    },

    updateValue (item) {
      if (!this.multiple) {
        if (this.mandatory && this.inputValue === item.value) return
        return this.$emit('change', this.inputValue === item.value ? null : item.value)
      }

      const items = this.inputValue.slice()

      const i = items.indexOf(item.value)
      if (i > -1) {
        items.length >= 1 && !this.mandatory && items.splice(i, 1)
      } else {
        items.push(item.value)
      }

      this.$emit('change', items)
    }
  },

  render (h) {
    const buttons = this.items.map((item, index) => {
      const children = []

      item.text && children.push(h('span', item.text))
      item.icon && children.push(h('v-icon', item.icon))

      return h('v-btn', {
        key: index,
        props: {
          flat: true
        },
        nativeOn: {
          click: (e) => {
            e.stopPropagation()
            this.updateValue(item)
          }
        },
        attrs: {
          'data-selected': this.isSelected(item),
          'data-index': index,
          'data-only-child': this.isSelected(item) && (!this.multiple || this.inputValue.length === 1)
        }
      }, children)
    })

    return h('div', { class: this.classes }, buttons)
  }
}
