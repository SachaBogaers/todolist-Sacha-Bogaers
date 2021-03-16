const toDoInput = document.querySelector('#todo-input');
const toDoButton = document.querySelector('#add-todo-item');
const toDoList = document.querySelector('#todo-list');

// Creating certain elements
// General function to create different types of elements, passing type, innerHTML, classList
const createElement = (type, innerHTML, classList) => {
	const element = document.createElement(type);
	if (typeof innerHTML != 'undefined') {
		element.innerHTML = innerHTML;
	};
	if (typeof classList != 'undefined') {
		element.classList = classList;
	};
	return element;
}

const createDeleteButton = () => {
	const deleteButton = createElement('i');
	deleteButton.classList.add("far", "fa-trash-alt");
	deleteButton.addEventListener("click", function () {
		deleteItem(deleteButton);
	});
	return deleteButton;
}

const createCheckbox = () => {
	const checkbox = createElement('input', "", "checkbox");
	checkbox.type = "checkbox";
	checkbox.addEventListener("click", function (e) {
		checkItem(e);
	})
	return checkbox;
}


// Setting id on elements
const setId = (addedItem, listItem, deleteButton, checkbox) => {
	const id = addedItem._id;
	listItem.setAttribute("data-id", id);
	deleteButton.setAttribute("data-id", id);
	checkbox.setAttribute("data-id", id);
}


// Changing elements when interacting with the page
// Called when a checkbox is ticked
const checkItem = (e) => {
	const target = e.target;
	const sibling = target.nextSibling;
	const id = target.getAttribute("data-id");
	sibling.classList.toggle("done");
	const done = sibling.classList.value;
	if (done) {
		const dataObject = {
			done: true
		}
		changeData(dataObject, id);
	} else {
		const dataObject = {
			done: false
		}
		changeData(dataObject, id);
	}
}

// Called when save icon is clicked
const saveItem = (e) => {
	const targetItem = e.target;
	const listItem = targetItem.parentElement;
	const id = listItem.getAttribute("data-id");
	const input = listItem.querySelector(".edit");
	const value = input.value;
	const checkbox = listItem.querySelector(".checkbox");
	const label = createElement('label', value, "todo-label done");
	input.remove();
	targetItem.remove();
	const dataObject = {
		description: value
	}
	deleteButton = listItem.querySelector("i");
	if (checkbox.checked) {
		label.classList.add("done")
		dataObject.done = true;
	} else if (!checkbox.checked) {
		label.classList.remove("done")
		dataObject.done = false;
	}
	listItem.insertBefore(label, deleteButton);
	changeData(dataObject, id);
	return;
}

// Called when an item is clicked
const editItem = (e) => {
	const targetItem = e.target;
	const listItem = targetItem.parentElement;
	if (targetItem.nodeName === "INPUT") {
		return;
	} else if (targetItem.nodeName === "LABEL") {
		const task = targetItem.innerHTML;
		targetItem.remove();
		const input = createElement('input', "", "edit");
		input.value = task;
		input.type = "text";
		deleteButton = listItem.querySelector("i");
		listItem.insertBefore(input, deleteButton);
		saveButton = createElement('i', "", "fas fa-save");
		saveButton.addEventListener("click", function (e) {
			saveItem(e);
		})
		listItem.insertBefore(saveButton, deleteButton);
	}
}


// Called when 'Add Task' button is clicked
const addNewItem = async () => {
	const value = toDoInput.value;
	if (value == "") {
		alert("You did not enter any text!");
		return;
	}
	const input = {
		description: value,
		done: false
	}
	const listItem = createListItem(input);
	const deleteButton = createDeleteButton();
	listItem.appendChild(deleteButton);
	const checkbox = createCheckbox();
	listItem.prepend(checkbox);
	toDoInput.value = "";
	postData(input);
	const toDoItems = await getData();
	const addedItem = toDoItems[toDoItems.length - 1];
	setId(addedItem, listItem, deleteButton, checkbox);
}

const deleteItem = (deleteButton) => {
	const deletedItem = deleteButton.parentElement;
	const id = deletedItem.getAttribute("data-id");
	deletedItem.remove();
	deleteData(id);
}


toDoButton.addEventListener('click', addNewItem);
toDoInput.addEventListener('keypress', function (e) {
	if (e.key === 'Enter') {
		addNewItem();
	}
})
