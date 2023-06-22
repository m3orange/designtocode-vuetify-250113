// Components
import { VAvatar } from '@/components/VAvatar/VAvatar'

// Composables
import { makeGroupItemProps, useGroupItem } from '@/composables/group'

// Utilities
import { VStepperSymbol } from './VStepper'
import { genericComponent, propsFactory, useRender } from '@/util'


export const makeVStepperItemProps = propsFactory({
  color: String,
  text: String,

  ...makeGroupItemProps(),
}, 'VStepperItem')

export const VStepperItem = genericComponent()({
  name: 'VStepperItem',

  props: makeVStepperItemProps(),

  emits: {
    'group:selected': (val: { value: boolean }) => true,
  },

  setup (props, { slots }) {
    const group = useGroupItem(props, VStepperSymbol, false)

    useRender(() => {
      const hasColor = !group || group.isSelected.value

      function onClick () {
        group?.toggle()
      }

      return (
        <button
          class={[
            'v-stepper-item',
            group?.selectedClass.value,
          ]}
          onClick={ onClick }
        >
          { !!group?.value.value && (
            <VAvatar
              class="v-stepper-item__avatar"
              color={ hasColor ? props.color : undefined }
              size={ 24 }
            >
              { group?.value.value }
            </VAvatar>
          )}

          <div class="v-stepper-item__content">
            { slots.default?.() ?? props.text }
          </div>
        </button>
      )
    })
    return {}
  }
})
