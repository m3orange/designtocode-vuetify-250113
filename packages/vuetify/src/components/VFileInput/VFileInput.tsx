// Styles
import './VFileInput.sass'

// Components
import { VBtn, VChip, VInput } from '@/components'
import { makeVInputProps } from '@/components/VInput/VInput'

// Composables
import { useProxiedModel } from '@/composables/proxiedModel'
import { useLocale } from '@/composables/locale'
import { useInput } from '@/composables/input'

// Utilities
import { computed, watch } from 'vue'
import { defineComponent, humanReadableFileSize, pick } from '@/util'

// Types
import type { PropType } from 'vue'

export default defineComponent({
  name: 'VFileInput',

  inheritAttrs: false,

  props: {
    chips: Boolean,
    clearable: {
      type: Boolean,
      default: true,
    },
    counterSizeString: {
      type: String,
      default: '$vuetify.fileInput.counterSize',
    },
    counterString: {
      type: String,
      default: '$vuetify.fileInput.counter',
    },
    counter: Boolean,
    multiple: Boolean,
    // placeholder: String,
    showSize: {
      type: [Boolean, Number] as PropType<boolean | 1000 | 1024>,
      default: false,
      validator: (v: boolean | number) => {
        return (
          typeof v === 'boolean' ||
          [1000, 1024].includes(v)
        )
      },
    },
    modelValue: {
      type: Array as PropType<File[] | undefined>,
      // TODO: This breaks types??
      // validator: val => {
      //   return wrapInArray(val).every(v => v != null && typeof v === 'object')
      // },
    },

    ...makeVInputProps({
      appendIcon: '$close',
      prependOuterIcon: '$file',
    }),
  },

  emits: {
    'update:modelValue': (files: File[]) => true,
  },

  setup (props, { attrs, slots }) {
    const { t } = useLocale()
    const fileValue = useProxiedModel(props, 'modelValue')

    const {
      isFocused,
      isDirty,
      isActive,
      props: inputProps,
      focus,
      inputRef,
    } = useInput(computed(() => !!fileValue.value && fileValue.value.length !== 0))

    watch(() => props.modelValue, value => {
      if (inputRef.value && (value == null || value?.length === 0)) {
        inputRef.value.value = ''
      }
    })

    const base = computed(() => typeof props.showSize !== 'boolean' ? props.showSize : undefined)
    const totalBytes = computed(() => (fileValue.value ?? []).reduce((bytes, { size = 0 }) => bytes + size, 0))
    const totalBytesReadable = computed(() => humanReadableFileSize(totalBytes.value, base.value))

    const fileNames = computed(() => (fileValue.value ?? []).map(file => {
      const { name = '', size = 0 } = file

      return !props.showSize
        ? name
        : `${name} (${humanReadableFileSize(size, base.value)})`
    }))

    const counterText = computed(() => {
      const fileCount = fileValue.value?.length ?? 0
      if (props.showSize) return t(props.counterSizeString, fileCount, totalBytesReadable.value)
      else return t(props.counterString, fileCount)
    })

    return () => {
      const [_, rest] = pick(attrs, ['class'])

      return (
        <VInput
          class={[
            'v-file-input',
            attrs.class,
          ]}
          active={ isActive.value }
          focused={ isFocused.value }
          dirty={ isDirty.value }
          { ...props }
          onFocus={ () => inputRef.value?.click?.() }
          v-slots={{
            prependOuter: props.prependOuterIcon ? () => (
              <VBtn
                icon={ props.prependOuterIcon }
                variant="text"
                tabindex="-1"
                onClick={ () => inputRef.value?.click() }
                disabled={ props.disabled }
              />
            ) : undefined,

            default: ({ props: slotProps }) => (
              <>
                <input
                  type="file"
                  id={ slotProps.id }
                  multiple={ props.multiple }
                  disabled={ props.disabled }
                  onClick={ e => e.stopPropagation() }
                  onChange={ e => {
                    if (!e.target) return

                    const target = e.target as HTMLInputElement
                    const files = [...target.files ?? []]
                    fileValue.value = files

                    if (!isFocused.value) focus()
                  } }
                  { ...inputProps }
                  { ...rest }
                />

                { isDirty.value && (
                  <div class={ slotProps.class }>
                    { slots.selection ? slots.selection({
                      fileNames: fileNames.value,
                      totalBytes: totalBytes.value,
                      totalBytesReadable: totalBytesReadable.value,
                    })
                    : props.chips ? fileNames.value.map((text, index) => (
                      <VChip
                        key={ text }
                        size="small"
                        color={ props.color }
                      >{ text }</VChip>
                    ))
                    : fileNames.value.join(', ') }
                  </div>
                ) }
              </>
            ),

            append: props.clearable ? () => (
              <VBtn
                icon={ props.appendIcon }
                variant="text"
                size="small"
                color={ props.color }
                disabled={ props.disabled || !fileValue.value?.length }
                onClick={
                  (e: Event) => {
                    e.stopPropagation()

                    fileValue.value = []
                    inputRef.value.value = ''
                  }
                }
              />
            ) : undefined,

            details: props.counter ? () => (
              <>
                <span />
                <span>{ counterText.value }</span>
              </>
            ) : undefined,
          }}
        />
      )
    }
  },
})
