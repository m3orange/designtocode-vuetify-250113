---
meta:
  nav: Items
  title: Items
  description: Items
  keywords: items
related:
  - /components/lists/
  - /components/selects/
  - /components/data-tables/
---

# Items

<api-inline />

## Accessor props

- title
- value
- children
- props

## String

Lookup on each item object. Can be dot separated for nested properties.

```html
<v-component
  item-title="name"
  item-title="user.name"
/>
```

## Array

Lookup on each item object. Like dot notation (each member is a key in the current object), but can be used if the key contains a dot.

```html
<v-component
  :item-title="['name']"
  :item-title="['user', 'name']"
/>
```

## Function

Called for each item object.

```html
<v-component
  :item-title="item => item.name"
  :item-title="item => item.user.name"
/>
```
