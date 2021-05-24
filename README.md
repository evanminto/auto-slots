# Auto Slots

Auto Slots is a tiny mixin for web components that enables child elements to dynamically define their own slot names.

## How It Works

By default, each slot name must be defined explicitly in both the Shadow DOM and Light DOM. There's no mechanism for assigning multiple elements to a slot and then looping over them. This makes it impossible to accept a list of children and then wrap _each child_ in a wrapper element inside the Shadow DOM.

This mixin solves the problem by querying a custom element's Light DOM children, finding slot names that match a prefix, and providing those slot names to the component as a getter. The component can then render the appropriate slots inside the Shadow DOM.

Essentially this is an inversion of the default model. By default the Shadow DOM defines a finite set of slot names that the Light DOM consumes. With Auto Slots, the Light DOM defines a finite set of slot names (using a naming convention defined by the custom element) and then the Shadow DOM consumes that set.

## Usage

Currently the only export is a higher-order component called `withAutoSlots`. In the future I may build a decorator version as well!

```sh
npm install @evanminto/auto-slots
```

With vanilla custom elements:

```js
import { withAutoSlots } from '@evanminto/auto-slots';

class MyElement extends withAutoSlots(HTMLElement, { prefix: 'items[' }) {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <ul>
        ${this.autoSlotNames.map(slotName => `
          <li><slot name="${slotName}"></slot></li>
        `).join('')}
      </ul>
    `;
  }
}

customElements.define('my-element', MyElement);
```

```html
<my-element>
  <div slot="items[0]">One</div>
  <div slot="items[1]">Two</div>
  <div slot="items[2]">Three</div>
</my-element>
```

It also works with [LitElement](https://lit.dev/) and any other library that outputs a custom element class:

```js
import { html, LitElement } from 'lit';
import { withAutoSlots } from '@evanminto/auto-slots';

class MyElement extends withAutoSlots(LitElement, { prefix: 'items[' }) {
  render() {
    return html`
      <ul>
        ${this.autoSlotNames.map(slotName => html`
          <li><slot name=${slotName}></slot></li>
        `)}
      </ul>
    `;
  }
}

customElements.define('my-element', MyElement);
```

```html
<my-element>
  <div slot="items[0]">One</div>
  <div slot="items[1]">Two</div>
  <div slot="items[2]">Three</div>
</my-element>
```

You can define a custom prefix, or leave it unset to use the default. By default, the prefix is the name of the custom element. For example:

```js
class MyElement extends withAutoSlots(LitElement) {
  // ...
}

customElements.define('my-element', MyElement);
```

```html
<my-element>
  <div slot="my-element1">One</div>
  <div slot="my-element1">Two</div>
  <div slot="my-element3">Three</div>
</my-element>
```

**Warning:** The list of slot names is dynamic, so it will always represent the current state of the slotable elements when you use the getter. However, this library doesn’t handle re-rendering your Shadow DOM HTML when the children change. You’ll have to set up your own Mutation Observer or use a different solution.

## API

### `withAutoSlots(ElementClass, { prefix })`

Higher-order component. Call this on a custom element class and it will return a version of the class augmented with auto slots behavior.

- `ElementClass` must be `HTMLElement` or a subclass of it. This is the class you want to mix the auto slots behavior into.
- `prefix` must be a string. All slots that start with this value will be included in the auto slots list. *Defaults to the tag name of the custom element, lower-cased and hyphenated.*

### `autoSlots`

Read-only property on custom elements that have been augmented with `withAutoSlots()`.

The value is an array of strings. Each string is the name of the one of the slots matching the auto-slots prefix value.
