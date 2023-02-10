// Directives
import Touch from '@/directives/touch'

// Composables
import { makeGroupItemProps, useGroupItem } from '@/composables/group'
import { makeLazyProps, useLazy } from '@/composables/lazy'
import { MaybeTransition } from '@/composables/transition'
import { useSsrBoot } from '@/composables/ssrBoot'

// Utilities
import { computed, inject, nextTick, ref } from 'vue'
import { convertToUnit, genericComponent, useRender } from '@/util'

// Types
import { VWindowGroupSymbol, VWindowSymbol } from './VWindow'

export const VWindowItem = genericComponent()({
  name: 'VWindowItem',

  directives: {
    Touch,
  },

  props: {
    reverseTransition: {
      type: [Boolean, String],
      default: undefined,
    },
    transition: {
      type: [Boolean, String],
      default: undefined,
    },

    ...makeGroupItemProps(),
    ...makeLazyProps(),
  },

  emits: {
    'group:selected': (val: { value: boolean }) => true,
  },

  setup (props, { slots }) {
    const window = inject(VWindowSymbol)
    const groupItem = useGroupItem(props, VWindowGroupSymbol)
    const { isBooted } = useSsrBoot()

    if (!window || !groupItem) throw new Error('[Vuetify] VWindowItem must be used inside VWindow')

    const isTransitioning = ref(false)
    const hasTransition = computed(() => window.isReversed.value ? props.reverseTransition !== false : props.transition !== false)

    function onAfterTransition () {
      if (!isTransitioning.value || !window) {
        return
      }

      // Finalize transition state.
      isTransitioning.value = false
      if (window.transitionCount.value > 0) {
        window.transitionCount.value -= 1

        // Remove container height if we are out of transition.
        if (window.transitionCount.value === 0) {
          window.transitionHeight.value = undefined
        }
      }
    }

    function onBeforeTransition () {
      if (isTransitioning.value || !window) {
        return
      }

      // Initialize transition state here.
      isTransitioning.value = true

      if (window.transitionCount.value === 0) {
        // Set initial height for height transition.
        window.transitionHeight.value = convertToUnit(window.rootRef.value?.clientHeight)
      }

      window.transitionCount.value += 1
    }

    function onTransitionCancelled () {
      onAfterTransition() // This should have the same path as normal transition end.
    }

    function onEnterTransition (el: Element) {
      if (!isTransitioning.value) {
        return
      }

      nextTick(() => {
        // Do not set height if no transition or cancelled.
        if (!hasTransition.value || !isTransitioning.value || !window) {
          return
        }

        // Set transition target height.
        window.transitionHeight.value = convertToUnit(el.clientHeight)
      })
    }

    const transition = computed(() => {
      const name = window.isReversed.value
        ? props.reverseTransition
        : props.transition

      return !hasTransition.value ? false : {
        name: typeof name !== 'string' ? window.transition.value : name,
        onBeforeEnter: onBeforeTransition,
        onAfterEnter: onAfterTransition,
        onEnterCancelled: onTransitionCancelled,
        onBeforeLeave: onBeforeTransition,
        onAfterLeave: onAfterTransition,
        onLeaveCancelled: onTransitionCancelled,
        onEnter: onEnterTransition,
      }
    })

    const { hasContent } = useLazy(props, groupItem.isSelected)

    useRender(() => (
      <MaybeTransition transition={ isBooted.value && transition.value } >
        <div
          class={[
            'v-window-item',
            groupItem.selectedClass.value,
          ]}
          v-show={ groupItem.isSelected.value }
        >
          { hasContent.value && slots.default?.() }
        </div>
      </MaybeTransition>
    ))

    return {}
  },
})

export type VWindowItem = InstanceType<typeof VWindowItem>
