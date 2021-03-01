// Utilities
import { inject, provide, computed, ref, onBeforeUnmount } from 'vue'
import propsFactory from '@/util/propsFactory'

// Types
import type { InjectionKey, Ref } from 'vue'

type Position = 'top' | 'left' | 'right' | 'bottom'

interface LayoutProvide {
  register: (id: string, position: Ref<Position>, amount: Ref<number | string>) => Ref<Record<string, unknown>>
  unregister: (id: string) => void
  padding: Ref<string>
}

export const VuetifyLayoutKey: InjectionKey<LayoutProvide> = Symbol.for('vuetify:layout')

export const makeLayoutItemProps = propsFactory({
  name: {
    type: String,
  },
})

export function useLayoutItem (id: string, position: Ref<Position>, amount: Ref<number | string>) {
  const layout = inject(VuetifyLayoutKey)

  if (!layout) throw new Error('Could not find injected Vuetify layout')

  const styles = layout.register(id, position, amount)

  onBeforeUnmount(() => layout.unregister(id))

  return styles
}

const generateLayers = (
  layout: string[],
  registered: string[],
  positions: Map<string, Ref<Position>>,
  amounts: Map<string, Ref<number | string>>
) => {
  let previousLayer = { top: 0, left: 0, right: 0, bottom: 0 }
  const layers = [{ id: '', layer: { ...previousLayer } }]
  const ids = !layout.length ? registered : layout.map(l => l.split(':')[0]).filter(l => registered.includes(l))
  for (const id of ids) {
    const position = positions.get(id)
    const amount = amounts.get(id)
    if (!position || !amount) continue

    const layer = {
      ...previousLayer,
      [position.value]: parseInt(previousLayer[position.value], 10) + parseInt(amount.value, 10),
    }

    layers.push({
      id,
      layer,
    })

    previousLayer = layer
  }

  return layers
}

// TODO: Remove undefined from layout and overlaps when vue typing for required: true prop is fixed
export function createLayout (props: { layout?: string[], overlaps?: string[] }) {
  const registered = ref<string[]>([])
  const positions = new Map<string, Ref<Position>>()
  const amounts = new Map<string, Ref<number | string>>()

  const computedOverlaps = computed(() => {
    const map = new Map<string, { position: Position, amount: number }>()
    const overlaps = props.overlaps ?? []
    for (const overlap of overlaps.filter(item => item.includes(':'))) {
      const [top, bottom] = overlap.split(':')
      if (!registered.value.includes(top) || !registered.value.includes(bottom)) continue

      const topPosition = positions.get(top)
      const bottomPosition = positions.get(bottom)
      const topAmount = amounts.get(top)
      const bottomAmount = amounts.get(bottom)

      if (!topPosition || !bottomPosition || !topAmount || !bottomAmount) continue

      map.set(bottom, { position: topPosition.value, amount: parseInt(topAmount.value, 10) })
      map.set(top, { position: bottomPosition.value, amount: -parseInt(bottomAmount.value, 10) })
    }

    return map
  })

  const layers = computed(() => {
    return generateLayers(props.layout ?? [], registered.value, positions, amounts)
  })

  const padding = computed(() => {
    const layer = layers.value[layers.value.length - 1].layer
    return `${layer.top}px ${layer.right}px ${layer.bottom}px ${layer.left}px`
  })

  provide(VuetifyLayoutKey, {
    register: (id: string, position: Ref<Position>, amount: Ref<number | string>) => {
      positions.set(id, position)
      amounts.set(id, amount)
      registered.value.push(id)

      return computed(() => {
        const index = layers.value.findIndex(l => l.id === id)

        if (index < 0) throw new Error(`Layout item "${id}" is missing from layout prop`)

        const item = layers.value[index - 1]

        const overlap = computedOverlaps.value.get(id)
        if (overlap) {
          item.layer[overlap.position] += overlap.amount
        }

        const isHorizontal = position.value === 'left' || position.value === 'right'
        const isOpposite = position.value === 'right'

        const amount = amounts.get(id)

        return {
          width: !isHorizontal ? `calc(100% - ${item.layer.left}px - ${item.layer.right}px)` : `${amount?.value ?? 0}px`,
          height: isHorizontal ? `calc(100% - ${item.layer.top}px - ${item.layer.bottom}px)` : `${amount?.value ?? 0}px`,
          marginLeft: isOpposite ? undefined : `${item.layer.left}px`,
          marginRight: isOpposite ? `${item.layer.right}px` : undefined,
          marginTop: position.value !== 'bottom' ? `${item.layer.top}px` : undefined,
          marginBottom: position.value !== 'top' ? `${item.layer.bottom}px` : undefined,
          [position.value]: 0,
          zIndex: layers.value.length - index,
        }
      })
    },
    unregister: (id: string) => {
      positions.delete(id)
      amounts.delete(id)
      registered.value = registered.value.filter(v => v !== id)
    },
    padding,
  })
}
