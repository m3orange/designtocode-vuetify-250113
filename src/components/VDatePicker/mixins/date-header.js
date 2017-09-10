export default {
  methods: {
    genBtn (change, children) {
      return this.$createElement('v-btn', {
        props: {
          dark: this.dark,
          icon: true
        },
        nativeOn: {
          click: e => {
            e.stopPropagation()
            if (this.activePicker === 'DATE') {
              this.tableDate = new Date(this.tableYear, change)
            } else if (this.activePicker === 'MONTH') {
              this.tableDate = new Date(change, this.tableMonth)
            }
          }
        }
      }, children)
    },

    genHeader (keyValue, selectorText) {
      const header = this.$createElement('strong', {
        key: keyValue,
        on: {
          click: () => this.activePicker = this.activePicker === 'DATE' ? 'MONTH' : 'YEAR'
        }
      }, selectorText)

      const transition = this.$createElement('transition', {
        props: { name: this.computedTransition }
      }, [header])

      return this.$createElement('div', {
        'class': 'picker--date__header-selector-date'
      }, [transition])
    },

    genSelector () {
      const keyValue = this.activePicker === 'DATE' ? this.tableMonth : this.tableYear
      const selectorDate = new Date(this.tableYear, this.tableMonth, 1, 1 /* Workaround for #1409 */)
      let selectorText
      if (this.activePicker === 'DATE') {
        selectorText = typeof this.headerDateFormat === 'function' ? this.headerDateFormat(selectorDate) : selectorDate.toLocaleString(this.locale, this.headerDateFormat)
      } else {
        selectorText = selectorDate.toLocaleString(this.locale, { year: 'numeric' })
      }

      return this.$createElement('div', {
        'class': 'picker--date__header-selector'
      }, [
        this.genBtn(keyValue - 1, [
          this.$createElement('v-icon', 'chevron_left')
        ]),
        this.genHeader(keyValue, selectorText),
        this.genBtn(keyValue + 1, [
          this.$createElement('v-icon', 'chevron_right')
        ])
      ])
    }
  }
}
