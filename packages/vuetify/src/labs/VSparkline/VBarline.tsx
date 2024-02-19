// Utilities
import { computed } from 'vue'
import { makeLineProps } from './util/line'
import { genericComponent, propsFactory, useRender } from '@/util'

// Types
export type VBarlineSlots = {
  default: void
  label: void
}

export type SparklineItem = number | { value: number }

export type SparklineText = {
  x: number
  value: string
}

export interface Boundary {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export interface Bar {
  x: number
  y: number
  height: number
  value: number
}

export const makeVBarlineProps = propsFactory({
  autoLineWidth: Boolean,

  ...makeLineProps(),
}, 'VBarline')

export const VBarline = genericComponent<VBarlineSlots>()({
  name: 'VBarline',

  props: makeVBarlineProps(),

  setup (props, { slots }) {
    const hasLabels = computed(() => {
      return Boolean(
        props.showLabels ||
        props.labels.length > 0 ||
        !!slots?.label
      )
    })

    const lineWidth = computed(() => parseFloat(props.lineWidth) || 4)

    const totalWidth = computed(() => Math.max(props.modelValue.length * lineWidth.value, Number(props.width)))

    const boundary = computed<Boundary>(() => {
      return {
        minX: 0,
        maxX: totalWidth.value,
        minY: 0,
        maxY: parseInt(props.height, 10),
      }
    })

    function genBars (
      values: number[],
      boundary: Boundary
    ): Bar[] {
      const { minX, maxX, minY, maxY } = boundary
      const totalValues = values.length
      let maxValue = Math.max(...values)
      let minValue = Math.min(...values)

      if (minValue > 0) minValue = 0
      if (maxValue < 0) maxValue = 0

      const gridX = maxX / totalValues
      const gridY = (maxY - minY) / ((maxValue - minValue) || 1)
      const horizonY = maxY - Math.abs(minValue * gridY)

      return values.map((value, index) => {
        const height = Math.abs(gridY * value)

        return {
          x: minX + index * gridX,
          y: horizonY - height +
            +(value < 0) * height,
          height,
          value,
        }
      })
    }

    const parsedLabels = computed(() => {
      const labels = []
      const points = genBars(
        props.modelValue.map(item => (typeof item === 'number' ? item : item.value)),
        boundary.value
      )
      const len = points.length

      for (let i = 0; labels.length < len; i++) {
        const item = points[i]
        let value = props.labels[i]

        if (!value) {
          value = typeof item === 'object'
            ? item.value
            : item
        }

        labels.push({
          x: item.x,
          value: String(value),
        })
      }

      return labels
    })

    const bars = computed(() => genBars(props.modelValue.map(item => (typeof item === 'number' ? item : item.value)), boundary.value))
    const offsetX = computed(() => (Math.abs(bars.value[0].x - bars.value[1].x) - lineWidth.value) / 2)

    useRender(() => {
      const gradientData = !props.gradient.slice().length ? [''] : props.gradient.slice().reverse()
      return (
        <svg
          display="block"
          viewBox={ `0 0 ${Math.max(props.modelValue.length * lineWidth.value, Number(props.width))} ${hasLabels.value
                  ? parseInt(props.height, 10) + parseInt(props.labelSize, 10) * 1.5
                  : parseInt(props.height, 10)}` }
        >
          <defs>
            <linearGradient
              id="1"
              gradientUnits="userSpaceOnUse"
              x1={ props.gradientDirection === 'left' ? '100%' : '0' }
              y1={ props.gradientDirection === 'top' ? '100%' : '0' }
              x2={ props.gradientDirection === 'right' ? '100%' : '0' }
              y2={ props.gradientDirection === 'bottom' ? '100%' : '0' }
            >
              {
                gradientData.map((color, index) => (
                  <stop offset={ index / (Math.max(gradientData.length - 1, 1)) } stop-color={ color || 'currentColor' } />
                ))
              }
            </linearGradient>
          </defs>

          <clipPath id={ `sparkline-bar-${1}-clip` }>
            {
              bars.value.map(item => (
                <rect
                  x={ item.x + offsetX.value }
                  y={ item.y }
                  width={ lineWidth.value }
                  height={ item.height }
                  rx={ typeof props.smooth === 'number'
                    ? props.smooth
                    : props.smooth ? 2 : 0 }
                  ry={ typeof props.smooth === 'number'
                    ? props.smooth
                    : props.smooth ? 2 : 0 }
                >
                  {
                    props.autoDraw ? (
                      <animate
                        attributeName="height"
                        from="0"
                        to={ item.height }
                        dur={ `${props.autoDrawDuration}ms` }
                        fill="freeze"
                      ></animate>
                    ) : undefined as never
                  }
                </rect>
              ))
            }
          </clipPath>

          { hasLabels.value && (
            <g
              key="labels"
              style={{
                fontSize: 8,
                textAnchor: 'middle',
                dominantBaseline: 'mathematical',
                fill: 'currentColor',
              }}
            >
              {
                parsedLabels.value.map((item, i) => (
                  <text
                    x={ item.x + (offsetX.value / 2) + lineWidth.value / 2 }
                    y={ (parseInt(props.height, 10)) + (parseInt(props.labelSize, 10) || 7 * 0.75) }
                    font-size={ Number(props.labelSize) || 7 }
                  >
                    <slot name="label" index={ i } value={ item.value } >
                      { item.value }
                    </slot>
                  </text>
                ))
              }
            </g>
          )}

          <g
            clip-path={ `url(#sparkline-bar-${1}-clip)` }
            fill={ `url(#${1})` }
          >
            <rect
              x={ 0 }
              y={ 0 }
              width={ Math.max(props.modelValue.length * lineWidth.value, Number(props.width)) }
              height={ props.height }
            ></rect>
          </g>
        </svg>
      )
    })
  },
})

export type VBarline = InstanceType<typeof VBarline>
