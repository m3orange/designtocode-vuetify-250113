import { factory as PositionableFactory } from './positionable'

export default function applicationable (value, events = []) {
  return {
    name: 'applicationable',

    mixins: [PositionableFactory(['absolute', 'fixed'])],

    props: {
      app: Boolean
    },

    computed: {
      applicationProperty () {
        return value
      }
    },

    watch: {
      // If previous value was app
      // reset the provided prop
      app (x, prev) {
        prev
          ? this.removeApplication()
          : this.callUpdate()
      }
    },

    created () {
      this.$vuetify.application['activeuid'] = this._uid

      for (let i = 0, length = events.length; i < length; i++) {
        this.$watch(events[i], this.callUpdate)
      }
      this.callUpdate()
    },

    destroyed () {
      this.app && this.removeApplication()
    },

    methods: {
      callUpdate () {
        if (!this.app) return

        this.$vuetify.application[this.applicationProperty] = this.updateApplication()
      },
      removeApplication () {
        if (this.$vuetify.application['activeuid'] === this._uid) {
          this.$vuetify.application[this.applicationProperty] = 0
        }
      },
      updateApplication: () => {}
    }
  }
}
