// Components
import { VBtn } from '@/components/VBtn'

// Composables
import { useLocale } from '@/composables'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed, ref, toRaw, watchEffect } from 'vue'
import { deepEqual, genericComponent, propsFactory, useRender } from '@/util'

// Types
import type { Ref, VNode } from 'vue'
import type { GenericProps } from '@/util'

export type VConfirmEditSlots<T> = {
  default: {
    model: Ref<T>
    save: () => void
    cancel: () => void
    isPristine: boolean
    get actions (): (props?: {}) => VNode
  }
}

export const makeVConfirmEditProps = propsFactory({
  modelValue: null,
  color: String,
  cancelText: {
    type: String,
    default: '$vuetify.confirmEdit.cancel',
  },
  okText: {
    type: String,
    default: '$vuetify.confirmEdit.ok',
  },
  enableActions: {
    type: Boolean,
    default: false,
  },
}, 'VConfirmEdit')

export const VConfirmEdit = genericComponent<new <T> (
  props: {
    modelValue?: T
    'onUpdate:modelValue'?: (value: T) => void
    'onSave'?: (value: T) => void
  },
  slots: VConfirmEditSlots<T>
) => GenericProps<typeof props, typeof slots>>()({
  name: 'VConfirmEdit',

  props: makeVConfirmEditProps(),

  emits: {
    cancel: () => true,
    save: (value: any) => true,
    'update:modelValue': (value: any) => true,
    closeMenu: () => true,
  },

  setup (props, { emit, slots }) {
    const model = useProxiedModel(props, 'modelValue')
    const internalModel = ref()
    watchEffect(() => {
      internalModel.value = structuredClone(toRaw(model.value))
    })

    const { t } = useLocale()

    const isPristine = computed(() => {
      return deepEqual(model.value, internalModel.value)
    })

    function save () {
      model.value = internalModel.value
      emit('save', internalModel.value)
    }

    function cancel () {
      const checkPristine = structuredClone(toRaw(isPristine.value))
      internalModel.value = structuredClone(toRaw(model.value))
      if (props.enableActions && checkPristine) {
        emit('closeMenu')
        return
      }
      emit('cancel')
    }

    function actions (actionsProps?: {}) {
      return (
        <>
          { /* {!!props.enableActions} */ }
          <VBtn
            disabled={ props.enableActions ? false : isPristine.value }
            variant="text"
            color={ props.color }
            onClick={ cancel }
            text={ t(props.cancelText) }
            { ...actionsProps }
          />

          <VBtn
            disabled={ props.enableActions ? false : isPristine.value }
            variant="text"
            color={ props.color }
            onClick={ save }
            text={ t(props.okText) }
            { ...actionsProps }
          />
        </>
      )
    }

    let actionsUsed = false
    useRender(() => {
      return (
        <>
          {
            slots.default?.({
              model: internalModel,
              save,
              cancel,
              isPristine: isPristine.value,
              get actions () {
                actionsUsed = true
                return actions
              },
            })
          }

          { !actionsUsed && actions() }
        </>
      )
    })

    return {
      save,
      cancel,
      isPristine,
    }
  },
})

export type VConfirmEdit = InstanceType<typeof VConfirmEdit>
