/// <reference types="../../../../types/cypress" />

import { VAppBar, VDefaultsProvider } from '@/components'
import { VLayout } from '@/components/VLayout'
// Components
import { VMain } from '@/components/VMain'

// Constants
const SCROLL_OPTIONS = { ensureScrollable: true, duration: 200 }

describe('VAppBar', () => {
  it('should allow custom height', () => {
    cy
      .mount(({ height }: any) => (
        <VLayout>
          <VAppBar height={ height } />
        </VLayout>
      ))
      .get('.v-app-bar').should('have.css', 'height', '64px')
      .setProps({ height: 128 })
      .get('.v-app-bar').should('have.css', 'height', '128px')
  })

  it('should support density', () => {
    cy
      .mount(({ density = 'default' }: any) => (
        <VLayout>
          <VAppBar density={ density } />
        </VLayout>
      ))
      .get('.v-app-bar').should('have.css', 'height', '64px')
      .setProps({ density: 'prominent' })
      .get('.v-app-bar').should('have.css', 'height', '128px')
      .setProps({ density: 'comfortable' })
      .get('.v-app-bar').should('have.css', 'height', '56px')
      .setProps({ density: 'compact' })
      .get('.v-app-bar').should('have.css', 'height', '48px')
  })

  it('should support scroll behavior', () => {
    cy
      .mount(({ scrollBehavior, image }: any) => (
        <VLayout>
          <VAppBar
            image={ image }
            scrollBehavior={ scrollBehavior }
          />

          <VMain style="min-height: 200vh;" />
        </VLayout>
      ))
      .setProps({ scrollBehavior: 'hide' })
      .get('.v-app-bar').should('be.visible')
      .window().scrollTo(0, 500, SCROLL_OPTIONS)
      .get('.v-app-bar').should('not.be.visible')
      .window().scrollTo(0, 250, SCROLL_OPTIONS)
      .get('.v-app-bar').should('be.visible')
      .window().scrollTo(0, 0, SCROLL_OPTIONS)
      .get('.v-app-bar').should('be.visible')
      .setProps({ scrollBehavior: 'inverted' })
      .get('.v-app-bar').should('be.visible')
      .window().scrollTo(0, 500, SCROLL_OPTIONS)
      .get('.v-app-bar').should('not.be.visible')
      .window().scrollTo(0, 250, SCROLL_OPTIONS)
      .get('.v-app-bar').should('not.be.visible')
      .window().scrollTo(0, 0, SCROLL_OPTIONS)
      .get('.v-app-bar').should('be.visible')
      .setProps({ scrollBehavior: 'collapse' })
      .get('.v-app-bar').should('be.visible')
      .get('.v-app-bar').should('have.not.class', 'v-toolbar--collapse')
      .window().scrollTo(0, 500, SCROLL_OPTIONS)
      .get('.v-app-bar').should('have.class', 'v-toolbar--collapse')
      .window().scrollTo(0, 0, SCROLL_OPTIONS)
      .setProps({ scrollBehavior: 'elevate' })
      .get('.v-app-bar').should('have.class', 'v-toolbar--flat')
      .window().scrollTo(0, 500, SCROLL_OPTIONS)
      .get('.v-app-bar').should('have.not.class', 'v-toolbar--flat')
      .window().scrollTo(0, 0, SCROLL_OPTIONS)
      .setProps({ scrollBehavior: 'hide inverted' })
      .get('.v-app-bar').should('not.be.visible')
      .window().scrollTo(0, 500, SCROLL_OPTIONS)
      .get('.v-app-bar').should('be.visible')
      .window().scrollTo(0, 0, SCROLL_OPTIONS)
      .get('.v-app-bar').should('not.be.visible')
      .setProps({
        image: 'https://picsum.photos/1920/1080?random',
        scrollBehavior: 'fade-image',
      })
      .get('.v-toolbar__image').should('have.css', 'opacity', '1')
      .window().scrollTo(0, 100, SCROLL_OPTIONS)
      .get('.v-toolbar__image').should('have.css', 'opacity', '0.5')
      .window().scrollTo(0, 200, SCROLL_OPTIONS)
      .get('.v-toolbar__image').should('have.css', 'opacity', '0')
      .window().scrollTo(0, 50, SCROLL_OPTIONS)
      .get('.v-toolbar__image').should('have.css', 'opacity', '0.8')
      .window().scrollTo(0, 0, SCROLL_OPTIONS)
      .get('.v-toolbar__image').should('have.css', 'opacity', '1')
  })

  describe('global configuration', () => {
    it('should only apply \'v-app-bar\' class to root element and also apply global config class/style', () => {
      cy.mount(() => (
        <VLayout>
          <VDefaultsProvider defaults={{
            global: {
              class: 'v-global-class',
              style: {
                opacity: 0.5,
              },
            },
            VAppBar: {
              class: 'v-app-bar-alt',
              style: {
                margin: '1px',
              },
            },
            VToolbar: {
              class: 'v-toolbar-alt',
              style: {
                padding: '1px',
              },
            },
          }}
          >

            <VAppBar />
          </VDefaultsProvider>
        </VLayout>
      ))

      cy.get('.v-app-bar')
        .should('have.length', 1)
        // assert it's the root element
        .should('have.class', 'v-toolbar')
        .should('have.class', 'v-app-bar-alt') // VAppBar class takes highest priority
        .should('have.css', 'margin', '1px') // VAppBar style takes highest priority
        .should('have.css', 'padding', '0px') // Ignore VToolbar global style
        .should('have.css', 'opacity', '1') // Ignore global style

      cy.get('.v-app-bar.v-global-class').should('not.exist') // Ignore global class
      cy.get('.v-app-bar.v-toolbar-alt').should('not.exist') // Ignore VToolbar global class
    })
  })
})
