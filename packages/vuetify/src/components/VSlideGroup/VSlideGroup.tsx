// Styles
import './VSlideGroup.sass'

// Composables
import { makeGroupProps } from '@/composables/group'
import { useSlideGroup } from '@/composables/slideGroup'
import { makeTagProps } from '@/composables/tag'

// Utilities
import { defineComponent } from '@/util'
import { computed } from 'vue'

export const VSlideGroup = defineComponent({
  name: 'VSlideGroup',

  props: {
    ...makeTagProps(),
    ...makeGroupProps({
      mandatory: true,
    }),
  },

  emits: {
    'update:modelValue': (value: any) => true,
  },

  setup (props, { slots }) {
    const {
      containerRef,
      contentRef,
      contentStyles,
      next,
      prev,
      select,
      isSelected,
    } = useSlideGroup(props)

    const slotProps = computed(() => ({
      next,
      prev,
      select,
      isSelected,
    }))

    return () => (
      <props.tag
        class={[
          'v-slide-group',
        ]}
      >
        { slots.prepend && (
          <div class="v-slide-group__prepend">
            { slots.prepend(slotProps.value) }
          </div>
        ) }

        <div
          ref={ containerRef }
          class="v-slide-group__container"
        >
          <div
            ref={ contentRef }
            class="v-slide-group__content"
            style={ contentStyles.value }
          >
            { slots.default?.(slotProps.value) }
          </div>
        </div>

        { slots.append && (
          <div class="v-slide-group__append">
            { slots.append(slotProps.value) }
          </div>
        ) }
      </props.tag>
    )
  },
})

export type VSlideGroup = InstanceType<typeof VSlideGroup>
