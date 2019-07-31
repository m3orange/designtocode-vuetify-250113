// Components
import VWindow from './VWindow'

// Mixins
import Bootable from '../../mixins/bootable'
import { factory as GroupableFactory } from '../../mixins/groupable'

// Directives
import Touch from '../../directives/touch'

// Utilities
import { convertToUnit } from '../../util/helpers'
import mixins, { ExtractVue } from '../../util/mixins'

// Types
import { VNode } from 'vue'

const baseMixins = mixins(
  Bootable,
  GroupableFactory('windowGroup', 'v-window-item', 'v-window')
)

interface options extends ExtractVue<typeof baseMixins> {
  $el: HTMLElement
  windowGroup: InstanceType<typeof VWindow>
}

export default baseMixins.extend<options>().extend(
  /* @vue/component */
).extend({
  name: 'v-window-item',

  directives: {
    Touch,
  },

  props: {
    disabled: Boolean,
    reverseTransition: {
      type: [Boolean, String],
      default: undefined,
    },
    transition: {
      type: [Boolean, String],
      default: undefined,
    },
    value: {
      required: false,
    },
  },

  data () {
    return {
      isActive: false,
      wasCancelled: true, // Prevent event wrongly fired during transition.
      initialHeight: undefined as string | undefined,
    }
  },

  computed: {
    classes (): object {
      return this.groupClasses
    },
    computedTransition (): string | boolean {
      if (!this.windowGroup.internalReverse) {
        return typeof this.transition !== 'undefined'
          ? this.transition || ''
          : this.windowGroup.computedTransition
      }

      return typeof this.reverseTransition !== 'undefined'
        ? this.reverseTransition || ''
        : this.windowGroup.computedTransition
    },
  },

  methods: {
    genDefaultSlot () {
      return this.$slots.default
    },
    genWindowItem () {
      return this.$createElement('div', {
        staticClass: 'v-window-item',
        class: this.classes,
        directives: [{
          name: 'show',
          value: this.isActive,
        }],
        on: this.$listeners,
      }, this.showLazyContent(this.genDefaultSlot()))
    },
    beforeChange (val: boolean) {
      if (this.windowGroup.$el) {
        // Cache initial height before any transition event. Both enter/leave window will
        // have the initial value becuase we don't know which one will enter first.
        this.initialHeight = convertToUnit(this.windowGroup.$el.clientHeight)
      }
    },
    deactivate () {
      // This function must be called in all path of the transition.
      this.wasCancelled = true
      if (this.windowGroup.activeWindows > 0) {
        this.windowGroup.activeWindows--

        if (this.windowGroup.activeWindows === 0) {
          this.windowGroup.internalHeight = undefined
        }
      }
    },
    onAfterTransition () {
      if (this.wasCancelled) {
        return
      }

      requestAnimationFrame(() => this.deactivate())
    },
    onBeforeTransition () {
      // Initialize transition state here.
      this.wasCancelled = false
      if (this.windowGroup.activeWindows === 0) {
        this.windowGroup.internalHeight = this.initialHeight
      }
      this.windowGroup.activeWindows++
    },
    onTransitionCancelled () {
      if (this.wasCancelled) {
        return
      }

      this.deactivate()
    },
    onEnter (el: HTMLElement) {
      if (this.wasCancelled) {
        return
      }

      this.$nextTick(() => {
        // If cancelled, we should terminate early since transition end event may not fire.
        if (!this.computedTransition || this.wasCancelled) {
          return
        }

        // Set transition target height.
        this.windowGroup.internalHeight = convertToUnit(el.clientHeight)
      })
    },
  },

  render (h): VNode {
    return h('transition', {
      props: {
        name: this.computedTransition,
      },
      on: {
        // Same handler for enter/leave windows.
        beforeEnter: this.onBeforeTransition,
        afterEnter: this.onAfterTransition,
        enterCancelled: this.onTransitionCancelled,

        beforeLeave: this.onBeforeTransition,
        afterLeave: this.onAfterTransition,
        leaveCancelled: this.onTransitionCancelled,

        enter: this.onEnter,
      },
    }, [this.genWindowItem()])
  },
})
