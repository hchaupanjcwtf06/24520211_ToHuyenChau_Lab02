# Lab 02 — Modern React Architecture, Virtual DOM & State Machines

**Course:** Web Application Development  
**Project:** Mini-React Architecture  
**Student ID:** 24520211  
**Repository:** [24520211_ToHuyenChau_Lab02](https://github.com/hchaupanjcwtf06/24520211_ToHuyenChau_Lab02)

## 1. Project Overview

This laboratory explores the fundamental concepts behind modern component-based frontend architectures by implementing a lightweight Mini-React engine using vanilla JavaScript.

The project focuses on three main areas:

- Virtual DOM node creation and DOM mounting.
- Reactive state management and root event delegation.
- Asynchronous finite state machines with skeleton loading feedback and error recovery.

The application is built with **JavaScript, HTML, CSS, and Vite**, without using the React library.

## 2. Learning Objectives

The main objectives are to:

- Understand how Virtual DOM nodes represent UI elements.
- Implement a `createElement` factory and recursive DOM renderer.
- Normalize nested children and validate VNode structures.
- Implement a custom `useState` hook using closures and a state store.
- Maintain stable hook positions through cursor management.
- Handle UI events through root-level event delegation.
- Build reactive interfaces using one-way data flow.
- Model asynchronous operations using explicit lifecycle states.
- Provide loading feedback, error messages, and retry functionality.
- Practice contract-first development and atomic Git commits.

## 3. Project Structure

```text
Lab02-React-Architecture/
├── src/
│   ├── assets/
│   ├── mini-react.js
│   ├── state.js
│   ├── events.js
│   ├── main.js
│   ├── style.css
│   ├── exercise3.js
│   ├── exercise3.css
│   ├── async-machine.js
│   ├── data-feed.js
│   ├── test-ex1.js
│   ├── test-renderer.js
│   ├── test-state.js
│   ├── test-events.js
│   ├── event-test-entry.js
│   └── test-async.js
├── index.html
├── package.json
├── package-lock.json
├── project-rules.md
├── TASK_DECOMPOSITION.md
└── README.md
```

## 4. Exercise 1 — Mini-React VNode & Mounting Engine

**Objective:** Implement a basic Virtual DOM factory and renderer from scratch.

### Implemented Features

- `createElement(type, props, ...children)` creates immutable VNode objects.
- `createTextElement(text)` normalizes string and numeric children.
- `isVNode(value)` validates the basic VNode structure.
- Nested child arrays are flattened.
- Null, undefined, and boolean children are filtered out.
- `renderToDOM(vnode)` recursively creates real DOM nodes.
- Semantic HTML elements are supported.
- Text content is rendered using `document.createTextNode()`.
- Potentially dangerous HTML strings are displayed as text instead of being interpreted as markup.

### Verification

The exercise includes factory and browser-based renderer tests.

```bash
node src/test-ex1.js
```

The browser renderer tests verify DOM structure, text rendering, and event behavior.

### Git Milestones

```text
feat(core): implement createElement factory
feat(core): implement renderToDOM
```

## 5. Exercise 2 — Reactive State & Event Delegation

**Objective:** Implement a lightweight reactive state system and use it to build a Task Manager.

### State Management

The custom state engine provides:

- `stateStore` for storing hook values.
- `resetCursor()` for resetting the hook position before rendering.
- `useState(initialValue)` for reading and updating state.
- Closure-based setters that preserve their state slots.
- Functional state updates.
- Render requests when state values change.

### Root Event Delegation

The event system registers handlers through a `WeakMap` and delegates supported DOM events to a common root element.

This approach avoids attaching separate application listeners to each button in the reactive interface.

### Reactive Task Manager

The Task Manager supports:

- Adding tasks.
- Marking tasks as completed.
- Reverting completed tasks.
- Deleting tasks.
- Filtering tasks by All, Active, and Completed.
- Displaying total and visible task counts.

### Verification

```bash
node src/test-state.js
```

Event delegation is also verified through browser tests and Chrome DevTools.

### Git Milestones

```text
feat(state): implement stateStore and resetCursor engine
feat(state): implement reactive useState dispatcher
feat(events): attach root event delegation listener
feat(ui): assemble reactive todo application
```

## 6. Exercise 3 — Resilient Async State Machine

**Objective:** Build a component that handles asynchronous data loading through four explicit states.

### State Machine

The component supports the following lifecycle states:

| State | Description |
|---|---|
| IDLE | No request has started. |
| LOADING | An asynchronous request is in progress. |
| SUCCESS | Data has been received successfully. |
| ERROR | The request failed and recovery is available. |

The state machine validates transitions to prevent inconsistent lifecycle states.

### Skeleton Loading

During the LOADING state, the interface displays animated CSS skeleton placeholders.

The animation respects the user's reduced-motion preference.

### Error Handling & Retry

When a request fails, the component displays a human-readable error message and a **Retry Connection** button.

### Race Condition Prevention

The implementation uses `AbortController` and request identifiers to prevent outdated asynchronous responses from overwriting newer results.

### Simulated Data Service

The project uses a local simulated asynchronous data service to support deterministic testing of successful and failed requests.

### Verification

```bash
node src/test-async.js
```

The browser interface can be used to verify all four lifecycle states, skeleton feedback, and retry behavior.

### Git Milestone

```text
feat(ui): implement multi-state data component with skeleton feedback
```

## 7. Installation & Setup

### Prerequisites

- Node.js and npm.
- Git.
- A modern web browser.
- Visual Studio Code or another code editor.

### Clone the Repository

```bash
git clone https://github.com/hchaupanjcwtf06/24520211_ToHuyenChau_Lab02.git
```

Enter the project directory:

```bash
cd 24520211_ToHuyenChau_Lab02
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite.

### Production Build

```bash
npm run build
```

## 8. Running the Exercises

The project uses a shared Mini-React engine with separate application entry points.

### Exercise 1

Exercise 1 is preserved through its core implementation, automated tests, and Git history.

Run its factory tests:

```bash
node src/test-ex1.js
```

The original Exercise 1 interface is available in the corresponding Git milestone.

### Exercise 2

To run the Task Manager, configure `index.html` to load:

```html
<script type="module" src="/src/main.js"></script>
```

Then run:

```bash
npm run dev
```

### Exercise 3

To run the Async State Machine, configure `index.html` to load:

```html
<script type="module" src="/src/exercise3.js"></script>
```

Then run:

```bash
npm run dev
```

Exercise 3 is the current default application entry point.

## 9. Testing

The following commands verify the core logic:

```bash
node src/test-ex1.js
node src/test-state.js
node src/test-async.js
npm run build
```

Browser-based tests and manual inspection are required for DOM rendering and event delegation.

Important verification activities include:

- Inspecting semantic DOM structure in DevTools.
- Checking that HTML-like strings are rendered safely.
- Confirming root-level event delegation.
- Testing Task Manager state updates and filters.
- Observing the skeleton loader during asynchronous requests.
- Verifying error recovery using the Retry button.
- Confirming that no unexpected errors appear in the browser console.

## 10. Engineering Practices

The project follows several engineering principles:

**Contract-First Development:** Component structures and expected behaviors are defined before implementation.

**Atomic Git Commits:** Major architectural milestones are committed separately.

**Separation of Concerns:** VNode creation, DOM rendering, state management, event handling, and asynchronous data operations are organized into separate modules.

**One-Way Data Flow:** State changes trigger rendering, and the rendered interface reflects the current state.

**Defensive Programming:** Input validation, explicit lifecycle states, and stale-request protection reduce common implementation errors.

**Semantic HTML & Accessibility:** Semantic elements, accessible status messages, and keyboard focus styles are used where appropriate.

## 11. Known Limitations

This project is an educational implementation and is not a replacement for React.

Current limitations include:

- No Virtual DOM reconciliation or diffing algorithm.
- Full DOM subtree replacement during reactive rendering.
- Hook state is managed through a single shared cursor.
- Hooks must be called in a consistent order.
- Replacing DOM nodes may affect focus preservation.
- No component-level error boundary comparable to a production framework.
- Asynchronous data is simulated rather than retrieved from a production API.

These limitations help define the scope of the laboratory implementation.

## 12. Git Commit History

The project records separate milestones for initialization, Virtual DOM implementation, state management, event delegation, reactive UI development, and asynchronous state handling.

The required Exercise milestones are:

1. `feat(core): implement createElement factory`
2. `feat(core): implement renderToDOM`
3. `feat(state): implement stateStore and resetCursor engine`
4. `feat(state): implement reactive useState dispatcher`
5. `feat(events): attach root event delegation listener`
6. `feat(ui): assemble reactive todo application`
7. `feat(ui): implement multi-state data component with skeleton feedback`

Additional documentation commits record engineering contracts and verification progress.

## 13. Conclusion

This laboratory demonstrates how core frontend architecture concepts can be implemented without relying on an existing UI framework.

The completed implementation covers Virtual DOM creation, recursive DOM rendering, closure-based state management, root event delegation, reactive user interfaces, and resilient asynchronous state handling.

The project also emphasizes incremental development, automated verification, and traceable Git history.