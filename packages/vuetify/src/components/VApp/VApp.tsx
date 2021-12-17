// Styles
import './VApp.sass'

// Composables
import { makeThemeProps, useTheme } from '@/composables/theme'
import { createLayout, makeLayoutProps } from '@/composables/layout'

// Utilities
import { watch } from 'vue'
import { defineComponent, useRender } from '@/util'
import { useRtl } from '@/composables/rtl'

export const VApp = defineComponent({
  name: 'VApp',

  props: {
    ...makeLayoutProps({ fullHeight: true }),
    ...makeThemeProps(),
  },

  setup (props, { slots }) {
    const { themeClasses, current } = useTheme()
    const { layoutClasses, getLayoutItem, items } = createLayout(props)
    const { rtlClasses } = useRtl()

    watch(() => props.theme, value => value && (current.value = value), { immediate: true })

    useRender(() => (
      <div
        class={[
          'v-application',
          themeClasses.value,
          layoutClasses.value,
          rtlClasses.value,
        ]}
        data-app="true"
      >
        <div class="v-application__wrap">
          { slots.default?.() }
        </div>
      </div>
    ))

    return {
      getLayoutItem,
      items,
    }
  },
})

export type VApp = InstanceType<typeof VApp>
