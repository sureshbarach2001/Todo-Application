document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api/todos';
    let searchText = "";
    let prioFilter = "all";

    // DOM elements
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const searchInput = document.getElementById('searchInput');
    const priorityFilter = document.getElementById('priorityFilter');
    const highBox = document.querySelector('#highTasks .tasks');
    const medBox = document.querySelector('#mediumTasks .tasks');
    const lowBox = document.querySelector('#lowTasks .tasks');
    const doneBox = document.getElementById('completedList');
    const countElem = document.getElementById('taskCount');
    const modeBtn = document.getElementById('darkModeToggle');

    // Modal elements
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const editInput = document.getElementById('edit-input');
    const editPriority = document.getElementById('edit-priority');
    let currentTodoId = null;

    // Utility functions
    const escapeHTML = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    const showError = (message) => {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        document.body.prepend(errorEl);
        setTimeout(() => errorEl.remove(), 3000);
    };

    // Fetch todos from backend and refresh the list
    const refreshList = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch todos');
            const todos = await response.json();

            highBox.innerHTML = '';
            medBox.innerHTML = '';
            lowBox.innerHTML = '';
            doneBox.innerHTML = '';

            // Filter pending todos based on search and priority
            let pending = todos.filter(item => !item.completed)
                              .filter(item => {
                                  const matchText = item.task.toLowerCase().includes(searchText.toLowerCase());
                                  const matchPrio = prioFilter === 'all' || item.priority === prioFilter;
                                  return matchText && matchPrio;
                              });

            let highItems = pending.filter(item => item.priority === 'high');
            let medItems = pending.filter(item => item.priority === 'medium');
            let lowItems = pending.filter(item => item.priority === 'low');

            const makeCard = item => {
                let div = document.createElement('div');
                div.classList.add('task', item.priority);
                div.innerHTML = `
                    <span>${escapeHTML(item.task)}</span>
                    <button class="btn-complete" data-id="${item._id}"><i class="fas fa-check"></i></button>
                    <button class="btn-edit" data-id="${item._id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" data-id="${item._id}"><i class="fas fa-trash"></i></button>
                `;
                return div;
            };

            highItems.forEach(item => highBox.appendChild(makeCard(item)));
            medItems.forEach(item => medBox.appendChild(makeCard(item)));
            lowItems.forEach(item => lowBox.appendChild(makeCard(item)));

            // Filter completed todos
            let doneItems = todos.filter(item => item.completed)
                                .filter(item => item.task.toLowerCase().includes(searchText.toLowerCase()));
            doneItems.forEach(item => {
                let div = document.createElement('div');
                div.classList.add('task', 'completed');
                div.innerHTML = `<span>${escapeHTML(item.task)}</span>`;
                doneBox.appendChild(div);
            });

            // Update pending task count
            let pendingCount = todos.reduce((cnt, item) => !item.completed ? cnt + 1 : cnt, 0);
            countElem.textContent = pendingCount;
        } catch (error) {
            showError('Failed to load tasks. Please try refreshing.');
            console.error('Error fetching todos:', error);
        }
    };

    // Add task
    addTaskBtn.addEventListener('click', async () => {
        const taskText = taskInput.value.trim();
        const taskPrio = prioritySelect.value;
        if (taskText === '') {
            showError('Task cannot be empty!');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: taskText, priority: taskPrio, completed: false })
            });
            if (!response.ok) throw new Error('Failed to create task');
            taskInput.value = '';
            await refreshList();
        } catch (error) {
            showError('Failed to add task. Please try again.');
            console.error('Error creating todo:', error);
        }
    });

    // Search input
    searchInput.addEventListener('input', e => {
        searchText = e.target.value;
        refreshList();
    });

    // Priority filter
    priorityFilter.addEventListener('change', e => {
        prioFilter = e.target.value;
        refreshList();
    });

    // Modal functions
    const openEditModal = async (id) => {
        console.log('Attempting to edit todo with ID:', id); // Debug
        try {
            const response = await fetch(`${API_URL}/${id}`);
            console.log('Response status:', response.status); // Debug
            if (!response.ok) throw new Error('Task not found');
            const todo = await response.json();
            console.log('Fetched todo:', todo); // Debug
            currentTodoId = id;
            editInput.value = escapeHTML(todo.task);
            editPriority.value = todo.priority;
            editModal.classList.add('active');
        } catch (error) {
            showError(error.message);
            console.error('Error fetching todo:', error);
            closeModal();
        }
    };

    const closeModal = () => {
        editModal.classList.remove('active');
        currentTodoId = null;
        editInput.value = '';
    };

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newTask = editInput.value.trim();
        const newPriority = editPriority.value;
        if (!newTask || !currentTodoId) {
            showError('Task cannot be empty!');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${currentTodoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: newTask, priority: newPriority })
            });
            if (!response.ok) throw new Error('Failed to update task');
            closeModal();
            await refreshList();
        } catch (error) {
            showError('Failed to update task. Please try again.');
            console.error('Error updating todo:', error);
        }
    });

    editModal.querySelector('.close-btn').addEventListener('click', closeModal);
    editModal.querySelector('.cancel-btn').addEventListener('click', closeModal);
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeModal();
    });

    // Handle complete, edit, and delete actions
    document.querySelector('.pending-tasks').addEventListener('click', async (e) => {
        const btn = e.target.closest('button'); // Ensure we get the button even if clicking the icon
        if (!btn) return;
        const idVal = btn.getAttribute('data-id');

        if (btn.classList.contains('btn-delete')) {
            try {
                const response = await fetch(`${API_URL}/${idVal}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Failed to delete task');
                await refreshList();
            } catch (error) {
                showError('Failed to delete task.');
                console.error('Error deleting todo:', error);
            }
        } else if (btn.classList.contains('btn-complete')) {
            try {
                const response = await fetch(`${API_URL}/${idVal}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ completed: true })
                });
                if (!response.ok) throw new Error('Failed to complete task');
                await refreshList();
            } catch (error) {
                showError('Failed to complete task.');
                console.error('Error completing todo:', error);
            }
        } else if (btn.classList.contains('btn-edit')) {
            openEditModal(idVal);
        }
    });

    // Dark mode toggle
    modeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        modeBtn.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
    });

    // Initial load
    refreshList();
});