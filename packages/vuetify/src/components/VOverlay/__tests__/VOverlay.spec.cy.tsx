/// <reference types="../../../../types/cypress" />

import { ref } from 'vue'
import { VLayout } from '@/components'
import { VOverlay } from '../VOverlay'
import { Application } from '../../../../cypress/templates'
import { VLayoutItem } from '@/components/VLayout'

describe('VOverlay', () => {
  it('without activator', () => {
    const model = ref(false)
    cy.mount(() => (
      <VLayout>
        <VOverlay v-model={ model.value }>
          <div data-test="content">Content</div>
        </VOverlay>
      </VLayout>
    ))
      .get('[data-test="content"]').should('not.exist')
      // .setProps({ modelValue: true })
      .then(() => {
        model.value = true
      })
      .get('[data-test="content"]').should('be.visible')
      .get('body').click()
      .get('[data-test="content"]').should('not.exist')
      .then(() => {
        expect(model.value).to.be.false
      })
  })

  it('should use activator', () => {
    cy.mount(() => (
      <VLayout>
        <VOverlay>
          {{
            activator: ({ props }) => <div { ...props } data-test="activator">Click me</div>,
            default: () => <div data-test="content">Content</div>,
          }}
        </VOverlay>
      </VLayout>
    ))
      .get('[data-test="content"]').should('not.exist')
      .get('[data-test="activator"]').should('exist').click()
      .get('[data-test="content"]').should('be.visible')
      .get('body').click()
      .get('[data-test="content"]').should('not.exist')
  })

  it('should have correct z-index inside layout item', () => {
    cy.mount(() => (
      <Application>
        <VLayoutItem position="left" size="300" modelValue data-test="layout-item">
          <VOverlay data-test="overlay">
            {{
              activator: ({ props }) => <div { ...props } data-test="activator">Click me</div>,
              default: () => <div data-test="content">Content</div>,
            }}
          </VOverlay>
        </VLayoutItem>
      </Application>
    ))

    cy.get('[data-test="activator"]').should('exist').click()

    cy.get('[data-test="layout-item"').should('have.css', 'z-index').then(zIndex => {
      cy.get('[data-test="overlay"]').should('have.css', 'z-index', String(Number(zIndex) + 1))
    })
  })
})
