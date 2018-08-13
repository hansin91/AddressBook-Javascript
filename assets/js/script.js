// modal
const modalFormAdd = document.getElementById('modal-form-add');
const modalDeletConfirmation = document.getElementById('modal-delete-confirmation');

// form
const errorName = document.getElementById('error-name');
const inputName = document.getElementById('name');
const errorAddress = document.getElementById('error-address');
const inputAddress = document.getElementById('address');
const errorPhone = document.getElementById('error-phone-number');
const inputPhone = document.getElementById('phone-number');
const errorEmail = document.getElementById('error-email');
const inputEmail = document.getElementById('email');

// search
const inputSearch = document.getElementById('search');

// table
const table = document.getElementById('tbl-address-books');
const tblBody = table.querySelector('tbody');

// button
const openModalBtn = document.getElementById('open-modal-form-add');

let paramSearch;

let name;
let address;
let phone;
let email;
let arrayAddressBook =
	localStorage.getItem('addressBooks') !== null ? JSON.parse(localStorage.getItem('addressBooks')) : [];

const getLastId = function() {
	let lastNumber = 0;
	if (arrayAddressBook.length > 0) {
		let lastObject = arrayAddressBook[arrayAddressBook.length - 1];
		lastNumber = lastObject.id;
	}
	return lastNumber;
};

const resetForm = function() {
	inputName.value = '';
	inputAddress.value = '';
	inputPhone.value = '';
	inputEmail.value = '';
	showHide(inputName, errorName, 'hide');
	showHide(inputAddress, errorAddress, 'hide');
	showHide(inputPhone, errorPhone, 'hide');
	showHide(inputEmail, errorEmail, 'hide');
};

const openModal = function(modal) {
	modal.style.display = 'block';
};

const closeModal = function(modal) {
	modal.style.display = 'none';
};

const showHide = function(input, error, condition) {
	if (condition == 'show') {
		input.classList.add('input-error');
		error.classList.remove('hide');
		error.classList.add('show');
	} else {
		input.classList.remove('input-error');
		error.classList.add('hide');
		error.classList.remove('show');
	}
};

const checkInputLength = function(param, input, error) {
	if (param.length <= 0) {
		showHide(input, error, 'show');
	} else {
		showHide(input, error, 'hide');
	}
};

