
// Mixins
import Colorable from './colorable'
import { inject as RegistrableInject } from './registrable'

// Utilities
import { deepEqual } from '../util/helpers'
import { consoleError } from '../util/console'
import mixins from '../util/mixins'
import { PropValidator } from 'vue/types/options'

// Types
export type VuetifyFormValidator = (value: any) => string | false
export type VuetifyFormMessage = string | string[] | VuetifyFormValidator
export type VuetifyFormValidations = (VuetifyFormValidator | string)[]

/* @vue/component */
export default mixins(
  Colorable,
  RegistrableInject('form')
).extend({
  name: 'validatable',

  props: {
    disabled: Boolean,
    error: Boolean,
    errorCount: {
      type: [Number, String],
      default: 1
    },
    errorMessages: {
      type: [String, Array],
      default: () => []
    } as PropValidator<VuetifyFormMessage>,
    messages: {
      type: [String, Array],
      default: () => []
    } as PropValidator<VuetifyFormMessage>,
    readonly: Boolean,
    rules: {
      type: Array,
      default: () => []
    } as PropValidator<VuetifyFormValidator[]>,
    success: Boolean,
    successMessages: {
      type: [String, Array],
      default: () => []
    } as PropValidator<VuetifyFormMessage>,
    validateOnBlur: Boolean,
    value: { required: false }
  },

  data () {
    return {
      errorBucket: [] as string[],
      hasColor: false,
      hasFocused: false,
      hasInput: false,
      isFocused: false,
      isResetting: false,
      lazyValue: this.value,
      valid: false
    }
  },

  computed: {
    hasError (): boolean {
      return (
        this.internalErrorMessages.length > 0 ||
        this.errorBucket.length > 0 ||
        this.error
      )
    },
    // TODO: Add logic that allows the user to enable based
    // upon a good validation
    hasSuccess (): boolean {
      return (
        this.internalSuccessMessages.length > 0 ||
        this.success
      )
    },
    externalError (): boolean {
      return this.errorMessages.length > 0 || this.error
    },
    hasMessages (): boolean {
      return this.validationTarget.length > 0
    },
    hasState (): boolean {
      return (
        this.hasSuccess ||
        (this.shouldValidate && this.hasError)
      )
    },
    internalErrorMessages (): VuetifyFormValidations {
      return this.genInternalMessages(this.errorMessages)
    },
    internalMessages (): VuetifyFormValidations {
      return this.genInternalMessages(this.messages)
    },
    internalSuccessMessages (): VuetifyFormValidations {
      return this.genInternalMessages(this.successMessages)
    },
    internalValue: {
      get (): unknown {
        return this.lazyValue
      },
      set (val: any) {
        this.lazyValue = val

        this.$emit('input', val)
      }
    },
    shouldValidate (): boolean {
      if (this.externalError) return true
      if (this.isResetting) return false

      return this.validateOnBlur
        ? this.hasFocused && !this.isFocused
        : (this.hasInput || this.hasFocused)
    },
    validations (): VuetifyFormValidations {
      return this.validationTarget.slice(0, Number(this.errorCount))
    },
    validationState (): string | null {
      if (this.hasError && this.shouldValidate) return 'error'
      if (this.hasSuccess) return 'success'
      if (this.hasColor) return this.color
      return null
    },
    validationTarget (): VuetifyFormValidations {
      if (this.errorMessages.length > 0) {
        return this.internalErrorMessages
      } else if (this.successMessages.length > 0) {
        return this.internalSuccessMessages
      } else if (this.messages.length > 0) {
        return this.internalMessages
      } else if (this.shouldValidate) {
        return this.errorBucket
      } else return []
    }
  },

  watch: {
    rules: {
      handler (newVal, oldVal) {
        if (deepEqual(newVal, oldVal)) return
        this.validate()
      },
      deep: true
    },
    internalValue () {
      // If it's the first time we're setting input,
      // mark it with hasInput
      this.hasInput = true
      this.validateOnBlur || this.$nextTick(this.validate)
    },
    isFocused (val) {
      // Should not check validation
      // if disabled or readonly
      if (
        !val &&
        !this.disabled &&
        !this.readonly
      ) {
        this.hasFocused = true
        this.validateOnBlur && this.validate()
      }
    },
    isResetting () {
      setTimeout(() => {
        this.hasInput = false
        this.hasFocused = false
        this.isResetting = false
      }, 0)
    },
    hasError (val) {
      if (this.shouldValidate) {
        this.$emit('update:error', val)
      }
    },
    value (val) {
      this.lazyValue = val
    }
  },

  beforeMount () {
    this.validate()
  },

  created () {
    this.form && this.form.register(this)
  },

  beforeDestroy () {
    this.form && this.form.unregister(this)
  },

  methods: {
    genInternalMessages (messages: VuetifyFormMessage): VuetifyFormValidations {
      if (Array.isArray(messages)) return messages

      return [messages]
    },
    /** @public */
    reset () {
      this.isResetting = true
      this.internalValue = Array.isArray(this.internalValue)
        ? []
        : undefined
    },
    /** @public */
    resetValidation () {
      this.isResetting = true
    },
    /** @public */
    validate (force = false, value?: any): boolean {
      const errorBucket = []
      value = value || this.internalValue

      if (force) this.hasInput = this.hasFocused = true

      for (let index = 0; index < this.rules.length; index++) {
        const rule = this.rules[index] as VuetifyFormValidator | string
        const valid = typeof rule === 'function' ? rule(value) : rule

        if (typeof valid === 'string') {
          errorBucket.push(valid)
        } else if (typeof valid !== 'boolean') {
          consoleError(`Rules should return a string or boolean, received '${typeof valid}' instead`, this)
        }
      }

      this.errorBucket = errorBucket
      this.valid = errorBucket.length === 0

      return this.valid
    }
  }
})
