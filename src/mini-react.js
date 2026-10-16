
/**
 * Lab 02 - Exercise 1
 * Mini-React VNode Factory
 */

/**
 * Check whether a value is a valid VNode.
 */
export function isVNode(value) {
    return (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      (
        typeof value.type === 'string' ||
        typeof value.type === 'function'
      ) &&
      value.props !== null &&
      typeof value.props === 'object' &&
      Array.isArray(value.props.children)
    );
  }
  
  /**
   * Convert a string or number into a text VNode.
   */
  export function createTextElement(text) {
    if (typeof text !== 'string' && typeof text !== 'number') {
      throw new TypeError(
        'Text elements must contain a string or number'
      );
    }
  
    return Object.freeze({
      type: 'TEXT_ELEMENT',
  
      props: Object.freeze({
        nodeValue: String(text),
        children: Object.freeze([])
      })
    });
  }
  
  /**
   * Create a Virtual DOM node.
   *
   * Contract:
   * - type: HTML tag name or component function
   * - props: attributes and event handlers
   * - children: nested VNodes, strings or numbers
   */
  export function createElement(type, props, ...children) {
    if (
      typeof type !== 'string' &&
      typeof type !== 'function'
    ) {
      throw new TypeError(
        'VNode type must be a string or function'
      );
    }
  
    if (
      props !== null &&
      props !== undefined &&
      (
        typeof props !== 'object' ||
        Array.isArray(props)
      )
    ) {
      throw new TypeError(
        'VNode props must be an object or null'
      );
    }
  
    const normalizedChildren = children
      .flat(Infinity)
  
      .filter(child =>
        child !== null &&
        child !== undefined &&
        typeof child !== 'boolean'
      )
  
      .map(child => {
        if (
          typeof child === 'string' ||
          typeof child === 'number'
        ) {
          return createTextElement(child);
        }
  
        if (isVNode(child)) {
          return child;
        }
  
        throw new TypeError(
          'Invalid VNode child'
        );
      });
  
    const normalizedProps = Object.freeze({
      ...(props || {}),
      children: Object.freeze(normalizedChildren)
    });
  
    return Object.freeze({
      type,
      props: normalizedProps
    });
  }
  