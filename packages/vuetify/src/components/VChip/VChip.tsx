// Styles
import './VChip.sass'

// Components
import { VAvatar } from '@/components/VAvatar'
import { VIcon } from '@/components/VIcon'
import { VChipGroupSymbol } from '@/components/VChipGroup/VChipGroup'

// Composables
import { genOverlays, makeVariantProps, useVariant } from '@/composables/variant'
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeGroupItemProps, useGroupItem } from '@/composables/group'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeRouterProps, useLink } from '@/composables/router'
import { makeSizeProps, useSize } from '@/composables/size'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { useProxiedModel } from '@/composables/proxiedModel'

// Directives
import { Ripple } from '@/directives/ripple'

// Utilities
import { defineComponent } from '@/util'

export const VChip = defineComponent({
  name: 'VChip',

  directives: { Ripple },

  props: {
    // TODO: Implement
    // active: Boolean,
    // activeColor: String,
    activeClass: String,
    appendAvatar: String,
    appendIcon: String,
    closable: Boolean,
    closeIcon: {
      type: String,
      default: '$delete',
    },
    closeLabel: {
      type: String,
      default: '$vuetify.close',
    },
    draggable: Boolean,
    filter: Boolean,
    filterIcon: {
      type: String,
      default: '$complete',
    },
    label: Boolean,
    link: Boolean,
    pill: Boolean,
    prependAvatar: String,
    prependIcon: String,
    ripple: {
      type: Boolean,
      default: true,
    },
    text: String,
    modelValue: {
      type: Boolean,
      default: true,
    },

    ...makeBorderProps(),
    ...makeDensityProps(),
    ...makeElevationProps(),
    ...makeGroupItemProps(),
    ...makeRoundedProps(),
    ...makeRouterProps(),
    ...makeSizeProps(),
    ...makeTagProps({ tag: 'span' }),
    ...makeThemeProps(),
    ...makeVariantProps({ variant: 'contained-text' } as const),
  },

  emits: {
    'click:close': (e: Event) => true,
    'update:active': (value: Boolean) => true,
    'update:modelValue': (value: Boolean) => true,
  },

  setup (props, { attrs, emit, slots }) {
    const isActive = useProxiedModel(props, 'modelValue')

    const { themeClasses } = provideTheme(props)
    const { borderClasses } = useBorder(props)
    const { colorClasses, colorStyles, variantClasses } = useVariant(props)
    const { elevationClasses } = useElevation(props)
    const group = useGroupItem(props, VChipGroupSymbol, false)
    const { roundedClasses } = useRounded(props)
    const { sizeClasses } = useSize(props)
    const { densityClasses } = useDensity(props)
    const link = useLink(props, attrs)

    function onCloseClick (e: Event) {
      isActive.value = false

      emit('click:close', e)
    }

    return () => {
      const Tag = (link.isLink.value) ? 'a' : props.tag
      const hasAppend = !!(slots.append || props.appendIcon || props.appendAvatar)
      const hasClose = !!(slots.close || props.closable)
      const hasPrepend = !!(slots.prepend || props.prependIcon || props.prependAvatar)
      const isClickable = !props.disabled && (!!group || link.isClickable.value || props.link)
      const onClickFunc = props.link ? props.link : group?.toggle

      return isActive.value && (
        <Tag
          class={[
            'v-chip',
            {
              'v-chip--disabled': props.disabled,
              'v-chip--label': props.label,
              'v-chip--link': isClickable,
              'v-chip--pill': props.pill,
            },
            themeClasses.value,
            borderClasses.value,
            !group || group.isSelected.value ? colorClasses.value : undefined,
            densityClasses.value,
            elevationClasses.value,
            roundedClasses.value,
            sizeClasses.value,
            variantClasses.value,
            group?.selectedClass.value,
          ]}
          style={[
            !group || group.isSelected.value ? colorStyles.value : undefined,
          ]}
          disabled={ props.disabled || undefined }
          draggable={ props.draggable }
          href={ link.href.value }
          v-ripple={ [isClickable && props.ripple, null] }
          onClick={ isClickable && onClickFunc }
        >
          { genOverlays(isClickable, 'v-chip') }

          { hasPrepend && (
            <div class="v-chip__prepend">
              { slots.prepend
                ? slots.prepend()
                : (
                  <VAvatar
                    icon={ props.prependIcon }
                    image={ props.prependAvatar }
                    size={ props.size }
                  />
                )
              }
            </div>
          ) }

          { slots.default?.({
            isSelected: group?.isSelected.value,
            selectedClass: group?.selectedClass.value,
            select: group?.select,
            toggle: group?.toggle,
            value: group?.value.value,
            disabled: props.disabled,
          }) ?? props.text }

          { hasAppend && (
            <div class="v-chip__append">
              { slots.append
                ? slots.append()
                : (
                  <VAvatar
                    icon={ props.appendIcon }
                    image={ props.appendAvatar }
                    size={ props.size }
                  />
                )
              }
            </div>
          ) }

          { hasClose && (
            <div
              class="v-chip__close"
              onClick={ onCloseClick }
            >
              { slots.close
                ? slots.close({ props: { onClick: onCloseClick } })
                : (
                  <VIcon
                    icon={ props.closeIcon }
                    size="x-small"
                  />
                )
              }
            </div>
          ) }
        </Tag>
      )
    }
  },
})

export type VChip = InstanceType<typeof VChip>
