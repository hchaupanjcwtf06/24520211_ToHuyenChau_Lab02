
/**
 * Lab 02 - Exercise 2
 * Reactive Task Manager
 */

import {
  createElement as h,
  renderToDOM
} from './mini-react.js';

import {
  useState,
  resetCursor,
  setRenderer
} from './state.js';

import {
  setupEventDelegation
} from './events.js';

import './style.css';

const root = document.getElementById('app');

if (!root) {
  throw new Error('Root #app was not found');
}

/**
 * Main application component.
 */
function TaskApp() {
  // Hook 0: Task list
  const [tasks, setTasks] = useState([
    {
      id: 'task-1',
      title: 'Review PR',
      completed: false
    },
    {
      id: 'task-2',
      title: 'Verify AST',
      completed: true
    }
  ]);

  // Hook 1: Current filter
  const [filter, setFilter] = useState('ALL');

  /**
   * Add a new task.
   */
  function addTask() {
    const newTask = {
      id: crypto.randomUUID(),
      title: `New Task ${tasks.length + 1}`,
      completed: false
    };

    setTasks(previousTasks => [
      ...previousTasks,
      newTask
    ]);
  }

  /**
   * Toggle task completion.
   */
  function toggleTask(id) {
    setTasks(previousTasks =>
      previousTasks.map(task =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed
            }
          : task
      )
    );
  }

  /**
   * Delete a task.
   */
  function deleteTask(id) {
    setTasks(previousTasks =>
      previousTasks.filter(task => task.id !== id)
    );
  }

  /**
   * Filter visible tasks.
   */
  const visibleTasks = tasks.filter(task => {
    if (filter === 'ACTIVE') {
      return !task.completed;
    }

    if (filter === 'COMPLETED') {
      return task.completed;
    }

    return true;
  });

  /**
   * Reusable filter button.
   */
  function filterButton(value, label) {
    return h(
      'button',
      {
        type: 'button',
        className: 'filter-button',
        'aria-pressed': filter === value
          ? 'true'
          : 'false',
        onClick: () => setFilter(value)
      },
      label
    );
  }

  /**
   * Reusable task item.
   */
  function taskItem(task) {
    return h(
      'li',
      {
        key: task.id,
        className: 'task-item'
      },

      h(
        'span',
        {
          className: task.completed
            ? 'task-title completed'
            : 'task-title'
        },
        task.title
      ),

      h(
        'button',
        {
          type: 'button',
          className: 'action-button',
          'aria-label':
            `${task.completed ? 'Undo' : 'Complete'} ${task.title}`,
          onClick: () => toggleTask(task.id)
        },
        task.completed ? 'Undo' : 'Complete'
      ),

      h(
        'button',
        {
          type: 'button',
          className: 'delete-button',
          'aria-label': `Delete ${task.title}`,
          onClick: () => deleteTask(task.id)
        },
        'Delete'
      )
    );
  }

  /**
   * Return the application VNode tree.
   */
  return h(
    'main',
    {
      id: 'task-manager',
      className: 'app-container'
    },

    h(
      'header',
      { className: 'app-header' },

      h(
        'h1',
        null,
        'Reactive Task Manager'
      ),

      h(
        'p',
        null,
        'Lab 02 - Exercise 2'
      ),

      h(
        'p',
        {
          id: 'task-count',
          'aria-live': 'polite'
        },
        `Total Tasks: ${tasks.length}`
      )
    ),

    h(
      'section',
      {
        className: 'control-section',
        'aria-label': 'Task controls'
      },

      h(
        'button',
        {
          id: 'add-task',
          type: 'button',
          className: 'primary-button',
          onClick: addTask
        },
        'Add Task'
      ),

      h(
        'nav',
        {
          className: 'filter-nav',
          'aria-label': 'Task filters'
        },

        filterButton('ALL', 'All'),
        filterButton('ACTIVE', 'Active'),
        filterButton('COMPLETED', 'Completed')
      )
    ),

    h(
      'section',
      {
        className: 'list-section',
        'aria-label': 'Task list'
      },

      h(
        'h2',
        null,
        'Tasks'
      ),

      h(
        'p',
        {
          id: 'visible-count'
        },
        `Showing ${visibleTasks.length} task(s)`
      ),

      visibleTasks.length === 0
        ? h(
            'p',
            { className: 'empty-message' },
            'No tasks found.'
          )
        : h(
            'ul',
            {
              id: 'task-list',
              className: 'task-list'
            },
            ...visibleTasks.map(taskItem)
          )
    )
  );
}

/**
 * Application render cycle.
 */
let renderCount = 0;

function renderApp() {
  resetCursor();

  const vnode = TaskApp();

  const dom = renderToDOM(
    vnode,
    { delegateEvents: true }
  );

  root.replaceChildren(dom);

  renderCount++;

  console.log(
    `Render completed: ${renderCount}`
  );
}

/**
 * Initialize application.
 *
 * Delegation is attached only once.
 */
setupEventDelegation(root);

setRenderer(renderApp);

renderApp();

console.log('Exercise 2 initialized');
