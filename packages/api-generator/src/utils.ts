import type { ObjectDefinition } from './types'

function parseFunctionParams (func: string) {
  const [, regular] = /function\s\((.*)\)\s\{.*/i.exec(func) || []
  const [, arrow] = /\((.*)\)\s=>\s\{.*/i.exec(func) || []
  const args = regular || arrow

  return args ? `(${args}) => {}` : undefined
}

function getPropType (type: any | any[]): string | string[] {
  if (Array.isArray(type)) {
    return type.flatMap(t => getPropType(t))
  }

  if (!type) return 'any'

  return type.name.toLowerCase()
}

function getPropDefault (def: any, type: string | string[]) {
  if (typeof def === 'function' && type !== 'function') {
    return def.call({}, {})
  }

  if (typeof def === 'string') {
    return def ? `'${def}'` : def
  }

  if (type === 'function') {
    return parseFunctionParams(def)
  }

  if (def == null && (
    type === 'boolean' ||
    (Array.isArray(type) && type.includes('boolean'))
  )) {
    return false
  }

  return def
}

type ComponentData = {
  props?: ObjectDefinition
  slots?: ObjectDefinition
  events?: ObjectDefinition
  exposed?: ObjectDefinition
}

export function addPropData (
  kebabName: string,
  componentData: ComponentData,
  componentProps: any
) {
  const sources = new Set<string>()
  for (const [propName, propObj] of Object.entries(componentData.props?.properties ?? {})) {
    const instancePropObj = componentProps[propName]

    propObj.default = instancePropObj?.default

    sources.add(instancePropObj?.source ?? kebabName)
  }

  return [...sources.values()]
}

export function stringifyProps (props: any) {
  return Object.fromEntries(
    Object.entries<any>(props).map(([key, prop]) => {
      return [key, {
        source: prop?.source,
        default: typeof prop === 'object'
          ? getPropDefault(prop?.default, getPropType(prop?.type))
          : getPropDefault(undefined, getPropType(prop)),
      }]
    })
  )
}

const loadLocale = (componentName: string, locale: string, fallback = {}): Record<string, Record<string, string>> => {
  try {
    const data = require(`./locale/${locale}/${componentName}`)
    return Object.assign(fallback, data)
  } catch (err) {
    return fallback
  }
}

function getSources (kebabName: string, sources: string[], locale: string) {
  const arr = [
    loadLocale(kebabName, locale),
    ...sources.map(source => loadLocale(source, locale)),
    loadLocale('generic', locale),
  ]

  return {
    find: (section: string, key: string) => {
      return arr.reduce<string | null>((str, source) => {
        if (str) return str
        return source?.[section]?.[key]
      }, null)
    },
  }
}

export function addDescriptions (kebabName: string, componentData: ComponentData, sources: string[], locales: string[]) {
  for (const locale of locales) {
    const descriptions = getSources(kebabName, sources, locale)

    for (const section of ['props', 'slots', 'events', 'exposed'] as const) {
      for (const [propName, propObj] of Object.entries(componentData[section]?.properties ?? {})) {
        propObj.description = propObj.description ?? {}

        const description = descriptions.find(section, propName)

        propObj.description[locale] = description ?? 'MISSING DESCRIPTION'
      }
    }
  }
}
