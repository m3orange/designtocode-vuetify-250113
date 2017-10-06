function searchChildren (children) {
  const results = []
  for (const child of children) {
    if (child.isActive && (child.isDependent || (child.closeDependents && child.isDependent !== false))) {
      results.push(child)
    } else {
      results.push(...searchChildren(child.$children))
    }
  }
  return results
}

export function factory (opts = { closeDependents: true }) {
  return {
    props: {
      closeDependents: {
        type: Boolean,
        default: opts.closeDependents
      },
      isDependent: {
        type: Boolean,
        default: opts.isDependent
      }
    },

    methods: {
      getOpenDependents () {
        if (this.closeDependents) return searchChildren(this.$children)
        return []
      },
      getOpenDependentElements () {
        const result = []
        for (const dependent of this.getOpenDependents()) {
          result.push(...dependent.getClickableDependentElements())
        }
        return result
      },
      getClickableDependentElements () {
        const result = [this.$el]
        if (this.$refs.content) result.push(this.$refs.content)
        result.push(...this.getOpenDependentElements())
        return result
      }
    },

    watch: {
      isActive (val) {
        if (!val) {
          for (const dependent of this.getOpenDependents()) {
            dependent.isActive = false
          }
        }
      }
    }
  }
}

const Dependent = factory()

export default Dependent
