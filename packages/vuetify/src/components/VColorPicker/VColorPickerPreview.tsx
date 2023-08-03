// Styles
import './VColorPickerPreview.sass'

// Components
import { VSlider } from '@/components/VSlider'
import { VIcon } from '@/components/VIcon'

// Composables
import { makeComponentProps } from '@/composables/component'

// Utilities
import { defineComponent, HexToHSV, HSVtoCSS, propsFactory, useRender } from '@/util'
import { nullColor } from './util'

// Types
import type { PropType } from 'vue'
import type { HSV } from '@/util'

declare global {
  interface Window {
      EyeDropper?: any;
  }
}

export const makeVColorPickerPreviewProps = propsFactory({
  color: {
    type: Object as PropType<HSV | null>,
  },
  disabled: Boolean,
  hideAlpha: Boolean,

  ...makeComponentProps(),
}, 'v-color-picker-preview')

export const VColorPickerPreview = defineComponent({
  name: 'VColorPickerPreview',

  props: makeVColorPickerPreviewProps(),

  emits: {
    'update:color': (color: HSV) => true,
  },

  setup (props, { emit }) {
    const supportEyePicker = 'EyeDropper' in window

    async function openEyePicker(){
      const eyeDropper = new EyeDropper()
      try{
        const result = await eyeDropper.open();
        const colorHexValue = HexToHSV(result.sRGBHex);
        emit('update:color', { ...(props.color ?? nullColor),  ...colorHexValue})
      }
      catch(e){}
    }

    useRender(() => (
      <div
        class={[
          'v-color-picker-preview',
          {
            'v-color-picker-preview--hide-alpha': props.hideAlpha,
          },
          props.class,
        ]}
        style={ props.style }
      >
        <div class="v-color-picker-preview__dot">
          <div style={{ background: HSVtoCSS(props.color ?? nullColor) }} />
        </div>

        <div class="v-color-picker-preview__sliders">
          <VSlider
            class="v-color-picker-preview__track v-color-picker-preview__hue"
            modelValue={ props.color?.h }
            onUpdate:modelValue={ h => emit('update:color', { ...(props.color ?? nullColor), h }) }
            step={ 0 }
            min={ 0 }
            max={ 360 }
            disabled={ props.disabled }
            thumbSize={ 14 }
            trackSize={ 8 }
            trackFillColor="white"
            hideDetails
          />

          { !props.hideAlpha && (
            <VSlider
              class="v-color-picker-preview__track v-color-picker-preview__alpha"
              modelValue={ props.color?.a ?? 1 }
              onUpdate:modelValue={ a => emit('update:color', { ...(props.color ?? nullColor), a }) }
              step={ 1 / 256 }
              min={ 0 }
              max={ 1 }
              disabled={ props.disabled }
              thumbSize={ 14 }
              trackSize={ 8 }
              trackFillColor="white"
              hideDetails
            />
          )}
        </div>
        {
          supportEyePicker && (
            <div class="v-color-picker-preview__eye-picker"><VIcon onClick={ openEyePicker } icon="$eyeDropper"></VIcon></div>
          )
        }
      </div>
    ))

    return {}
  },
})

export type VColorPickerPreview = InstanceType<typeof VColorPickerPreview>
