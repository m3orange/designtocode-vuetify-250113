// Styles
import './VBreadcrumbs.sass'

// Components
import { VBreadcrumbsDivider } from './VBreadcrumbsDivider'
import { VBreadcrumbsItem } from './VBreadcrumbsItem'
import { VDefaultsProvider } from '@/components/VDefaultsProvider'
import { VIcon } from '@/components/VIcon'

// Composables
import { IconValue } from '@/composables/icons'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeItemsProps, useItems } from '@/composables/items'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { provideDefaults } from '@/composables/defaults'
import { useBackgroundColor } from '@/composables/color'

// Utilities
import { genericComponent, useRender } from '@/util'
import { toRef } from 'vue'

// Types
import type { MakeSlots } from '@/util'

export const VBreadcrumbs = genericComponent<new <T>() => {
  $props: {
    items?: T[]
  }
  $slots: MakeSlots<{
    default: []
    item: [T | number]
  }>
}>()({
  name: 'VBreadcrumbs',

  props: {
    activeClass: String,
    activeColor: String,
    bgColor: String,
    color: String,
    disabled: Boolean,
    divider: {
      type: String,
      default: '/',
    },
    icon: IconValue,

    ...makeDensityProps(),
    ...makeItemsProps(),
    ...makeRoundedProps(),
    ...makeTagProps({ tag: 'ul' }),
  },

  setup (props, { slots }) {
    const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'bgColor'))
    const { densityClasses } = useDensity(props)

    const { items } = useItems(props)
    const { roundedClasses } = useRounded(props)

    provideDefaults({
      VBreadcrumbsItem: {
        activeClass: toRef(props, 'activeClass'),
        activeColor: toRef(props, 'activeColor'),
        color: toRef(props, 'color'),
        disabled: toRef(props, 'disabled'),
      },
    })

    useRender(() => {
      const hasPrepend = !!(slots.prepend || props.icon)

      return (
        <props.tag
          class={[
            'v-breadcrumbs',
            backgroundColorClasses.value,
            densityClasses.value,
            roundedClasses.value,
          ]}
          style={ backgroundColorStyles.value }
        >
          { props.icon && (
            <VIcon icon={ props.icon } left />
          ) }

          { hasPrepend && (
            <VDefaultsProvider
              defaults={{
                VIcon: {
                  icon: props.icon,
                  start: true,
                },
              }}
            >
              <div class="v-breadcrumbs__prepend">
              { slots.prepend
                ? slots.prepend()
                : props.icon && (<VIcon />)
                }
              </div>
            </VDefaultsProvider>
          ) }

          { items.value.map(({ props: itemProps, originalItem: item }, index, array) => (
            <>
              <VBreadcrumbsItem
                key={ index }
                disabled={ index >= array.length - 1 }
                { ...itemProps }
              >
                { slots.item?.({ item, index }) }
              </VBreadcrumbsItem>

              { index < array.length - 1 && (
                <VBreadcrumbsDivider>
                  { slots.divider?.({ item, index }) ?? props.divider }
                </VBreadcrumbsDivider>
              ) }
            </>
          )) }

          { slots.default?.() }
        </props.tag>
      )
    })

    return {}
  },
})

export type VBreadcrumbs = InstanceType<typeof VBreadcrumbs>
