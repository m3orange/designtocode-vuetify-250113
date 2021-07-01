// Styles
import './VChip.sass'

// Components
import { VAvatar } from '@/components/VAvatar'
import { VIcon } from '@/components/VIcon'

// Composables
import { genOverlays, makeVariantProps, useVariant } from '@/composables/variant'
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeRouterProps, useLink } from '@/composables/router'
import { makeSizeProps, useSize } from '@/composables/size'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, useTheme } from '@/composables/theme'
import { useProxiedModel } from '@/composables/proxiedModel'

// Directives
import { Ripple } from '@/directives/ripple'

// Utilities
import { defineComponent } from 'vue'
import { makeProps } from '@/util/makeProps'

export default defineComponent({
  name: 'VChip',

  directives: { Ripple },

  props: makeProps({
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
    disabled: Boolean,
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
    modelValue: {
      type: Boolean,
      default: true,
    },

    ...makeBorderProps(),
    ...makeDensityProps(),
    ...makeElevationProps(),
    ...makeRoundedProps(),
    ...makeRouterProps(),
    ...makeSizeProps(),
    ...makeTagProps({ tag: 'span' }),
    ...makeThemeProps(),
    ...makeVariantProps({ variant: 'contained' } as const),
  }),

  emits: {
    'click:close': (e: Event) => e,
    'update:active': (value: Boolean) => value,
  },

  setup (props, { attrs, emit, slots }) {
    const isActive = useProxiedModel(props, 'modelValue')

    const { themeClasses } = useTheme(props)
    const { borderClasses } = useBorder(props, 'v-chip')
    const { colorClasses, colorStyles, variantClasses } = useVariant(props, 'v-chip')
    const { elevationClasses } = useElevation(props)
    const { roundedClasses } = useRounded(props, 'v-chip')
    const { sizeClasses } = useSize(props, 'v-chip')
    const { densityClasses } = useDensity(props, 'v-chip')
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

      const isClickable = !props.disabled && (link.isClickable.value || props.link)

      return isActive.value && (
        <Tag
          class={[
            'v-chip',
            {
              'v-chip--disabled': props.disabled,
              'v-chip--link': isClickable,
              'v-chip--pill': props.pill,
            },
            themeClasses.value,
            borderClasses.value,
            colorClasses.value,
            densityClasses.value,
            elevationClasses.value,
            roundedClasses.value,
            sizeClasses.value,
            variantClasses.value,
          ]}
          style={[colorStyles.value]}
          disabled={ props.disabled || undefined }
          draggable={ props.draggable }
          href={ link.href.value }
          v-ripple={[
            isClickable && props.ripple,
            null,
          ]}
          onClick={ isClickable && link.navigate }
        >
          { genOverlays(isClickable, 'v-chip') }

          { hasPrepend && (
            <div class="v-chip__prepend">
              { slots.prepend
                ? slots.prepend()
                : (
                  <VAvatar
                    image={ props.prependAvatar }
                    icon={ props.prependIcon }
                    size={ props.size }
                  />
                )
              }
            </div>
          ) }

          { slots.default?.() }

          { hasAppend && (
            <div class="v-chip__append">
              { slots.append
                ? slots.append()
                : (
                  <VAvatar
                    image={ props.appendAvatar }
                    icon={ props.appendIcon }
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
