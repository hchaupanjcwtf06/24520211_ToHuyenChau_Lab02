
/**
 * Lab 02 - Mini-React Engine
 * Exercise 1 + Exercise 2
 */

import {
    registerEventHandlers
  } from './events.js';
  
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
  
  export function createTextElement(text) {
    if (
      typeof text !== 'string' &&
      typeof text !== 'number'
    ) {
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
  
    return Object.freeze({
      type,
  
      props: Object.freeze({
        ...(props || {}),
        children: Object.freeze(normalizedChildren)
      })
    });
  }
  
  /**
   * Convert VNode to real DOM.
   *
   * delegateEvents = false:
   * Exercise 1 direct listeners.
   *
   * delegateEvents = true:
   * Exercise 2 root delegation.
   */
  export function renderToDOM(
    vnode,
    options = { delegateEvents: false }
  ) {
    if (!isVNode(vnode)) {
      throw new TypeError('Invalid VNode');
    }
  
    if (vnode.type === 'TEXT_ELEMENT') {
      return document.createTextNode(
        vnode.props.nodeValue
      );
    }
  
    if (typeof vnode.type === 'function') {
      const componentVNode = vnode.type(vnode.props);
  
      return renderToDOM(componentVNode, options);
    }
  
    const dom = document.createElement(vnode.type);
  
    if (options.delegateEvents) {
      registerEventHandlers(dom, vnode.props);
    }
  
    for (const [name, value] of Object.entries(vnode.props)) {
      if (
        name === 'children' ||
        name === 'key' ||
        name === 'nodeValue'
      ) {
        continue;
      }
  
      if (value === null || value === undefined) {
        continue;
      }
  
      if (/^on[A-Z]/.test(name)) {
        if (
          !options.delegateEvents &&
          typeof value === 'function'
        ) {
          const eventName = name.slice(2).toLowerCase();
  
          dom.addEventListener(eventName, value);
        }
  
        continue;
      }
  
      if (name === 'className') {
        dom.className = String(value);
        continue;
      }
  
      if (
        name === 'style' &&
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        Object.assign(dom.style, value);
        continue;
      }
  
      if (/^on/i.test(name)) {
        continue;
      }
  
      if (
        name === 'innerHTML' ||
        name === 'outerHTML' ||
        name === 'srcdoc' ||
        name === 'dangerouslySetInnerHTML'
      ) {
        continue;
      }
  
      if (typeof value === 'boolean') {
        if (value) {
          dom.setAttribute(name, '');
        }
        continue;
      }
  
      if (typeof value === 'function') {
        continue;
      }
  
      dom.setAttribute(name, String(value));
    }
  
    for (const child of vnode.props.children) {
      dom.appendChild(renderToDOM(child, options));
    }
  
    return dom;
  }
  