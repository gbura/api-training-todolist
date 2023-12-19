const uploadApi = async () => {
	renderTasks(await handleApi.getAll())
}

class HandleApi {
	constructor(URL) {
		this.URL = URL
	}

	async getAll() {
		try {
			const response = await fetch(this.URL)
			const data = await response.json()
			return data
		} catch (error) {
			console.error('Blad przy pobieraniu zadan')
		}
	}

	async addTask(task) {
		try {
			const response = await fetch(this.URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(task),
			})
			return await response.json()
		} catch (error) {
			console.error('Blad przy dodawaniu zadania')
		}
	}

	async deleteTask(id) {
		try {
			const response = await fetch(`${this.URL}/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			})
		} catch (error) {
			console.error('Blad przy usuwaniu zadania')
		}
	}

	async completeTask(id) {
		try {
			const response = await fetch(`${this.URL}/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ completed: true }),
			})
		} catch (error) {
			console.error('Blad przy wykonaniu zadania')
		}
	}

	async editTask(id, newTitle) {
		try {
			const response = await fetch(`${this.URL}/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title: newTitle }),
			})
		} catch (error) {
			console.error('Blad przy edycji zadania')
		}
	}
}

const handleApi = new HandleApi('http://localhost:3000/tasks')

function renderTasks(tasks) {
	const taskList = document.getElementById('task-list')
	taskList.innerHTML = ''

	const addTaskButton = document.createElement('button')
	addTaskButton.textContent = 'Dodaj'
	addTaskButton.className = 'btn btn-add'
	addTaskButton.addEventListener('click', e => {
		e.preventDefault()
		addTask()
	})

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
	const data = handleApi.addTask({ title: newTitle, completed: false })
	uploadApi()
	newTaskInput.value = ''
}

async function completeTask(id) {
	await handleApi.completeTask(id)
}

function editTask(id) {
	const taskItem = document.querySelector(`li[data-id="${id}"]`)
	const text = taskItem.querySelector('span')
	const input = document.createElement('input')
	input.type = 'text'
	input.value = text.textContent
	text.textContent = ''
	text.appendChild(input)

	input.addEventListener('keyup', async function (e) {
		if (e.key === 'Enter') {
			const newTitle = input.value
			await handleApi.editTask(id, newTitle)
		}
	})
}

async function deleteTask(id) {
	await handleApi.deleteTask(id)
}

uploadApi()
