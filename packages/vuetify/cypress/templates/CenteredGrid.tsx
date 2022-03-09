import { h, Fragment } from 'vue'

export const CenteredGrid = (_, { slots, attrs }) => {
  const width = attrs.width || 'auto'
  return (
    <div
      class="d-flex flex-column mx-auto py-2"
      style={{ width, gridGap: '1.2rem' }}
    >
      { slots.default() }
    </div>
  )
}
