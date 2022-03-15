// Styles
import './VCombobox.sass'

// Components
import { makeSelectProps } from '@/components/VSelect/VSelect'
import { VChip } from '@/components/VChip'
import { VDefaultsProvider } from '@/components/VDefaultsProvider'
import { VList, VListItem } from '@/components/VList'
import { VMenu } from '@/components/VMenu'
import { VTextField } from '@/components/VTextField'

// Composables
import { makeFilterProps, useFilter } from '@/composables/filter'
import { makeTransitionProps } from '@/composables/transition'
import { useForwardRef } from '@/composables/forwardRef'
import { useLocale } from '@/composables/locale'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utility
import { computed, ComputedRef, ref, watch } from 'vue'
import { genericComponent, useRender, wrapInArray } from '@/util'

// Types
import type { FilterMatch } from '@/composables/filter'
import type { MakeSlots } from '@/util'

export interface DefaultSelectionSlot {
  selection: {
    selected: boolean
    title: string
    value: any
  }
}

export interface DefaultChipSlot extends DefaultSelectionSlot {
  props: {
    'onClick:close': (e: Event) => void
    modelValue: any
  }
}

function highlightResult (text: string, matches: FilterMatch, length: number) {
  if (Array.isArray(matches)) throw new Error('Multiple matches is not implemented')

  return typeof matches === 'number' && ~matches
    ? (
      <>
        <span class="v-combobox__unmask">{ text.substr(0, matches) }</span>
        <span class="v-combobox__mask">{ text.substr(matches, length) }</span>
        <span class="v-combobox__unmask">{ text.substr(matches + length) }</span>
      </>
    )
    : text
}

function genItem (item: any) {
  return {
    title: String((typeof item === 'object' ? item.title : item) ?? ''),
    value: (typeof item === 'object' ? item.value : item),
  }
}

