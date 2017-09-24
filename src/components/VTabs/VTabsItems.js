export default {
  name: 'v-tabs-items',

  inject: ['next', 'prev'],

  props: {
    cycle: Boolean,
    touchless: Boolean
  },

  methods: {
    swipeLeft () {
      this.next(this.cycle)
    },
    swipeRight () {
      this.prev(this.cycle)
    }
  },

  render (h) {
    const data = {
      staticClass: 'tabs__items',
      directives: []
    }

    !this.touchless && data.directives.push({
      name: 'touch',
      value: {
        parent: true,
        left: this.swipeLeft,
        right: this.swipeRight
      }
    })

    return h('div', data, this.$slots.default)
  }
}
