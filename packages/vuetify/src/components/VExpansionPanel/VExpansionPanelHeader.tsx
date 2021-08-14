// Components
import { VIcon } from '@/components'
import { VExpansionPanelSymbol } from './VExpansionPanels'

// Composables
import { useBackgroundColor } from '@/composables/color'

// Directives
import ripple from '@/directives/ripple'

// Utilities
import { computed, inject } from 'vue'
import { defineComponent, propsFactory } from '@/util'

export const makeVExpansionPanelHeaderProps = propsFactory({
  expandIcon: {
    type: String,
    default: '$expand',
  },
  collapseIcon: {
    type: String,
    default: '$collapse',
  },
  hideActions: Boolean,
  ripple: {
    type: [Boolean, Object],
    default: false,
  },
  color: String,
})

export default defineComponent({
  name: 'VExpansionPanelHeader',

  directives: { ripple },

  props: {
    ...makeVExpansionPanelHeaderProps(),
  },

  setup (props, { slots }) {
    const expansionPanel = inject(VExpansionPanelSymbol)

    if (!expansionPanel) throw new Error('[Vuetify] v-expansion-panel-header needs to be placed inside v-expansion-panel')

    const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(props, 'color')

    const slotProps = computed(() => ({
      expanded: expansionPanel.isSelected.value,
      disabled: expansionPanel.disabled.value,
      expandIcon: props.expandIcon,
      collapseIcon: props.collapseIcon,
    }))

    return () => (
      <button
        class={[
          'v-expansion-panel-header',
          {
            'v-expansion-panel-header--active': expansionPanel.isSelected.value,
          },
          backgroundColorClasses.value,
        ]}
        style={ backgroundColorStyles.value }
        type="button"
        tabindex={ expansionPanel.disabled.value ? -1 : undefined }
        disabled={ expansionPanel.disabled.value }
        aria-expanded={ expansionPanel.isSelected.value }
        onClick={ expansionPanel.toggle }
        v-ripple={ props.ripple }
      >
        <div class="v-expansion-panel-header__overlay" />
        { slots.default?.(slotProps.value) }
        { !props.hideActions && (
          <div class="v-expansion-panel-header__icon">
            {
              slots.actions ? slots.actions(slotProps.value)
              : <VIcon icon={ expansionPanel.isSelected.value ? props.collapseIcon : props.expandIcon } />
            }
          </div>
        ) }
      </button>
    )
  },
})