export const VCombobox = genericComponent<new <T>() => {
  $slots: MakeSlots<{
    chip: [DefaultChipSlot]
    default: []
    selection: [DefaultSelectionSlot]
  }>
}>()({
  name: 'VCombobox',

  props: {
    // TODO: implement post keyboard support
    // autoSelectFirst: Boolean,

    ...makeFilterProps({ filterKeys: ['title'] }),
    ...makeSelectProps({ menuIcon: '' }),
    ...makeTransitionProps({ transition: false } as const),

    hideNoData: {
      type: Boolean,
      default: true,
    },
  },

  emits: {
    'click:clear': (e: MouseEvent) => true,
    'update:search': (val: any) => true,
    'update:modelValue': (val: any) => true,
  },

  setup (props, { emit, slots }) {
    const { t } = useLocale()
    const vTextFieldRef = ref()
    const activator = ref()
    const isFocused = ref(false)
    const isPristine = ref(true)
    const menu = ref(false)
    const model = useProxiedModel(
      props,
      'modelValue',
      [],
      v => wrapInArray(v || []),
      (v: any) => props.multiple ? v : v[0]
    )
    const search = ref('')

    const items = computed(() => {
      return (props.items || []).map((item: string | Record<string, any>) => {
        return genItem(item)
      })
    })
    const selections = computed(() => {
      const array: any[] = []

      for (const unwrapped of model.value) {
        const item = genItem(unwrapped)

        const found = array.find(selection => selection.value === item.value)

        if (found == null) array.push(item)
      }

      return array
    })
    const selected = computed(() => selections.value.map(selection => selection.value))
    const searchValue = computed(() => isPristine.value ? undefined : search.value)
    const { filteredItems } = useFilter(props, items, searchValue)

    function onClear (e: MouseEvent) {
      model.value = []

      if (props.openOnClear) {
        menu.value = true
      }
    }
    function onClickControl () {
      if (props.hideNoData && !filteredItems.value.length) return

      menu.value = true
    }
    function onKeydown (e: KeyboardEvent) {
      if (['Enter', 'ArrowDown'].includes(e.key)) {
        menu.value = true
      }

      if (['Escape', 'Tab'].includes(e.key)) {
        menu.value = false
      }

      if (['Enter', 'Escape', 'Tab'].includes(e.key)) {
        isPristine.value = true
      }

      if (props.multiple && ['Enter', ','].includes(e.key)) {
        if (e.key === ',') e.preventDefault()

        select({ value: search.value })

        search.value = ''
      }
    }
    function select (item: any) {
      if (!props.multiple) {
        model.value = item.value

        return
      }

      const index = selections.value.findIndex(selection => selection.value === item.value)

      if (index === -1) {
        model.value.push(item.value)
      } else {
        model.value = selected.value.filter(selection => selection !== item.value)
      }
    }
    function onAfterLeave () {
      if (isFocused.value) isPristine.value = true
    }

    watch(() => vTextFieldRef.value, val => {
      activator.value = val.$el.querySelector('.v-input__control')
    })

    watch(filteredItems, val => {
      if (!val.length && props.hideNoData) menu.value = false
    })

    watch(isFocused, val => {
      if (!val && props.multiple && search.value) {
        model.value.push(search.value)
        search.value = ''
      }
    })

    watch(search, val => {
      if (!props.multiple) model.value = [val]

      isPristine.value = false

      if (isFocused.value) menu.value = true
    })

    useRender(() => {
      const hasChips = !!(props.chips || slots.chip)

      return (
        <VTextField
          ref={ vTextFieldRef }
          v-model={ search.value }
          class={[
            'v-combobox',
            {
              'v-combobox--active-menu': menu.value,
              'v-combobox--chips': !!props.chips,
              [`v-combobox--${props.multiple ? 'multiple' : 'single'}`]: true,
            },
          ]}
          dirty={ selected.value.length > 0 }
          onClick:clear={ onClear }
          onClick:control={ onClickControl }
          onClick:input={ onClickControl }
          onFocus={ () => isFocused.value = true }
          onBlur={ () => isFocused.value = false }
          onKeydown={ onKeydown }
        >
          {{
            ...slots,
            default: () => (
              <>
                { activator.value && (
                  <VMenu
                    v-model={ menu.value }
                    activator={ activator.value }
                    contentClass="v-combobox__content"
                    eager={ props.eager }
                    openOnClick={ false }
                    transition={ props.transition }
                    onAfterLeave={ onAfterLeave }
                  >
                    <VList
                      mandatory
                      selected={ selected.value }
                      selectStrategy={ props.multiple ? 'independent' : 'single-independent' }
                    >
                      { !filteredItems.value.length && !props.hideNoData && (
                        <VListItem title={ t(props.noDataText) } />
                      )}

                      { filteredItems.value.map(({ item, matches }) => (
                        <VListItem
                          value={ item.value }
                          onMousedown={ (e: MouseEvent) => e.preventDefault() }
                          onClick={ () => {
                            if (!props.multiple) {
                              menu.value = false
                              search.value = item.title
                            } else {
                              search.value = ''

                              select(item)
                            }
                          } }
                        >
                          {{
                            title: () => {
                              return isPristine.value
                                ? item.title
                                : highlightResult(item.title, matches.title, search.value?.length ?? 0)
                            },
                          }}
                        </VListItem>
                      )) }
                    </VList>
                  </VMenu>
                ) }
                  { selections.value.map((selection, index) => {
                    const selected = selection?.selected
                    const title = selection?.title

                    function onChipClose (e: Event) {
                      e.stopPropagation()
                      e.preventDefault()

                      select(selection)
                    }

                    const slotProps = {
                      'onClick:close': onChipClose,
                      modelValue: selected,
                    }

                    return (
                      <VDefaultsProvider
                        defaults={{
                          VChip: {
                            closable: props.closableChips,
                            size: 'small',
                            text: title,
                          },
                        }}
                      >
                        <div class="v-combobox__selection">
                          { hasChips
                            ? slots.chip
                              ? slots.chip({ props: slotProps, selection })
                              : (<VChip { ...slotProps } />)
                            : slots.selection
                              ? slots.selection({ selection })
                              : (
                                <span class="v-combobox__selection-text">
                                  { title }
                                  { props.multiple && (index < selections.value.length - 1) && (
                                    <span class="v-combobox__selection-comma">,</span>
                                  ) }
                                </span>
                              )
                          }
                        </div>
                      </VDefaultsProvider>
                    )
                  }) }
              </>
            ),
          }}
        </VTextField>
      )
    })

    return useForwardRef({
      filteredItems,
    }, vTextFieldRef)
  },
})

export type VCombobox = InstanceType<typeof VCombobox>
