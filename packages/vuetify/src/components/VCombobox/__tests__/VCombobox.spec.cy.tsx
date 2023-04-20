/// <reference types="../../../../types/cypress" />

import { VDefaultsProvider } from '@/components/VDefaultsProvider'
import { VForm } from '@/components'
import { VCombobox } from '../VCombobox'
import { Application } from '@/../cypress/templates'
import { ref } from 'vue'
import { keyValues } from '@/util'

describe('VCombobox', () => {
  describe('closableChips', () => {
    it('should close only first chip', () => {
      const items = [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ]

      const selectedItems = [
        'Item 1',
        'Item 2',
        'Item 3',
      ]

      cy.mount(() => (
        <VCombobox items={ items } modelValue={ selectedItems } multiple closableChips chips />
      ))
        .get('.v-chip__close').eq(0)
        .click()
      cy.get('input').should('exist')
      cy.get('.v-chip')
        .should('have.length', 2)
    })
  })

  describe('complex objects', () => {
    it('single', () => {
      const items = [
        { title: 'Item 1', value: 'item1' },
        { title: 'Item 2', value: 'item2' },
        { title: 'Item 3', value: 'item3' },
        { title: 'Item 4', value: 'item4' },
      ]
      const model = ref()
      const search = ref()
      const updateModel = cy.stub().as('model').callsFake(val => model.value = val)
      const updateSearch = cy.stub().as('search').callsFake(val => search.value = val)

      cy.mount(() => (
        <VCombobox
          modelValue={ model.value }
          search={ search.value }
          onUpdate:modelValue={ updateModel }
          onUpdate:search={ updateSearch }
          items={ items }
        />
      ))
        .get('input')
        .click()
      cy.get('.v-list-item').eq(0)
        .click({ waitForAnimations: false })
      cy.should(() => {
        expect(model.value).to.deep.equal(items[0])
        expect(search.value).to.deep.equal(items[0].title)
      })
      cy.get('input')
        .should('have.value', items[0].title)
        .blur()
      cy.get('.v-combobox__selection')
        .should('contain', items[0].title)

      cy.get('input').click()
      cy.get('input').clear()
      cy.get('input').type('Item 2')
      cy.should(() => {
        expect(model.value).to.equal('Item 2')
        expect(search.value).to.equal('Item 2')
      })
      cy.get('input')
        .should('have.value', 'Item 2')
        .blur()
      cy.get('.v-combobox__selection')
        .should('contain', 'Item 2')

      cy.get('input').click()
      cy.get('input').clear()
      cy.get('input').type('item3')
      cy.should(() => {
        expect(model.value).to.equal('item3')
        expect(search.value).to.equal('item3')
      })
      cy.get('input')
        .should('have.value', 'item3')
        .blur()
      cy.get('.v-combobox__selection')
        .should('contain', 'item3')
    })

    it('multiple', () => {
      const items = [
        { title: 'Item 1', value: 'item1' },
        { title: 'Item 2', value: 'item2' },
        { title: 'Item 3', value: 'item3' },
        { title: 'Item 4', value: 'item4' },
      ]
      const model = ref<(string | typeof items[number])[]>([])
      const search = ref()
      const updateModel = cy.stub().as('model').callsFake(val => model.value = val)
      const updateSearch = cy.stub().as('search').callsFake(val => search.value = val)

      cy.mount(() => (
        <VCombobox
          modelValue={ model.value }
          search={ search.value }
          onUpdate:modelValue={ updateModel }
          onUpdate:search={ updateSearch }
          multiple
          items={ items }
        />
      ))
        .get('.v-field input')
        .click()
      cy.get('.v-list-item').eq(0)
        .click({ waitForAnimations: false })
      cy.then(() => {
        expect(model.value).to.deep.equal([items[0]])
        expect(search.value).to.be.undefined
      })
      cy.get('.v-field input').as('input')
        .should('have.value', '')
      cy.get('.v-combobox__selection')
        .should('contain', items[0].title)

      cy.get('@input').click()
      cy.get('@input').type('Item 2')
      cy.get('@input').blur()
      cy.should(() => {
        expect(model.value).to.deep.equal([items[0], 'Item 2'])
        expect(search.value).to.equal('')
      })
      cy.get('@input').should('have.value', '')
      cy.get('.v-combobox__selection')
        .should('contain', 'Item 2')

      cy.get('@input').click()
      cy.get('@input').type('item3')
      cy.get('@input').blur()
      cy.should(() => {
        expect(model.value).to.deep.equal([items[0], 'Item 2', 'item3'])
        expect(search.value).to.equal('')
      })
      cy.get('@input').should('have.value', '')
      cy.get('.v-combobox__selection')
        .should('contain', 'item3')
    })
  })

  describe('search', () => {
    it('should filter items', () => {
      const items = [
        'Item 1',
        'Item 1a',
        'Item 2',
        'Item 2a',
      ]

      cy.mount(() => (
        <VCombobox items={ items } />
      ))
        .get('input')
        .type('Item')
      cy.get('.v-list-item')
        .should('have.length', 4)
      cy.get('input').clear()
      cy.get('input').type('Item 1')
      cy.get('.v-list-item')
        .should('have.length', 2)
      cy.get('input').clear()
      cy.get('input').type('Item 3')
      cy.get('input').should('have.length', 1)
    })

    it('should filter items when using multiple', () => {
      const items = [
        'Item 1',
        'Item 1a',
        'Item 2',
        'Item 2a',
      ]

      cy.mount(() => (
        <VCombobox items={ items } multiple />
      ))
        .get('input')
        .type('Item')
      cy.get('.v-list-item')
        .should('have.length', 4)
      cy.get('input:first-child').as('input')
        .clear()
      cy.get('@input').type('Item 1')
      cy.get('.v-list-item')
        .should('have.length', 2)
      cy.get('@input').clear()
      cy.get('@input').type('Item 3')
      cy.get('.v-list-item')
        .should('have.length', 0)
    })

    it('should filter with custom item shape', () => {
      const items = [
        {
          id: 1,
          name: 'Test1',
        },
        {
          id: 2,
          name: 'Antonsen PK',
        },
      ]

      cy.mount(() => (
        <VCombobox
          items={ items }
          item-value="id"
          item-title="name"
        />
      ))
        .get('input')
        .type('test')
      cy.get('.v-list-item')
        .should('have.length', 1)
        .eq(0)
        .should('have.text', 'Test1')
      cy.get('input').clear()
      cy.get('input').type('antonsen')
      cy.get('.v-list-item')
        .should('have.length', 1)
        .eq(0)
        .should('have.text', 'Antonsen PK')
    })
  })

  describe('prefilled data', () => {
    it('should work with array of strings when using multiple', () => {
      const items = ref(['California', 'Colorado', 'Florida'])

      const selectedItems = ref(['California', 'Colorado'])

      cy.mount(() => (
        <VCombobox v-model={ selectedItems.value } items={ items.value } multiple chips closableChips />
      ))

      cy.get('.v-combobox input').click()

      cy.get('.v-list-item--active').should('have.length', 2)
      cy.get('input').get('.v-chip').should('have.length', 2)

      cy.get('.v-chip__close')
        .eq(0)
        .click()
      cy.get('input').should('exist')
      cy.get('.v-chip')
        .should('have.length', 1)
      cy.should(() => expect(selectedItems.value).to.deep.equal(['Colorado']))
    })

    it('should work with objects when using multiple', () => {
      const items = ref([
        {
          title: 'Item 1',
          value: 'item1',
        },
        {
          title: 'Item 2',
          value: 'item2',
        },
        {
          title: 'Item 3',
          value: 'item3',
        },
      ])

      const selectedItems = ref(
        [
          {
            title: 'Item 1',
            value: 'item1',
          },
          {
            title: 'Item 2',
            value: 'item2',
          },
        ]
      )

      cy.mount(() => (
        <VCombobox
          v-model={ selectedItems.value }
          items={ items.value }
          multiple
          chips
          closableChips
          returnObject
        />
      ))

      cy.get('.v-combobox input').click()

      cy.get('.v-list-item--active').should('have.length', 2)
      cy.get('input').get('.v-chip').should('have.length', 2)

      cy.get('.v-chip__close')
        .eq(0)
        .click()
      cy.get('input').should('exist')
      cy.get('.v-chip')
        .should('have.length', 1)
      cy.should(() => expect(selectedItems.value).to.deep.equal([{
        title: 'Item 2',
        value: 'item2',
      }]))
    })
  })

  describe('readonly', () => {
    it('should not be clickable when in readonly', () => {
      const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

      const selectedItems = 'Item 1'

      cy.mount(() => (
        <VCombobox
          items={ items }
          modelValue={ selectedItems }
          readonly
        />
      ))

      cy.get('.v-combobox')
        .click()
      cy.get('.v-list-item').should('have.length', 0)
        .get('.v-select--active-menu').should('have.length', 0)

      cy.get('.v-combobox input').as('input')
        .focus()
      cy.get('@input').type('{downarrow}', { force: true })
      cy.get('.v-list-item').should('have.length', 0)
        .get('.v-select--active-menu').should('have.length', 0)
    })

    it('should not be clickable when in readonly form', () => {
      const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

      const selectedItems = 'Item 1'

      cy.mount(() => (
        <VForm readonly>
          <VCombobox
            items={ items }
            modelValue={ selectedItems }
            readonly
          />
        </VForm>
      ))

      cy.get('.v-combobox')
        .click()
      cy.get('.v-list-item').should('have.length', 0)
        .get('.v-select--active-menu').should('have.length', 0)

      cy.get('.v-combobox input').as('input')
        .focus()
      cy.get('@input').type('{downarrow}', { force: true })
      cy.get('.v-list-item').should('have.length', 0)
        .get('.v-select--active-menu').should('have.length', 0)
    })
  })

  describe('hide-selected', () => {
    it('should hide selected item(s)', () => {
      const items = [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ]

      const selectedItems = [
        'Item 1',
        'Item 2',
      ]

      cy.mount(() => (
        <VCombobox items={ items } modelValue={ selectedItems } multiple hideSelected />
      ))

      cy.get('.v-combobox input').click()

      cy.get('.v-overlay__content .v-list-item').should('have.length', 2)
      cy.get('.v-overlay__content .v-list-item .v-list-item-title').eq(0).should('have.text', 'Item 3')
      cy.get('.v-overlay__content .v-list-item .v-list-item-title').eq(1).should('have.text', 'Item 4')
    })
  })

  // https://github.com/vuetifyjs/vuetify/issues/17120
  it('should display 0 when selected', () => {
    const items = [0, 1, 2, 3, 4]

    const selectedItems = ref(undefined)

    cy.mount(() => (
      <VCombobox
        items={ items }
        v-model={ selectedItems.value }
      />
    ))
      .get('.v-field input')
      .click()

    cy.get('.v-list-item').eq(0)
      .click({ waitForAnimations: false })

    cy.get('.v-combobox input')
      .should('have.value', '0')
  })

  it('should conditionally show placeholder', () => {
    cy.mount(props => (
      <VCombobox placeholder="Placeholder" { ...props } />
    ))
      .get('.v-combobox input')
      .should('have.attr', 'placeholder', 'Placeholder')
      .setProps({ label: 'Label' })
      .get('.v-combobox input')
      .should('not.be.visible')
      .get('.v-combobox input')
      .focus()
      .should('have.attr', 'placeholder', 'Placeholder')
      .should('be.visible')
      .blur()
      .setProps({ persistentPlaceholder: true })
      .get('.v-combobox input')
      .should('have.attr', 'placeholder', 'Placeholder')
      .should('be.visible')
      .setProps({ modelValue: 'Foobar' })
      .get('.v-combobox input')
      .should('not.have.attr', 'placeholder')
      .setProps({ multiple: true, modelValue: ['Foobar'] })
      .get('.v-combobox input')
      .should('not.have.attr', 'placeholder')
  })

  it('should keep TextField focused while selecting items from open menu', () => {
    cy.mount(() => (
      <VCombobox
        multiple
        items={['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']}
      />
    ))

    cy.get('.v-combobox')
      .click()

    cy.get('.v-list')
      .trigger('keydown', { key: keyValues.down, waitForAnimations: false })
      .trigger('keydown', { key: keyValues.down, waitForAnimations: false })
      .trigger('keydown', { key: keyValues.down, waitForAnimations: false })

    cy.get('.v-field').should('have.class', 'v-field--focused')
  })

  describe('global configuration', () => {
    it('should only apply \'v-combobox\' class to root element and also apply global config class/style', () => {
      cy.mount(() => (
        <Application>
          <VDefaultsProvider defaults={{
            global: {
              class: 'v-global-class',
              style: {
                opacity: 0.5,
              },
            },
            VCombobox: {
              class: 'v-combobox-alt',
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
                'z-index': 999999999,
              },
            },
          }}
          >
            <VCombobox />
          </VDefaultsProvider>
        </Application>
      ))

      cy.get('.v-combobox')
        .should('have.length', 1)
        // assert it's the root element
        .should('have.class', 'v-input')
        .should('have.class', 'v-combobox-alt') // VCombobox class takes highest priority
        .should('have.css', 'margin', '1px') // VCombobox  style takes highest priority
        .should('have.css', 'padding', '0px') // Ignore VTextField global style
        .should('have.css', 'z-index', 'auto') // Ignore VInput global style
        .should('have.css', 'opacity', '1') // Ignore global style

      cy.get('.v-combobox.v-global-class').should('not.exist') // Ignore global class
      cy.get('.v-combobox.v-textfield-alt').should('not.exist') // Ignore VTextField global class
      cy.get('.v-combobox.v-input-alt').should('not.exist') // Ignore VInput global style
    })
  })
})
