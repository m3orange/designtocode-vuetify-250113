// Styles
import './VTreeviewItem.sass'

// Components
import { VBtn } from '@/components/VBtn'
import { VListItemAction, VListItemSubtitle, VListItemTitle } from '@/components/VList'
import { makeVListItemProps, VListItem } from '@/components/VList/VListItem'
import { VProgressCircular } from '@/components/VProgressCircular'

// Composables
import { useDensity } from '@/composables/density'
import { IconValue } from '@/composables/icons'
import { useNestedItem } from '@/composables/nested/nested'
import { useLink } from '@/composables/router'
import { genOverlays } from '@/composables/variant'

// Utilities
import { computed, inject, ref } from 'vue'
import { EventProp, genericComponent, omit, propsFactory, useRender } from '@/util'

// Types
import { VTreeviewSymbol } from './shared'
import type { ListItemSlot, VListItemSlots } from '@/components/VList/VListItem'

export const makeVTreeviewItemProps = propsFactory({
  loading: Boolean,
  onToggleExpand: EventProp<[MouseEvent]>(),
  toggleIcon: IconValue,

  ...makeVListItemProps({ slim: true }),
}, 'VTreeviewItem')

export const VTreeviewItem = genericComponent<VListItemSlots>()({
  name: 'VTreeviewItem',

  props: makeVTreeviewItemProps(),

  setup (props, { attrs, slots, emit }) {
    const link = useLink(props, attrs)
    const rawId = computed(() => props.value === undefined ? link.href.value : props.value)
    const vListItemRef = ref<VListItem>()

    const {
      activate,
      isActivated,
      select,
      isSelected,
      isIndeterminate,
      isGroupActivator,
      root,
      id,
    } = useNestedItem(rawId, false)

    const isActivatableGroupActivator = computed(() =>
      (root.activatable.value) &&
      isGroupActivator
    )

    const { densityClasses } = useDensity(props, 'v-list-item')

    const slotProps = computed(() => ({
      isActive: isActivated.value,
      select,
      isSelected: isSelected.value,
      isIndeterminate: isIndeterminate.value,
    } satisfies ListItemSlot))

    const isClickable = computed(() =>
      !props.disabled &&
      props.link !== false &&
      (props.link || link.isClickable.value || (props.value != null && !!vListItemRef.value?.list) || isActivatableGroupActivator.value)
    )

    function activateItem (e: MouseEvent | KeyboardEvent) {
      if (
        !isClickable.value ||
        (!isActivatableGroupActivator.value && isGroupActivator)
      ) return

      if (root.activatable.value) {
        if (isActivatableGroupActivator.value) {
          activate(!isActivated.value, e)
        } else {
          vListItemRef.value?.activate(!vListItemRef.value?.isActivated, e)
        }
      }
    }

    const visibleIds = inject(VTreeviewSymbol, { visibleIds: ref() }).visibleIds

    useRender(() => {
      const hasTitle = (slots.title || props.title != null)
      const hasSubtitle = (slots.subtitle || props.subtitle != null)
      const listItemProps = omit(VListItem.filterProps(props), ['onClick'])
      const hasPrepend = slots.prepend || props.toggleIcon

      // A dedicated ActivatableGroupActivator was created because VList does not currently allow VListGroup to be activatable.
      // Making VListGroup activatable would be a new feature in VList.
      // However, this functionality is available in VTreeview.
      // The ActivatableGroupActivator can be removed once VList supports activatable VListGroups.
      return isActivatableGroupActivator.value
        ? (
          <div
            class={[
              'v-list-item',
              'v-list-item--one-line',
              'v-treeview-item',
              'v-treeview-item--activetable-group-activator',
              {
                'v-list-item--active': isActivated.value || isSelected.value,
                'v-treeview-item--filtered': visibleIds.value && !visibleIds.value.has(id.value),
              },
              densityClasses.value,
              props.class,
            ]}
            onClick={ props.onClick ?? activateItem }
          >
            <>
              { genOverlays(isActivated.value || isSelected.value, 'v-list-item') }
              { props.toggleIcon && (
                <VListItemAction start={ false }>
                  <VBtn
                    density="compact"
                    icon={ props.toggleIcon }
                    loading={ props.loading }
                    variant="text"
                    onClick={ props.onToggleExpand }
                  >
                    {{
                      loader () {
                        return (
                          <VProgressCircular
                            indeterminate="disable-shrink"
                            size="20"
                            width="2"
                          />
                        )
                      },
                    }}
                  </VBtn>
                </VListItemAction>
              )}

             </>

            <div class="v-list-item__content" data-no-activator="">
              { hasTitle && (
                <VListItemTitle key="title">
                  { slots.title?.({ title: props.title }) ?? props.title }
                </VListItemTitle>
              )}

              { hasSubtitle && (
                <VListItemSubtitle key="subtitle">
                  { slots.subtitle?.({ subtitle: props.subtitle }) ?? props.subtitle }
                </VListItemSubtitle>
              )}

              { slots.default?.(slotProps.value) }
            </div>
          </div>
        ) : (
        <VListItem
          ref={ vListItemRef }
          { ...listItemProps }
          class={[
            'v-treeview-item',
            {
              'v-treeview-item--filtered': visibleIds.value && !visibleIds.value.has(id.value),
            },
            props.class,
          ]}
          ripple={ false }
          value={ id.value }
        >
          {{
            ...slots,
            prepend: hasPrepend ? slotProps => {
              return (
                <>
                  { props.toggleIcon && (
                    <VListItemAction start={ false }>
                      <VBtn
                        density="compact"
                        icon={ props.toggleIcon }
                        loading={ props.loading }
                        variant="text"
                        onClick={ props.onClick }
                      >
                        {{
                          loader () {
                            return (
                              <VProgressCircular
                                indeterminate="disable-shrink"
                                size="20"
                                width="2"
                              />
                            )
                          },
                        }}
                      </VBtn>
                    </VListItemAction>
                  )}

                  { slots.prepend?.(slotProps) }
                </>
              )
            } : undefined,
          }}
        </VListItem>
        )
    })

    return {}
  },
})

export type VTreeviewItem = InstanceType<typeof VTreeviewItem>
