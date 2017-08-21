
export default {
  methods: {
    genYearIcon () {
      return this.yearIcon
        ? this.$createElement('v-icon', {
          props: {
            dark: true
          }
        }, this.yearIcon)
        : null
    },
    genTitle () {
      let date = new Date(this.year, this.month, 1, 12 /* Workaround for #1409 */)

      date = date.toLocaleString(this.locale, { month: 'long' }).trim()

      const text = this.$createElement('transition', {
        props: {
          name: 'slide-x-transition',
          mode: 'out-in'
        }
      }, [
        this.$createElement('div', {
          domProps: { innerHTML: date },
          key: date
        })
      ])

      return this.$createElement('div', {
        'class': 'picker__title'
      }, [
        this.$createElement('div', {
          'class': {
            'picker--date__title-year': true,
            'active': this.isSelected
          },
          on: {
            click: e => {
              e.stopPropagation()
              this.isSelected = true
            }
          }
        }, [
          this.year,
          this.genYearIcon()
        ]),
        this.$createElement('div', {
          'class': {
            'picker--date__title-date': true,
            'active': !this.isSelected
          },
          on: {
            click: e => {
              e.stopPropagation()
              this.isSelected = false
            }
          }
        }, [text])
      ])
    }
  }
}
