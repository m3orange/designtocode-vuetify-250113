// Composables
import { injectDefaults, internalUseDefaults } from '@/composables/defaults'

// Utilities
import {
  defineComponent as _defineComponent, // eslint-disable-line no-restricted-imports
} from 'vue'
import { consoleWarn } from '@/util/console'
import { pick } from '@/util/helpers'
import { propsFactory } from '@/util/propsFactory'

// Types
import type {
  ComponentInjectOptions,
  ComponentObjectPropsOptions,
  ComponentOptions,
  ComponentOptionsMixin,
  ComponentPropsOptions,
  ComputedOptions,
  DefineComponentFromOptions,
  DefineComponentOptions,
  EmitsOptions,
  ExtractDefaultPropTypes,
  ExtractPropTypes,
  FunctionalComponent,
  LooseOptional,
  MethodOptions,
  SlotsType,
  VNode,
  VNodeChild,
} from 'vue'

// // No props
// export function defineComponent<
//   Props = {},
//   RawBindings = {},
//   D = {},
//   C extends ComputedOptions = {},
//   M extends MethodOptions = {},
//   Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
//   Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
//   E extends EmitsOptions = {},
//   EE extends string = string,
//   I extends {} = {},
//   II extends string = string,
//   S extends SlotsType = {},
// >(
//   options: ComponentOptionsWithoutProps<
//     Props,
//     RawBindings,
//     D,
//     C,
//     M,
//     Mixin,
//     Extends,
//     E,
//     EE,
//     I,
//     II,
//     S
//   >
// ): DefineComponent<Props, RawBindings, D, C, M, Mixin, Extends, E, EE>

// // Object Props
// export function defineComponent<
//   PropsOptions extends Readonly<ComponentPropsOptions>,
//   RawBindings,
//   D,
//   C extends ComputedOptions = {},
//   M extends MethodOptions = {},
//   Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
//   Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
//   E extends EmitsOptions = {},
//   EE extends string = string,
//   I extends {} = {},
//   II extends string = string,
//   S extends SlotsType = {},
// >(
//   options: ComponentOptionsWithObjectProps<
//     PropsOptions,
//     RawBindings,
//     D,
//     C,
//     M,
//     Mixin,
//     Extends,
//     E,
//     EE,
//     I,
//     II,
//     S
//   >
// ): DefineComponent<PropsOptions, RawBindings, D, C, M0, Mixin, Extends, E, EE> & FilterPropsOptions<PropsOptions>

export function defineComponent<
Props = undefined,
RawBindings = {},
D = {},
C extends ComputedOptions = {},
M extends MethodOptions = {},
Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
E extends EmitsOptions = {},
EE extends string = string,
I extends ComponentInjectOptions = {},
II extends string = string,
S extends SlotsType = {},
Options extends Record<PropertyKey, any> = {}>(options: DefineComponentOptions<
  Props,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE,
  I,
  II,
  S,
  Options
>): DefineComponentFromOptions<
undefined extends Props ? {} : Props,
RawBindings,
D,
C,
M,
Mixin,
Extends,
E,
EE,
I,
II,
S,
Options
> & (Props extends Readonly<ComponentPropsOptions> ? FilterPropsOptions<Props> : {})

// Implementation
export function defineComponent (options: ComponentOptions & { props?: ComponentObjectPropsOptions}) {
  options._setup = options._setup ?? options.setup

  if (!options.name) {
    consoleWarn('The component is missing an explicit name, unable to generate default prop value')

    return options
  }

  if (options._setup) {
    options.props = propsFactory(options.props ?? {}, options.name)()
    const propKeys = Object.keys(options.props).filter(key => key !== 'class' && key !== 'style')
    options.filterProps = function filterProps (props: Record<string, any>) {
      return pick(props, propKeys)
    }

    options.props._as = String
    options.setup = function setup (props: Record<string, any>, ctx) {
      const defaults = injectDefaults()

      // Skip props proxy if defaults are not provided
      if (!defaults.value) return options._setup(props, ctx)

      const { props: _props, provideSubDefaults } = internalUseDefaults(props, props._as ?? options.name, defaults)

      const setupBindings = options._setup(_props, ctx)

      provideSubDefaults()

      return setupBindings
    }
  }

  return options
}

export type SlotsToProps<
  U extends RawSlots,
  T = MakeInternalSlots<U>
