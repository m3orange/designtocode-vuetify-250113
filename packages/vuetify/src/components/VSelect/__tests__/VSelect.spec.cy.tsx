/// <reference types="..\..\..\..\types\cypress" />
/// <reference types="../../../../types/cypress" />

import { VListItem } from '@/components/VList'
import { ref } from 'vue'
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

  describe('prefilled data', () => {
    it('should work with array of strings when using multiple', () => {
      const items = ref(['California', 'Colorado', 'Florida'])

      const selectedItems = ref(['California', 'Colorado'])

      cy.mount(() => (
        <VSelect v-model={selectedItems.value} items={items.value} multiple chips closableChips />
      ))

      cy.get('.v-select').click()

      cy.get('.v-list-item--active').should('have.length', 2)
      cy.get('.v-list-item input').eq(2).click().should(() => {
        expect(selectedItems.value).to.deep.equal(['California', 'Colorado', 'Florida'])
      })

      cy
        .get('.v-chip__close')
        .eq(0)
        .click()
        .get('.v-chip')
        .should('have.length', 2)
        .should(() => expect(selectedItems.value).to.deep.equal(['Colorado', 'Florida']))
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
        <VSelect
          v-model={selectedItems.value}
          items={items.value}
          multiple
          chips
          closableChips
          returnObject
        />
      ))

      cy.get('.v-select').click()

      cy.get('.v-list-item--active').should('have.length', 2)
      cy.get('.v-list-item input').eq(2).click().should(() => {
        expect(selectedItems.value).to.deep.equal([
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
      })

      cy
        .get('.v-chip__close')
        .eq(0)
        .click()
        .get('.v-chip')
        .should('have.length', 2)
        .should(() => expect(selectedItems.value).to.deep.equal([
          {
            title: 'Item 2',
            value: 'item2',
          },
          {
            title: 'Item 3',
            value: 'item3',
          },
        ]))
    })
  })
})
