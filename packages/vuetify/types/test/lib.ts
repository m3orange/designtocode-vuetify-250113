import Vue from 'vue'

import Vuetify, {
  VBtn,
  VCard,
  VCardText,
  directives,
  colors
} from 'vuetify/lib'
import { VuetifyParsedTheme } from '../services/theme';

Vuetify.install(Vue, {
  components: {
    VBtn,
    VCard,
    VCardText
  },
  directives,
  theme: {
    themes: {
      dark: {
        primary: colors.green.base,
        secondary: colors.blueGrey.base
      }
    } as any
  }
})

new Vuetify()

new Vuetify({})

new Vuetify({
  breakpoint: {},
})

new Vuetify({
  breakpoint: {
    scrollBarWidth: 20,
  },
})

new Vuetify({
  breakpoint: {
    thresholds: {
      lg: 1,
      md: 2,
      sm: 3,
      xs: 4,
    },
  },
})

new Vuetify({
  icons: {
    iconfont: 'fa'
  },
})

new Vuetify({
  icons: {
    iconfont: 'fa',
    values: {
      cancel: 'foo',
    },
  },
})

new Vuetify({
  locale: {
    locales: {
      foo: {
        'bar': 'baz',
      },
    },
  },
})

new Vuetify({
  locale: {
    current: 'foo',
    locales: {
      foo: {
        'bar': 'baz',
      },
    },
  },
})

new Vuetify({
  locale: {
    current: 'foo',
    locales: {
      foo: {
        'bar': 'baz',
      },
    },
    t: (key: string) => key,
  },
})

new Vuetify({
  locale: {
    current: 'foo',
    locales: {
      foo: {
        'bar': 'baz',
      },
    },
    t: (key: string, ...params: Array<string | number>) => key,
  },
})

new Vuetify({
  theme: {},
})

new Vuetify({
  theme: {
    dark: true,
  },
})

new Vuetify({
  theme: {
    disable: true,
  },
})

new Vuetify({
  theme: {
    default: 'dark',
  },
})

new Vuetify({
  theme: {
    themes: {
      dark: {
        success: '#012345',
      },
      light: {
        success: '#012345',
      },
    },
  },
})

new Vuetify({
  theme: {
    options: {
      cspNonce: 'foo',
      customProperties: true,
      minifyTheme: (css: string) => css,
      themeCache: {
        get: (parsedTheme: VuetifyParsedTheme) => '',
        set: (parsedTheme: VuetifyParsedTheme, css: string) => {},
      },
    }
  },
})
