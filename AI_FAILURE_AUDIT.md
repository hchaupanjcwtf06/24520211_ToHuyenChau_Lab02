# AI Failure Mode Audit — Lab 02

**Course:** Web Application Development  
**Project:** Modern React Architecture, Virtual DOM & State Machines  
**Student ID:** 24520211  
**Repository:** [24520211_ToHuyenChau_Lab02](https://github.com/hchaupanjcwtf06/24520211_ToHuyenChau_Lab02)

## 1. Audit Objective

This report examines three common failure modes in AI-assisted frontend development:

1. Unsafe HTML rendering and Cross-Site Scripting (XSS).
2. Redundant event listeners and memory management issues.
3. Unstable keys in dynamically rendered lists.

The purpose is to evaluate implementation risks, document verification procedures, and explain the engineering decisions used in the Mini-React project.

**Evidence policy:** These cases are code-review findings and verification scenarios. They must not be interpreted as three confirmed historical AI-generated defects unless supported by original code, Git diffs, or debugging evidence.

## 2. Audit Case 01 — Unsafe HTML Rendering

### 2.1. Risk Description

AI-generated rendering code may use `innerHTML` to display dynamic text.

Example of an unsafe pattern:

```javascript
container.innerHTML = userInput;
```

If untrusted input is interpreted as HTML, it can introduce Cross-Site Scripting vulnerabilities.

### 2.2. Diagnostic Method

Inspect the implementation of `renderToDOM()` in `src/mini-react.js`.

Check whether text nodes are created using safe DOM APIs instead of directly injecting HTML strings.

Use the following input during browser verification:

```javascript
const testInput = '<script>alert(1)</script>';
```

Expected behavior: the string must appear as text rather than execute as JavaScript.

### 2.3. Engineering Mitigation

The Mini-React renderer creates text nodes using:

```javascript
document.createTextNode(vnode.props.nodeValue);
```

This prevents text content from being parsed as HTML markup.

The renderer also excludes dangerous properties such as `innerHTML`, `outerHTML`, `srcdoc`, and `dangerouslySetInnerHTML` from its ordinary attribute assignment logic.

### 2.4. Evidence

Relevant implementation:

- `src/mini-react.js`
- `src/test-ex1.js`
- `src/test-renderer.js`

Relevant Git milestone:

```text
422b966 feat(core): implement renderToDOM
```

**Manual verification:** Inspect the rendered DOM in Chrome DevTools and confirm that the test string is displayed as text.

**Screenshot:** ![Safe Text Rendering Test](docs/audit/01-safe-text-rendering.png)

### 2.5. Result

The implemented renderer uses text-node creation rather than raw HTML insertion for text children.

This audit verifies the selected rendering approach; it does not establish that a vulnerable `innerHTML` implementation previously existed in the project.

---

## 3. Audit Case 02 — Redundant Event Listeners

### 3.1. Risk Description

A common AI-assisted UI implementation attaches listeners directly to elements during every render:

```javascript
button.addEventListener('click', handler);
```

Without proper cleanup, repeated rendering can create redundant listeners or retain unnecessary references.

### 3.2. Diagnostic Method

Inspect the Event Delegation Hub in `src/events.js`.

Use Chrome DevTools to compare listeners on a Task Manager button and the application root.

Button inspection:

```javascript
getEventListeners(
  document.querySelector('#add-task')
).click
```

Root inspection:

```javascript
getEventListeners(
  document.querySelector('#app')
).click.length
```

Expected application behavior:

- No application-owned click listener attached directly to the Task Manager button.
- One delegated click listener attached to `#app`.
- A single click invokes the intended handler once.

### 3.3. Engineering Mitigation

Exercise 2 introduces root-level event delegation.

Event callbacks are registered through a `WeakMap`, while the root element receives the shared DOM event listeners.

The application initializes event delegation once rather than repeating listener registration during each render.

The implementation also provides a cleanup function to remove registered root listeners.

### 3.4. Evidence

Relevant implementation:

- `src/events.js`
- `src/mini-react.js`
- `src/test-events.js`
- `src/main.js`

Relevant Git milestone:

```text
b64bdfc feat(events): attach root event delegation listener
```

**Manual verification:** Inspect the Event Listeners panel in Chrome DevTools and execute the console checks above.

**Screenshot:** ![Root Event Delegation Test](docs/audit/02-root-event-delegation.png)

### 3.5. Result

The Exercise 2 Task Manager uses root event delegation instead of direct button-level application listeners.

The Exercise 1 renderer retains direct-listener support for its original educational demonstration.

This finding documents an architectural risk and mitigation; it does not prove that a memory leak occurred in the original implementation.

---

## 4. Audit Case 03 — Unstable Keys

### 4.1. Risk Description

AI-generated UI code may assign unstable keys to list items.

Examples:

```javascript
key: Math.random()
```

or:

```javascript
key: index
```

Random keys change between renders. Array-index keys can also become unsuitable when items are inserted, deleted, or reordered.

In frameworks that reconcile keyed elements, unstable keys can cause unnecessary remounting and incorrect identity tracking.

### 4.2. Diagnostic Method

Inspect the task rendering logic in `src/main.js`.

Check how list item keys are assigned and whether task identifiers remain stable after state updates.

Inspect the data list in `src/exercise3.js` as well.

### 4.3. Engineering Mitigation

The Task Manager uses task identifiers:

```javascript
key: task.id
```

New tasks receive a generated identifier when they are created:

```javascript
id: crypto.randomUUID()
```

The asynchronous data feed uses stable item IDs:

```javascript
key: item.id
```

This avoids using a new random key on every render.

### 4.4. Architectural Limitation

The current Mini-React renderer does not implement Virtual DOM reconciliation or keyed DOM reuse.

It rebuilds the rendered subtree using `replaceChildren()`.

Therefore, stable keys are included as an identity contract for future reconciliation, but they do not currently prevent DOM replacement.

The project must not claim that stable keys eliminate DOM remounting in this implementation.

### 4.5. Evidence

Relevant implementation:

- `src/main.js`
- `src/exercise3.js`
- `src/mini-react.js`

Relevant Git milestones:

```text
83f78b9 feat(ui): assemble reactive todo application
84498fe feat(ui): implement multi-state data component with skeleton feedback
```

**Manual verification:** Inspect the source code and confirm that task and feed items use stable IDs rather than `Math.random()` or array indices as keys.

**Screenshot:** ![Stable Task Keys](docs/audit/03-stable-keys-task.png)

![Stable Data Feed Keys](docs/audit/03-stable-keys-feed.png)

### 4.6. Result

The application uses stable identifiers for list items.

The finding addresses a potential reconciliation risk, while explicitly acknowledging that the current renderer does not yet implement keyed reconciliation.

---

## 5. Audit Summary

| Case | Risk | Engineering Mitigation | Verification |
|---|---|---|---|
| 01 | Unsafe HTML rendering | Text nodes and restricted DOM properties | Source review and DOM inspection |
| 02 | Redundant event listeners | Root Event Delegation Hub | DevTools listener inspection |
| 03 | Unstable list keys | Stable task and item IDs | Source review and Git diff inspection |

## 6. Final Engineering Reflection

This audit highlights the importance of validating AI-assisted code against explicit architectural and security requirements.

The Mini-React project applies safe text rendering, root event delegation, stable item identifiers, and structured state management.

The audit also identifies the current engine's limitations, particularly the absence of Virtual DOM reconciliation.

All verification claims should be supported by actual test results, source inspection, and screenshots before final submission.

**Final audit status:** Pending attachment of manual verification evidence and confirmation of whether the three cases represent historically detected AI-generated defects or preventive code-review findings.