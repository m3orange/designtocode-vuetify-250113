// Styles
import './VAvatar.sass'

// Components
import { VIcon } from '@/components/VIcon'
import { VImg } from '@/components/VImg'

// Composables
import { IconValue } from '@/composables/icons'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeSizeProps, useSize } from '@/composables/size'
import { makeTagProps } from '@/composables/tag'
import { useBackgroundColor } from '@/composables/color'

// Utilities
import { defineComponent, propsFactory, useRender } from '@/util'
import { toRef } from 'vue'

export const makeVAvatarProps = propsFactory({
  color: String,
  flat: Boolean,
  start: Boolean,
  end: Boolean,
  icon: IconValue,
  image: String,

  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeSizeProps(),
  ...makeTagProps(),
})

export const VAvatar = defineComponent({
  name: 'VAvatar',

  props: makeVAvatarProps(),

  setup (props, { slots }) {
    const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'color'))
    const { densityClasses } = useDensity(props)
    const { elevationClasses } = useElevation(props)
    const { roundedClasses } = useRounded(props)
    const { sizeClasses, sizeStyles } = useSize(props)

    useRender(() => (
      <props.tag
        class={[
          'v-avatar',
          {
            'v-avatar--flat': props.flat,
            'v-avatar--start': props.start,
            'v-avatar--end': props.end,
          },
          backgroundColorClasses.value,
          densityClasses.value,
          elevationClasses.value,
          roundedClasses.value,
          sizeClasses.value,
        ]}
        style={[
          backgroundColorStyles.value,
          sizeStyles.value,
        ]}
      >
        { props.image
          ? (<VImg src={ props.image } alt="" />)
          : props.icon
            ? (<VIcon icon={ props.icon } />)
            : slots.default?.()
        }
      </props.tag>
    ))

    return {}
  },
})

export type VAvatar = InstanceType<typeof VAvatar>
