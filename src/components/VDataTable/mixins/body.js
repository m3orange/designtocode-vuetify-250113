import ExpandTransitionGenerator from '../../transitions/expand-transition'

export default {
  methods: {
    genTBody () {
      const children = []

      if (!this.itemsLength && !this.items.length) {
        const noData = this.$slots['no-data'] || this.noDataText
        children.push(this.genEmptyBody(noData))
      } else if (!this.filteredItems.length) {
        const noResults = this.$slots['no-results'] || this.noResultsText
        children.push(this.genEmptyBody(noResults))
      } else {
        children.push(this.genFilteredItems())
      }

      return this.$createElement('tbody', children)
    },
    genExpandedRow (props) {
      const children = []

      if (this.isExpanded(props.item)) {
        const expand = this.$createElement('div', {
          class: 'datatable__expand-content',
          key: props.item[this.itemKey]
        }, this.$scopedSlots.expand(props))

        children.push(expand)
      }

      const transition = this.$createElement('transition-group', {
        class: 'datatable__expand-col',
        attrs: { colspan: '100%' },
        props: {
          tag: 'td'
        },
        on: ExpandTransitionGenerator('datatable__expand-col--expanded')
      }, children)

      return this.genTR([transition], { class: 'datatable__expand-row' })
    },
    genFilteredItems () {
      const rows = []
      this.filteredItems.forEach((item, index) => {
        const props = this.createProps(item, index)
        const row = this.$scopedSlots.items
          ? this.$scopedSlots.items(props)
          : []

        rows.push(this.needsTR(row)
          ? this.genTR(row, {
            attrs: { active: this.isSelected(item) }
          })
          : row)

        if (this.$scopedSlots.expand) {
          const expandRow = this.genExpandedRow(props)
          rows.push(expandRow)
        }
      })

      return rows
    },
    genEmptyBody (content) {
      return this.genTR([this.$createElement('td', {
        'class': 'text-xs-center',
        attrs: { colspan: '100%' }
      }, content)])
    }
  }
}
