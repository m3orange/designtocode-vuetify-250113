/// <reference types="../../../../types/cypress" />

import { VDefaultsProvider, VForm } from '@/components'
import { ref } from 'vue'
import { VAutocomplete } from '../VAutocomplete'

describe('VAutocomplete', () => {
  it('should close only first chip', () => {
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

    const selectedItems = ['Item 1', 'Item 2', 'Item 3']

    cy.mount(() => (
      <VAutocomplete
        items={items}
        modelValue={selectedItems}
        chips
        closableChips
        multiple
      />
    ))
      .get('.v-chip__close')
      .eq(0)
      .click()
      .get('input')
      .get('.v-chip')
      .should('have.length', 2)
  })

  it('should have selected chip with array of strings', () => {
    const items = ref(['California', 'Colorado', 'Florida'])

    const selectedItems = ref(['California', 'Colorado'])

    cy.mount(() => (
      <VAutocomplete
        v-model={selectedItems.value}
        items={items.value}
        chips
        multiple
        closableChips
      />
    ))

    cy.get('.mdi-menu-down').click()

    cy.get('.v-list-item--active').should('have.length', 2)
    cy.get('.v-list-item--active input').eq(0).click().then(() => {
      expect(selectedItems.value).to.deep.equal(['Colorado'])
    })

    cy.get('.v-list-item--active').should('have.length', 1)

    cy
      .get('.v-chip__close')
      .eq(0)
      .click()
      .get('.v-chip')
      .should('have.length', 0)
      .should(() => expect(selectedItems.value).to.be.empty)
  })

  it('should have selected chip with return-object', () => {
    const items = ref([
      {
        title: 'Item 1',
        value: 'item1',
      },
      {
        title: 'Item 2',
        value: 'item2',
      },
    ])

    const selectedItems = ref([
      {
        title: 'Item 1',
        value: 'item1',
      },
    ])

    cy.mount(() => (
      <VAutocomplete
        v-model={selectedItems.value}
        items={items.value}
        returnObject
        chips
        multiple
      />
    ))

    cy.get('.mdi-menu-down').click()

    cy.get('.v-list-item--active').should('have.length', 1)
    cy.get('.v-list-item--active input').click().then(() => {
      expect(selectedItems.value).to.be.empty
    })
    cy.get('.v-list-item--active').should('have.length', 0)
  })

  it('should not be clickable when in readonly', () => {
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

    const selectedItems = 'Item 1'

    cy.mount(() => (
      <VAutocomplete
        items={items}
        modelValue={selectedItems}
        readonly
      />
    ))

    cy.get('.v-autocomplete')
      .click()
      .get('.v-list-item').should('have.length', 0)
      .get('.v-select--active-menu').should('have.length', 0)

    cy
      .get('.v-autocomplete input')
      .focus()
      .type('{downarrow}', { force: true })
      .get('.v-list-item').should('have.length', 0)
      .get('.v-select--active-menu').should('have.length', 0)
  })

  it('should not be clickable when in readonly form', () => {
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

    const selectedItems = 'Item 1'

    cy.mount(() => (
      <VForm readonly>
        <VAutocomplete
          items={items}
          modelValue={selectedItems}
          readonly
        />
      </VForm>
    ))

    cy.get('.v-autocomplete')
      .click()
      .get('.v-list-item').should('have.length', 0)
      .get('.v-select--active-menu').should('have.length', 0)

    cy
      .get('.v-autocomplete input')
      .focus()
      .type('{downarrow}', { force: true })
      .get('.v-list-item').should('have.length', 0)
      .get('.v-select--active-menu').should('have.length', 0)
  })

  describe('hide-selected', () => {
    it('should hide selected item(s)', () => {
      const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

      const selectedItems = ['Item 1', 'Item 2']

      cy.mount(() => (
        <VAutocomplete
          items={items}
          modelValue={selectedItems}
          hideSelected
          multiple
        />
      ))

      cy.get('.mdi-menu-down').click()

      cy.get('.v-overlay__content .v-list-item').should('have.length', 2)
      cy.get('.v-overlay__content .v-list-item .v-list-item-title').eq(0).should('have.text', 'Item 3')
      cy.get('.v-overlay__content .v-list-item .v-list-item-title').eq(1).should('have.text', 'Item 4')
    })
  })

  describe('global configuration', () => {
    it('should only apply \'v-autocomplete\' class to root element and also apply global config class/style', () => {
      cy.mount(() => (
        <VDefaultsProvider defaults={ {
          global: {
            class: 'v-global-class',
            style: {
              opacity: 0.5,
            },
          },
          VAutocomplete: {
            class: 'v-autocomplete-alt',
            style: {
              margin: '1px',
            },
          },
          VTextField: {
            class: 'v-textfield-alt',
            style: {
              padding: '1px',
            },
          },
          VInput: {
            class: 'v-input-alt',
            style: {
              color: 'black',
            },
          },
        } }
        >

          <VAutocomplete />
        </VDefaultsProvider>
      ))

      cy.get('.v-autocomplete')
        .should('have.length', 1)
        // assert it's the root element
        .should('have.class', 'v-input')
        .should('have.class', 'v-autocomplete-alt') // VAutocomplete class takes highest priority
        .should('have.css', 'margin', '1px') // VAutocomplete style takes highest priority
        .should('have.css', 'padding', '0px') // Ignore VTextField global style
        .should('have.css', 'color', 'rgb(0, 0, 0)') // Ignore VInput global style
        .should('have.css', 'opacity', '1') // Ignore global style

      cy.get('.v-autocomplete.v-global-class').should('not.exist') // Ignore global class
      cy.get('.v-autocomplete.v-textfield-alt').should('not.exist') // Ignore VTextField global class
      cy.get('.v-autocomplete.v-input-alt').should('not.exist') // Ignore VInput global style
    })
  })
})