const validateEmail = function(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

const validate = function() {
	errorEmail.innerHTML = '*Email is required';
	name = inputName.value;
	address = inputAddress.value;
	phone = inputPhone.value;
	email = inputEmail.value;

	checkInputLength(name, inputName, errorName);
	checkInputLength(address, inputAddress, errorAddress);
	checkInputLength(phone, inputPhone, errorPhone);
	checkInputLength(email, inputEmail, errorEmail);

	let isPassed;
	if (name.length <= 0 || address.length <= 0 || phone.length <= 0 || email.length <= 0) {
		isPassed = false;
	} else if (!validateEmail(email)) {
		isPassed = false;
		errorEmail.innerHTML = '*Email is invalid';
		showHide(inputEmail, errorEmail, 'show');
	} else {
		isPassed = true;
	}

	return isPassed;
};

const createObject = function() {
	let counter = getLastId();
	counter++;
	let addressBook = {
		id: counter,
		name: name,
		address: address,
		phone: phone,
		email: email,
		button: ''
	};
	return addressBook;
};

const generateTable = function(array) {
	let contentTable = '';
	if (array.length > 0) {
		for (let i = 0; i < array.length; i++) {
			contentTable += '<tr id="' + array[i]['id'] + '">';
			for (var v in array[i]) {
				if (v == 'id') {
					contentTable += '<td>' + (i + 1).toString() + '</td>';
				} else if (v == 'button') {
					contentTable +=
						'<td><input type="submit" class="btn btn-success" value="Edit" onclick="editAddressBook(this)"><input type="submit" class="btn btn-danger" value="Delete" onclick="deleteAddressBook(this)"></td>';
				} else {
					contentTable += '<td>' + array[i][v] + '</td>';
				}
			}
			contentTable + '</tr>';
		}
	} else {
		contentTable += '<tr><td colspan="6">No data found</td></tr>';
	}
	tblBody.innerHTML = contentTable;
};

const deleteAddressBook = function(element) {
	openModal(modalDeletConfirmation);
	document.getElementById('deleted-address-book-id').value = element.parentNode.parentNode.getAttribute('id');
};

const getAddressBookById = function(id) {
	let addressBook = arrayAddressBook.filter((addressBook) => addressBook.id == id);
	return addressBook;
};

const setAddressBookInputValue = function(id) {
	let addressBook = getAddressBookById(id)[0];
	inputName.value = addressBook.name;
	inputAddress.value = addressBook.address;
	inputPhone.value = addressBook.phone;
	inputEmail.value = addressBook.email;
	document.getElementById('edited-address-book-id').value = id;
};

const editAddressBook = function(element) {
	openModal(modalFormAdd);
	let title = (modalFormAdd.querySelector('.modal-title').querySelector('h5').innerHTML = 'Edit Address Book');
	document
		.getElementById('modal-form-add')
		.querySelector('.modal-footer')
		.querySelector('#btn-add')
		.classList.add('hide');

	document
		.getElementById('modal-form-add')
		.querySelector('.modal-footer')
		.querySelector('#btn-edit')
		.classList.remove('hide');

	let id = element.parentNode.parentNode.getAttribute('id');
	setAddressBookInputValue(id);
};

const removeStorage = function() {
	localStorage.removeItem('addressBooks');
	localStorage.clear();
};

const searchAddress = function(param) {
	let arrayFilterSearch = arrayAddressBook.filter(
		(addressBook) =>
			addressBook.name.toLowerCase().includes(param) ||
			addressBook.address.toLowerCase().includes(param) ||
			addressBook.phone.toString().toLowerCase().includes(param) ||
			addressBook.email.toString().toLowerCase().includes(param)
	);
	return arrayFilterSearch;
};

const setAddressBook = function(id) {
	let index = arrayAddressBook.findIndex((addressBook) => addressBook.id == id);
	arrayAddressBook[index].name = inputName.value;
	arrayAddressBook[index].address = inputAddress.value;
	arrayAddressBook[index].phone = inputPhone.value;
	arrayAddressBook[index].email = inputEmail.value;
};

openModalBtn.onclick = function() {
	openModal(modalFormAdd);
	modalFormAdd.querySelector('.modal-title').querySelector('h5').innerHTML = 'Add Address Book';
	modalFormAdd.querySelector('.modal-footer').querySelector('#btn-edit').classList.add('hide');
	modalFormAdd.querySelector('.modal-footer').querySelector('#btn-add').classList.remove('hide');
	resetForm();
};

document.getElementById('btn-close-modal').onclick = function() {
	closeModal(modalFormAdd);
	resetForm();
};

document.getElementById('btn-add').onclick = function() {
	if (validate()) {
		closeModal(modalFormAdd);
		arrayAddressBook.push(createObject());
		if (typeof Storage !== undefined) {
			localStorage.setItem('addressBooks', JSON.stringify(arrayAddressBook));
			paramSearch = new URLSearchParams(window.location.search).get('s');
			generateTable(paramSearch !== null ? searchAddress(paramSearch.toLowerCase()) : arrayAddressBook);
		}
	}
};

document.getElementById('btn-close-modal-delete-confirmation').onclick = function() {
	closeModal(modalDeletConfirmation);
};

if (document.getElementById('btn-edit') !== null) {
	document.getElementById('btn-edit').onclick = function() {
		if (validate()) {
			let id = document.getElementById('edited-address-book-id').value;
			setAddressBook(id);
			localStorage.setItem('addressBooks', JSON.stringify(arrayAddressBook));
			paramSearch = new URLSearchParams(window.location.search).get('s');
			generateTable(paramSearch !== null ? searchAddress(paramSearch.toLowerCase()) : arrayAddressBook);
			closeModal(modalFormAdd);
		}
	};
}

document.getElementById('btn-delete-address-book').onclick = function() {
	let deletedId = document.getElementById('deleted-address-book-id').value;
	arrayAddressBook = arrayAddressBook.filter((addressBook) => addressBook.id != deletedId);
	localStorage.setItem('addressBooks', JSON.stringify(arrayAddressBook));
	if (arrayAddressBook.length == 0) {
		removeStorage();
	}
	paramSearch = new URLSearchParams(window.location.search).get('s');
	generateTable(paramSearch !== null ? searchAddress(paramSearch) : arrayAddressBook);
	closeModal(modalDeletConfirmation);
};

inputSearch.onkeyup = function(e) {
	e.preventDefault();
	let search = inputSearch.value.toLowerCase();
	let arrayFilterSearch = searchAddress(search);
	generateTable(arrayFilterSearch);
};

paramSearch = new URLSearchParams(window.location.search).get('s');
if (paramSearch !== null) {
	generateTable(searchAddress(paramSearch.toLowerCase()));
	inputSearch.value = paramSearch;
} else {
	generateTable(arrayAddressBook);
}
