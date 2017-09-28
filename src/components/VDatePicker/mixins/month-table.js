export default {
  methods: {
    monthWheelScroll (e) {
      e.preventDefault()

      let year = this.tableYear

      if (e.deltaY < 0) year++
      else year--

      this.tableDate = new Date(year, 0)
    },
    monthClick (month) {
      const tableYear = this.tableYear
      const monthStr = month < 9 ? `0${month + 1}` : (month + 1)
      const day = this.day < 10 ? `0${this.day}` : this.day

      this.inputDate = `${tableYear}-${monthStr}-${day}T12:00:00`
      if (this.type === 'date') {
        this.activePicker = 'DATE'
      } else {
        this.$nextTick(() => (this.autosave && this.save()))
      }
    },
    monthGenTD (month) {
      const date = new Date(this.tableYear, month, 1, 12, 0, 0, 0)
      let monthName

      if (typeof this.monthFormat === 'function') {
        monthName = this.monthFormat(date)
      } else if (this.supportsLocaleFormat) {
        monthName = date.toLocaleDateString(this.locale, this.monthFormat)
      } else {
        monthName = date.getMonth() + 1
        if (monthName < 10) {
          monthName = `0${monthName}`
        }
      }

      return this.$createElement('td', [
        this.$createElement('button', {
          'class': {
            'btn btn--date-picker': true,
            'btn--raised': this.monthIsActive(month),
            'btn--flat': true,
            'btn--active': this.monthIsActive(month),
            'btn--outline': this.monthIsCurrent(month) && !this.monthIsActive(month),
            'btn--disabled': this.type === 'month' && !this.isAllowed(date)
          },
          attrs: {
            type: 'button'
          },
          domProps: {
            innerHTML: `<span class="btn__content">${monthName}</span>`
          },
          on: {
            click: () => this.monthClick(month)
          }
        })
      ])
    },
    monthGenTBody () {
      const children = []
      const cols = Array(3).fill(null)
      const rows = 12 / cols.length

      for (let row = 0; row < rows; row++) {
        children.push(this.$createElement('tr', cols.map((_, col) => {
          return this.monthGenTD(row * cols.length + col)
        })))
      }

      return this.$createElement('tbody', children)
    },
    monthIsActive (i) {
      return this.tableYear === this.year &&
        this.month === i
    },
    monthIsCurrent (i) {
      return this.currentYear === this.tableYear &&
        this.currentMonth === i
    }
  }
}
