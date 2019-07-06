declare module 'vuetify/es5/install' {
  import { VueConstructor } from 'vue'

  const install: (Vue: VueConstructor, args: {}) => void

  export { install }
}
declare module 'vuetify/es5/components/Vuetify' {
  import Vuetify from 'vuetify'

  export default Vuetify
}

declare module 'vuetify/es5/components/*' {
  import { ComponentOrPack } from 'vuetify'
  import { VueConstructor } from 'vue'

  const VuetifyComponent: {
    // FIX: The & VueConstructor is a lie.
    // This might not be a valid component.
    // But registering arbitrary objects as components is the status quo.
    default: ComponentOrPack & VueConstructor
    [key: string]: ComponentOrPack & VueConstructor
  }

  export = VuetifyComponent
}

declare module 'vuetify/es5/directives' {
  import { DirectiveOptions, PluginFunction } from 'vue'

  const clickOutside: DirectiveOptions
  const ripple: DirectiveOptions
  const resize: DirectiveOptions
  const scroll: DirectiveOptions
  const touch: DirectiveOptions

  export {
    clickOutside,
    ripple,
    resize,
    scroll,
    touch
  }
}

declare module 'vuetify/lib/install' {
  import { VueConstructor } from 'vue'

  const install: (Vue: VueConstructor, args: {}) => void

  export { install }
}
declare module 'vuetify/lib/components/Vuetify' {
  import Vuetify from 'vuetify'

  export default Vuetify
}

declare module 'vuetify/lib/components/*' {
  import { ComponentOrPack } from 'vuetify'
  import { VueConstructor } from 'vue'

  const VuetifyComponent: {
    // FIX: The & VueConstructor is a lie.
    // This might not be a valid component.
    // But registering arbitrary objects as components is the status quo.
    default: ComponentOrPack & VueConstructor
    [key: string]: ComponentOrPack & VueConstructor
  }

  export = VuetifyComponent
}

declare module 'vuetify/lib/directives' {
  import { DirectiveOptions, PluginFunction } from 'vue'

  const clickOutside: DirectiveOptions
  const ripple: DirectiveOptions
  const resize: DirectiveOptions
  const scroll: DirectiveOptions
  const touch: DirectiveOptions

  export {
    clickOutside,
    ripple,
    resize,
    scroll,
    touch
  }
}

