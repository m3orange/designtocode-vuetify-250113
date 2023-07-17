// Styles
import './VMenu.sass'

// Components
import { VDialogTransition } from '@/components/transitions'
import { VDefaultsProvider } from '@/components/VDefaultsProvider'
import { VOverlay } from '@/components/VOverlay'
import { makeVOverlayProps } from '@/components/VOverlay/VOverlay'

// Composables
import { forwardRefs } from '@/composables/forwardRefs'
import { useProxiedModel } from '@/composables/proxiedModel'
import { useScopeId } from '@/composables/scopeId'

// Utilities
import { computed, inject, mergeProps, provide, ref, shallowRef, watch } from 'vue'
import { VMenuSymbol } from './shared'
import { focusChild, genericComponent, getUid, omit, propsFactory, useRender } from '@/util'

// Types
import type { Component } from 'vue'
import type { OverlaySlots } from '@/components/VOverlay/VOverlay'

export const makeVMenuProps = propsFactory({
  // TODO
  // disableKeys: Boolean,
  id: String,

  ...omit(makeVOverlayProps({
    closeDelay: 250,
    closeOnContentClick: true,
    locationStrategy: 'connected' as const,
    openDelay: 300,
    scrim: false,
    scrollStrategy: 'reposition' as const,
    transition: { component: VDialogTransition as Component },
  }), ['absolute']),
}, 'VMenu')

export const VMenu = genericComponent<OverlaySlots>()({
  name: 'VMenu',

  props: makeVMenuProps(),

  emits: {
    'update:modelValue': (value: boolean) => true,
  },

  setup (props, { slots }) {
    const isActive = useProxiedModel(props, 'modelValue')
    const { scopeId } = useScopeId()

    const uid = getUid()
    const id = computed(() => props.id || `v-menu-${uid}`)

    const overlay = ref<VOverlay>()

    const parent = inject(VMenuSymbol, null)
    const openChildren = shallowRef(0)
    provide(VMenuSymbol, {
      register () {
        ++openChildren.value
      },
      unregister () {
        --openChildren.value
      },
      closeParents () {
        setTimeout(() => {
          if (!openChildren.value) {
            isActive.value = false
            parent?.closeParents()
          }
        }, 40)
      },
    })

    watch(isActive, val => {
      val ? parent?.register() : parent?.unregister()
    })

    function onClickOutside () {
      parent?.closeParents()
    }

    function onKeydown (e: KeyboardEvent) {
      if (props.disabled) return

      if (e.key === 'Tab') {
        isActive.value = false
        overlay.value?.activatorEl?.focus()
      }
    }

    function onActivatorKeydown (e: KeyboardEvent) {
      if (props.disabled) return

      const el = overlay.value?.contentEl
      if (el && isActive.value) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          focusChild(el, 'next')
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          focusChild(el, 'prev')
        }
      } else if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
        isActive.value = true
        e.preventDefault()
        setTimeout(() => setTimeout(() => onActivatorKeydown(e)))
      }
    }

    const activatorProps = computed(() =>
      mergeProps({
        'aria-haspopup': 'menu',
        'aria-expanded': String(isActive.value),
        'aria-owns': id.value,
        onKeydown: onActivatorKeydown,
      }, props.activatorProps)
    )

    useRender(() => {
      const [overlayProps] = VOverlay.filterProps(props)

      return (
        <VOverlay
          ref={ overlay }
          class={[
            'v-menu',
            props.class,
          ]}
          style={ props.style }
          { ...overlayProps }
          v-model={ isActive.value }
          absolute
          activatorProps={ activatorProps.value }
          onClick:outside={ onClickOutside }
          onKeydown={ onKeydown }
          { ...scopeId }
        >
          {{
            activator: slots.activator,
            default: (...args) => (
              <VDefaultsProvider root="VMenu">
                { slots.default?.(...args) }
              </VDefaultsProvider>
            ),
          }}
        </VOverlay>
      )
    })

    return forwardRefs({ id, ΨopenChildren: openChildren }, overlay)
  },
})

export type VMenu = InstanceType<typeof VMenu>
