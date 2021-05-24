const prefixAttributeName = 'auto-slot-prefix';

/**
 * Creates a new class with a read-only autoSlots property.
 * The property contains a list of slot names assigned to the child elements
 * that match `prefix`.
 *
 * @param {Function}  ElementClass
 * @param {Object}    [params]
 * @param {String}    [params.prefix] If a child element has a slot that begins
 *                                    with this value, it will be included in
 *                                    the autoSlots property.
 * @returns
 */
export function withAutoSlots(ElementClass, { prefix = '' } = {}) {
  return class ElementWithAutoSlots extends ElementClass {
    /**
     * Names for all the auto slots provided by the child elements.
     *
     * @returns {String[]}
     */
    get autoSlots() {
      // Use custom element tag name by default.
      const validPrefix = prefix || this.tagName.toLowerCase();

      if (!validPrefix) {
        return [];
      }

      // Using :scope so we only target direct children.
      const elements = this.querySelectorAll(`:scope > [slot^='${validPrefix}']`);

      return Array.from(elements).map(el => el.slot);
    }
  }
}