> = {
  $children?: (
    | VNodeChild
    | (T extends { default: infer V } ? V : {})
    | { [K in keyof T]?: T[K] }
  )
  'v-slots'?: { [K in keyof T]?: T[K] | false }
} & {
  [K in keyof T as `v-slot:${K & string}`]?: T[K] | false
}

type RawSlots = Record<string, unknown>
type Slot<T> = [T] extends [never] ? () => VNodeChild : (arg: T) => VNodeChild
type VueSlot<T> = [T] extends [never] ? () => VNode[] : (arg: T) => VNode[]
type MakeInternalSlots<T extends RawSlots> = {
  [K in keyof T]: Slot<T[K]>
}
type MakeSlots<T extends RawSlots> = {
  [K in keyof T]: VueSlot<T[K]>
}

export type GenericProps<Props, Slots extends Record<string, unknown>> = {
  $props: Props & SlotsToProps<Slots>
  $slots: MakeSlots<Slots>
}

type DefineComponentWithGenericProps<T extends (new (props: Record<string, any>, slots: RawSlots) => {
  $props?: Record<string, any>
})>
= <
Props = undefined,
RawBindings = {},
D = {},
C extends ComputedOptions = {},
M extends MethodOptions = {},
Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
E extends EmitsOptions = {},
EE extends string = string,
I extends ComponentInjectOptions = {},
II extends string = string,
  Slots extends RawSlots = ConstructorParameters<T>[1],
  S extends SlotsType = SlotsType<Partial<MakeSlots<Slots>>>,
Options extends Record<PropertyKey, any> = {}>(options: DefineComponentOptions<
  Props,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE,
  I,
  II,
  S,
  Options
>) => DefineComponentFromOptions<
undefined extends Props ? {} : Props,
RawBindings,
D,
C,
M,
Mixin,
Extends,
E,
EE,
I,
II,
S,
Options
> & T & (Props extends Readonly<ComponentPropsOptions> ? FilterPropsOptions<Props> : {})

type DefineComponentWithSlots<Slots extends RawSlots> = <
Props = undefined,
RawBindings = {},
D = {},
C extends ComputedOptions = {},
M extends MethodOptions = {},
Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
E extends EmitsOptions = {},
EE extends string = string,
I extends ComponentInjectOptions = {},
II extends string = string,
S extends SlotsType = SlotsType<Partial<MakeSlots<Slots>>>,
Options extends Record<PropertyKey, any> = {}
>(
  options: DefineComponentOptions<
  Props,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE,
  I,
  II,
  S,
  Options
>
) => DefineComponentFromOptions<
undefined extends Props ? {} : Props,
RawBindings,
D,
C,
M,
Mixin,
Extends,
E,
EE,
I,
II,
S,
Options
> & (Props extends Readonly<ComponentPropsOptions> ? FilterPropsOptions<Props> : {})

// No argument - simple default slot
export function genericComponent (exposeDefaults?: boolean): DefineComponentWithSlots<{ default: never }>

// Generic constructor argument - generic props and slots
export function genericComponent<T extends (new (props: Record<string, any>, slots: any) => {
  $props?: Record<string, any>
})> (exposeDefaults?: boolean): DefineComponentWithGenericProps<T>

// Slots argument - simple slots
export function genericComponent<
  Slots extends RawSlots
> (exposeDefaults?: boolean): DefineComponentWithSlots<Slots>

// Implementation
export function genericComponent (exposeDefaults = true) {
  return (options: any) => ((exposeDefaults ? defineComponent : _defineComponent) as any)(options)
}

export function defineFunctionalComponent<
  T extends FunctionalComponent<Props>,
  PropsOptions = ComponentObjectPropsOptions,
  Defaults = ExtractDefaultPropTypes<PropsOptions>,
  Props = Readonly<ExtractPropTypes<PropsOptions>>,
> (props: PropsOptions, render: T): FunctionalComponent<Partial<Defaults> & Omit<LooseOptional<Props>, keyof Defaults>> {
  render.props = props as any
  return render as any
}

// Adds a filterProps method to the component options
export interface FilterPropsOptions<PropsOptions extends Readonly<ComponentPropsOptions>, Props = ExtractPropTypes<PropsOptions>> {
  filterProps<
    T extends Partial<Props>,
    U extends Exclude<keyof Props, Exclude<keyof Props, keyof T>>
  > (props: T): Partial<Pick<T, U>>
}
