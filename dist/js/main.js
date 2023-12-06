document.addEventListener('DOMContentLoaded', () => {
	fetch('http://localhost:3000/tasks')
		.then(response => response.json())
		.then(data => renderTasks(data))
		.catch(error => console.error('Błąd przy pobieraniu zadań:', error))
})

function renderTasks(tasks) {
	const taskList = document.getElementById('task-list')
	taskList.innerHTML = ''
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
			fetch('http://localhost:3000/tasks')
				.then(response => response.json())
				.then(data => renderTasks(data))
				.catch(error => console.error('Błąd przy pobieraniu zadań:', error))
		})
		.catch(error => console.error('Błąd przy aktualizacji zadania:', error))
}

function editTask(id) {
	console.log('Edycja zadania o ID:', id)
	// Tutaj logika do edycji zadania
}

function deleteTask(id) {
	fetch(`http://localhost:3000/tasks/${id}`, {
		method: 'DELETE',
	})
		.then(response => response.json())
		.then(data => {
			console.log('Usunięto zadanie o ID:', id)
			fetch('http://localhost:3000/tasks')
				.then(response => response.json())
				.then(data => renderTasks(data))
				.catch(error => console.error('Błąd przy pobieraniu zadań:', error))
		})
		.catch(error => console.error('Błąd przy aktualizacji zadania:', error))
}
