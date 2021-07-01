// Styles
import './VBreadcrumbs.sass'

// Components
import VBreadcrumbsItem from './VBreadcrumbsItem'
import VBreadcrumbsDivider from './VBreadcrumbsDivider'
import { VIcon } from '@/components/VIcon'

// Composables
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { useTextColor } from '@/composables/color'

// Utilities
import { computed, defineComponent, provide, toRef } from 'vue'
import { makeProps } from '@/util'

// Types
import type { InjectionKey, PropType, Ref } from 'vue'
import type { LinkProps } from '@/composables/router'

interface BreadcrumbsContext {
  color: Ref<string | undefined>
  disabled: Ref<boolean>
}

export const VBreadcrumbsSymbol: InjectionKey<BreadcrumbsContext> = Symbol.for('vuetify:breadcrumbs')

export type BreadcrumbItem = string | (LinkProps & {
  icon: string
  text: string
})

export default defineComponent({
  name: 'VBreadcrumbs',

  props: makeProps({
    color: String,
    disabled: Boolean,
    divider: {
      type: String,
      default: '/',
    },
    icon: String,
    items: {
      type: Array as PropType<BreadcrumbItem[]>,
      default: () => ([]),
    },

    ...makeDensityProps(),
    ...makeRoundedProps(),
    ...makeTagProps({ tag: 'ul' }),
  }),

  setup (props, { slots }) {
    const { densityClasses } = useDensity(props, 'v-breadcrumbs')
    const { roundedClasses } = useRounded(props, 'v-breadcrumbs')
    const { textColorClasses, textColorStyles } = useTextColor(toRef(props, 'color'))
    const items = computed(() => {
      return props.items.map((item, index, array) => ({
        props: {
          disabled: index >= array.length - 1,
          ...(typeof item === 'string' ? { text: item } : item),
        },
      }))
    })

    provide(VBreadcrumbsSymbol, {
      color: toRef(props, 'color'),
      disabled: toRef(props, 'disabled'),
    })

    return () => (
      <props.tag
        class={[
          'v-breadcrumbs',
          densityClasses.value,
          roundedClasses.value,
          textColorClasses.value,
        ]}
        style={[
          textColorStyles.value,
        ]}
      >
        { props.icon && (
          <VIcon icon={ props.icon } left />
        ) }

        { items.value.map((item, index) => (
          <>
            <VBreadcrumbsItem
              key={ index }
              { ...item.props }
            >
              { slots.item?.({ ...item, index }) || item.props.text }
            </VBreadcrumbsItem>

            { index < props.items.length - 1 && (
              <VBreadcrumbsDivider>
                { slots.divider ? slots.divider({ ...item, index }) : props.divider }
              </VBreadcrumbsDivider>
            ) }
          </>
        )) }

        { slots.default?.() }
      </props.tag>
    )
  },
})
