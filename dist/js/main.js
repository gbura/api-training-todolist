const uploadApi = () => {
	document.addEventListener('DOMContentLoaded', () => {
		fetch('http://localhost:3000/tasks')
			.then(response => response.json())
			.then(data => renderTasks(data))
			.catch(error => console.error('Błąd przy pobieraniu zadań:', error))
	})
}

function renderTasks(tasks) {
	const taskList = document.getElementById('task-list')
	taskList.innerHTML = ''

	const addTaskButton = document.createElement('button')
	addTaskButton.textContent = 'Dodaj'
	addTaskButton.className = 'btn btn-add'
	addTaskButton.addEventListener('click', addTask)

	const newTaskInput = document.createElement('input')
	newTaskInput.type = 'text'
	newTaskInput.placeholder = 'Dodaj nowe zadanie'
	newTaskInput.className = 'px-1 py-2'
	newTaskInput.id = 'newTaskInput'

	taskList.append(newTaskInput)
	taskList.append(addTaskButton)

	tasks.forEach(task => {
		const taskItem = document.createElement('li')
		taskItem.className = 'p-2 flex justify-between items-center mb-2'
		taskItem.setAttribute('data-id', task.id)

		const text = document.createElement('span')
		text.textContent = task.title + (task.completed ? ' (Zakończono)' : ' (Niewykonane)')
		text.className = task.completed ? 'text-green-500' : 'text-red-500'

		const buttons = document.createElement('div')

		const completeButton = document.createElement('button')
		completeButton.textContent = 'Wykonaj'
		completeButton.className = 'btn btn-complete'
		completeButton.setAttribute('data-action', 'complete')

		const editButton = document.createElement('button')
		editButton.textContent = 'Edytuj'
		editButton.className = 'btn btn-edit'
		editButton.setAttribute('data-action', 'edit')

		const deleteButton = document.createElement('button')
		deleteButton.textContent = 'Usuń'
		deleteButton.className = 'btn btn-delete'
		deleteButton.setAttribute('data-action', 'delete')

		buttons.appendChild(completeButton)
		buttons.appendChild(editButton)
		buttons.appendChild(deleteButton)

		taskItem.appendChild(text)
		taskItem.appendChild(buttons)

		taskList.appendChild(taskItem)
	})

	// Ustawienie nasłuchiwacza zdarzeń na elemencie <ul>
	taskList.addEventListener('click', handleTaskListClick)
}

function handleTaskListClick(event) {
	const taskItem = event.target.closest('li[data-id]')
	const taskId = taskItem.getAttribute('data-id')
	if (event.target.matches('[data-action=complete]')) {
		completeTask(taskId)
	} else if (event.target.matches('[data-action=edit]')) {
		editTask(taskId)
	} else if (event.target.matches('[data-action=delete')) {
		deleteTask(taskId)
	}
}

function addTask() {
	const newTaskInput = document.getElementById('newTaskInput')
	const newTitle = newTaskInput.value

	if (newTitle.trim() === '') {
		alert('Wprowadź treść zadania!')
		return
	}

	fetch('http://localhost:3000/tasks', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ title: newTitle, completed: false }),
	})
		.then(response => response.json())
		.then(data => {
			console.log('Dodano nowe zadanie', data)
			uploadApi()
		})
		.catch(error => console.error('Błąd przy dodawaniu zadania', error))
	newTaskInput.value = ''
}

function completeTask(id) {
	fetch(`http://localhost:3000/tasks/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ completed: true }),
	})
		.then(response => response.json())
		.then(data => {
			console.log('Wykonano zadanie o ID:', id)
			uploadApi()
		})
		.catch(error => console.error('Błąd przy aktualizacji zadania:', error))
}

function editTask(id) {
	const taskItem = document.querySelector(`li[data-id="${id}"]`)
	const text = taskItem.querySelector('span')
	const input = document.createElement('input')
	input.type = 'text'
	input.value = text.textContent
	text.textContent = ''
	text.appendChild(input)

	input.addEventListener('keyup', function (e) {
		if (e.key === 'Enter') {
			const newTitle = input.value
			saveEditedTask(id, newTitle)
		}
	})
}

function saveEditedTask(id, newTitle) {
	fetch(`http://localhost:3000/tasks/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ title: newTitle }),
	})
		.then(response => response.json())
		.then(data => {
			console.log('Edytowano zadanie o ID:', id)
			uploadApi()
		})
}

function deleteTask(id) {
	fetch(`http://localhost:3000/tasks/${id}`, {
		method: 'DELETE',
	})
		.then(response => response.json())
		.then(data => {
			console.log('Usunięto zadanie o ID:', id)
			uploadApi()
		})
		.catch(error => console.error('Błąd przy aktualizacji zadania:', error))
}

uploadApi()
