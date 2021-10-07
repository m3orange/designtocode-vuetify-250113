// Composables
import { createForm, makeFormProps } from '@/composables/form'

// Utilities
import { defineComponent, useRender } from '@/util'

export const VForm = defineComponent({
  name: 'VForm',

  props: {
    ...makeFormProps(),
  },

  emits: {
    'update:modelValue': (val: boolean) => true,
    resetValidation: () => true,
    reset: (e: Event) => true,
    submit: (e: Event) => true,
  },

  setup (props, { slots }) {
    const form = createForm(props)

    useRender(() => ((
      <form
        class="v-form"
        novalidate
        onReset={ form.reset }
        onSubmit={ form.submit }
      >
        { slots.default?.(form) }
      </form>
    )))

    return form
  },
})

export type VForm = InstanceType<typeof VForm>
