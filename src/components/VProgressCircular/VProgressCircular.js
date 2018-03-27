import '../../stylus/components/_progress-circular.styl'

import Colorable from '../../mixins/colorable'

export default {
  name: 'v-progress-circular',

  mixins: [Colorable],

  props: {
    button: Boolean,

    indeterminate: Boolean,

    rotate: {
      type: Number,
      default: 0
    },

    size: {
      type: [Number, String],
      default: 32
    },

    width: {
      type: Number,
      default: 4
    },

    value: {
      type: Number,
      default: 0
    }
  },

  computed: {
    calculatedSize () {
      return Number(this.size) + (this.button ? 8 : 0)
    },

    circumference () {
      return 2 * Math.PI * this.radius
    },

    classes () {
      return this.addTextColorClassChecks({
        'progress-circular': true,
        'progress-circular--indeterminate': this.indeterminate,
        'progress-circular--button': this.button
      })
    },

    normalizedValue () {
      if (this.value < 0) {
        return 0
      }

      if (this.value > 100) {
        return 100
      }

      return this.value
    },

    radius () {
      return 20
    },

    strokeDashArray () {
      return Math.round(this.circumference * 1000) / 1000
    },

    strokeDashOffset () {
      return ((100 - this.normalizedValue) / 100) * this.circumference + 'px'
    },

    strokeWidth () {
      return Math.min(10, Number(this.width) / Number(this.size) * 50)
    },

    styles () {
      return {
        height: `${this.calculatedSize}px`,
        width: `${this.calculatedSize}px`
      }
    },

    svgStyles () {
      return {
        transform: `rotate(${this.rotate}deg)`
      }
    }
  },

  methods: {
    genCircle (h, name, offset) {
      return h('circle', {
        class: `progress-circular__${name}`,
        attrs: {
          fill: 'transparent',
          cx: 50,
          cy: 50,
          r: this.radius,
          'stroke-width': this.strokeWidth,
          'stroke-dasharray': this.strokeDashArray,
          'stroke-dashoffset': offset
        }
      })
    },
    genSvg (h) {
      const children = [
        this.indeterminate || this.genCircle(h, 'underlay', 0),
        this.genCircle(h, 'overlay', this.strokeDashOffset)
      ]

      return h('svg', {
        style: this.svgStyles,
        attrs: {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '25 25 50 50'
        }
      }, children)
    }
  },

  render (h) {
    const info = h('div', { class: 'progress-circular__info' }, [this.$slots.default])
    const svg = this.genSvg(h)

    return h('div', {
      class: this.classes,
      style: this.styles,
      on: this.$listeners
    }, [svg, info])
  }
}
