/// <reference types="..\..\..\..\types\cypress" />

import { VForm } from '@/components'
import { VListItem } from '@/components/VList'
import { VSelect } from '../VSelect'

describe('VSelect', () => {
  it('should render selection slot', () => {
    const items = [
      { title: 'a' },
      { title: 'b' },
      { title: 'c' },
    ]
    let model: { title: string }[] = [{ title: 'b' }]

    cy.mount(() => (
      <VSelect
        multiple
        returnObject
        items={ items }
        modelValue={ model }
        onUpdate:modelValue={ val => model = val }
      >
        {{
          selection: ({ item, index }) => {
            return item.raw.title.toUpperCase()
          },
        }}
      </VSelect>
    ))
      .get('.v-select__selection').eq(0).invoke('text').should('equal', 'B')
  })

  it('should render prepend-item slot', () => {
    cy.mount(() => (
      <VSelect menu items={['Item #1', 'Item #2']}>
        {{
          'prepend-item': () => (
            <VListItem title="Foo"></VListItem>
          ),
        }}
      </VSelect>
    ))
      .get('.v-list-item').eq(0).invoke('text').should('equal', 'Foo')
  })

  it('should render append-item slot', () => {
    cy.mount(() => (
      <VSelect menu items={['Item #1', 'Item #2']}>
        {{
          'append-item': () => (
            <VListItem title="Foo"></VListItem>
          ),
        }}
      </VSelect>
    ))
      .get('.v-list-item').last().invoke('text').should('equal', 'Foo')
  })

  it('should close only first chip', () => {
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

    const selectedItems = ['Item 1', 'Item 2', 'Item 3']

    cy.mount(() => (
      <VSelect
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

  it('should not be clickable when in readonly', () => {
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']

    const selectedItems = 'Item 1'

    cy.mount(() => (
      <VSelect
        items={items}
        modelValue={selectedItems}
        readonly
      />
    ))

    cy.get('.v-select')
      .click()
      .get('.v-list-item').should('have.length', 0)
      .get('.v-select--active-menu').should('have.length', 0)

    cy
      .get('.v-select input')
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
        <VSelect
          items={items}
          modelValue={selectedItems}
          readonly
        />
      </VForm>
    ))

    cy.get('.v-select')
      .click()
      .get('.v-list-item').should('have.length', 0)
      .get('.v-select--active-menu').should('have.length', 0)

    cy
      .get('.v-select input')
      .focus()
      .type('{downarrow}', { force: true })
      .get('.v-list-item').should('have.length', 0)
      .get('.v-select--active-menu').should('have.length', 0)
  })
})
