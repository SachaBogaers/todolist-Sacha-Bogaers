const baseUrl = 'http://localhost:3000/';

// Getting current state of API data
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



const createListItem = item => {
	const listItem = createElement('li');
	const itemLabel = createElement('label', item.description, "todo-label");
	toDoList.appendChild(listItem);
	listItem.appendChild(itemLabel);
	listItem.addEventListener('click', function (e) {
		editItem(e)
	})
	return listItem;
}

// Creating list and adding to DOM
const createList = async () => {
	const data = await getData().then(
		(value) => value.forEach(item => {
			const listItem = createListItem(item)
			const deleteButton = createDeleteButton();
			listItem.appendChild(deleteButton);
			const checkbox = createCheckbox();
			listItem.prepend(checkbox);
			if (item.done) {
				itemLabel.classList.add("done");
				checkbox.checked = true;
			}
			setId(item, listItem, deleteButton, checkbox)
		})
	)
};
createList();


// Adding new items to data
const postData = dataObject => {
	fetch(baseUrl, {
		method: "POST",
		body: JSON.stringify(dataObject),
		headers: {
			"Content-Type": "application/json",
		},
	});
}

// Changing items in the data
const changeData = async (dataObject, id) => {
	await fetch(`${baseUrl}${id}`, {
		method: 'PUT',
		body: JSON.stringify(dataObject),
		headers: {
			"Content-Type": "application/json",
		}
	})
}

// Deleting items from the data
const deleteData = async (id) => {
	await fetch(`${baseUrl}${id}`, {
		method: 'DELETE',
		headers: {
			"Content-Type": "application/json",
		}
	});
};


