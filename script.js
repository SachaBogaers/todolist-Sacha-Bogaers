const baseUrl = 'http://localhost:3000/';
const toDoInput = document.querySelector('#todo-item');
const toDoButton = document.querySelector('#add-todo-item');
const toDoList = document.querySelector('#todo-list')


// Creating certain elements 
const createElement = (type, innerHTML, classList) => {
	const element = document.createElement(type);
	if (typeof innerHTML != 'undefined') {
		element.innerHTML = innerHTML;
	}
	if (typeof classList != 'undefined') {
		element.classList = classList;
	}
	return element;
}

const deleteItem = async (deleteButton) => {
	const deletedItem = deleteButton.parentElement;
	const id = deletedItem.getAttribute("data-id");
	deletedItem.remove();
	const deleting = await fetch(`${baseUrl}${id}`, {
		method: 'DELETE',
		headers: {
			"Content-Type": "application/json",
		}
	});
}

const createDeleteButton = () => {
	const deleteButton = createElement('i');
	deleteButton.classList.add("far", "fa-trash-alt");
	deleteButton.addEventListener("click", function () {
		deleteItem(deleteButton);
	})
	return deleteButton;
}


// Getting initial state

const getData = async () => {
	const response = await fetch(baseUrl, {
		method: 'GET',
		headers: {
			"Content-Type": "application/json",
		}
	});
	const fixedResponse = await response.json();
	return fixedResponse;
}

const createList = async () => {
	const data = await getData().then(
		(value) => value.forEach(item => {
			console.log(item)
			const listItem = createElement('li', `${item.description}, Done: ${item.done}`);
			toDoList.appendChild(listItem);
			const deleteButton = createDeleteButton();
			listItem.appendChild(deleteButton);
			getId(item, listItem, deleteButton)
		})
	)
};

createList();

const postData = dataObject => {
	fetch(baseUrl, {
		method: "POST",
		body: JSON.stringify(dataObject),
		headers: {
			"Content-Type": "application/json",
		},
	});
}

const getId = (addedItem, listItem, deleteButton) => {
	const id = addedItem._id;
	listItem.setAttribute("data-id", id);
	deleteButton.setAttribute("data-id", id);
}

const addNewItem = async () => {
	const value = toDoInput.value;
	if (value == "") {
		alert("You did not enter any item!");
		return;
	}
	const input = {
		description: value,
		done: false
	}
	const listItem = createElement('li', `${value}, Done: ${input.done}`);
	const deleteButton = createDeleteButton();
	listItem.appendChild(deleteButton);
	toDoList.appendChild(listItem);
	postData(input)
	const toDoItems = await getData();
	const addedItem = toDoItems[toDoItems.length - 1];
	getId(addedItem, listItem, deleteButton);
	return;
}

toDoButton.addEventListener('click', addNewItem);

