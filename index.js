// card regex for test
const regex_VISA = new RegExp("^4[0-9]{6,}$");
const regex_Master = new RegExp("^5[1-5][0-9]{5,}|222[1-9][0-9]{3,}|22[3-9][0-9]{4,}|2[3-6][0-9]{5,}|27[01][0-9]{4,}|2720[0-9]{3,}$");
const regex_American = new RegExp("^3[47][0-9]{5,}$");
const regex_Discover = new RegExp("^6(?:011|5[0-9]{2})[0-9]{3,}$");
const numbers = new RegExp('/^[0-9]{1,10}$/');
// image files
const VisaIcon = './icons/Visa_card.jpg';
const MasterIcon = './icons/mastercard-credit-card.jpg';
const AmericanIcon = './icons/american-express.jpg';
const DiscoverIcon = './icons/discover-card.jpg';
// card input fields DOM
var cardNumberField = document.getElementById('card_number');
var cvvField = document.getElementById('cvv');
var expiryDateField = document.getElementById('expiry_date');
var submitButton = document.getElementById('buttonId');
var invalidFields = document.getElementById('invalid_fields');
var cardListOut = document.getElementById('cardListOut');
var imgOuter = document.getElementById('img_Outer');
var img_id_1 = document.getElementById('img_id_1');
var card_number_01 = document.getElementById('card_number_01');

// disable fields
submitButton.disabled = true;
cvvField.disabled = true;
expiryDateField.disabled = true;

// card declarations
const VISA = 'VISA';
const Master = 'Master';
const American = 'American';
const Discover = 'Discover';

// card field value initialization
var cardNumberValue = '';
var cvvValue = '';
var expiryDateVal = '';
var cardType = '';
var cancelled = true;

// handle card list fetch
var cardList = localStorage.getItem('cardList');
handleFetch(cardList);

// method to handle button state
function handleButtonState(cardNum, cvv, expiryDate) {
	if(cardNum !== '' && cvv !== '' && expiryDate !== '')
		submitButton.disabled = false;
	else
		submitButton.disabled = true;
}

// method to detect the cards
function checkCards(cardInput) {
	// card type detection
	let getInput = cardInput;
	let inputArr = cardInput.split(' ');
	if(inputArr && inputArr.length > 0)
		getInput = inputArr.join('');

	if(regex_VISA.test(getInput))
		return 'VISA';
	else if(regex_Master.test(getInput))
		return 'Master';
	else if(regex_American.test(getInput))
		return 'American';
	else if(regex_Discover.test(getInput))
		return 'Discover';
	else
		return null;
}

// card icon check
function setCardIcon(cardType, configureElements) {
	if(configureElements) {
		if(cardType === VISA)
			return VisaIcon;
		else if(cardType === Master)
			return MasterIcon;
		else if(cardType === Discover)
			return DiscoverIcon;
		else if(cardType === American)
			return AmericanIcon;
	}
	else {
		if(cardType === '' || cardType === null) {
			if(imgOuter.classList.contains('style__imgOuterClass')) {
				imgOuter.classList.remove('style__imgOuterClass');
				card_number_01.classList.remove('style__fieldOuterClass');
			}
		}
		else {
			imgOuter.classList.add('style__imgOuterClass');
			card_number_01.classList.add('style__fieldOuterClass');
		}

		if(cardType === VISA)
			img_id_1.src = VisaIcon;
		else if(cardType === Master)
			img_id_1.src = MasterIcon;
		else if(cardType === Discover)
			img_id_1.src = DiscoverIcon;
		else if(cardType === American)
			img_id_1.src = AmericanIcon;
	}
	
}

// card number field onkeyup listener
cardNumberField.addEventListener('keyup', (event) => {
	handleCardNumberField(event);
});

// on paste event listener
cardNumberField.addEventListener('paste', (event) => {
	handleCardNumberField(event);
});

// card number functionality
function handleCardNumberField(event) {
	let cardInput = event.target.value;
	let key = event.keyCode || event.charCode;
	invalidFields.innerHTML = '';
	cvvField.disabled = true;
	expiryDateField.disabled = true;
	if(event.target.value != '') {
		cardType = checkCards(cardInput);
		setCardIcon(cardType);
	}
	// check for backspace
	if(key !== 8) {
		// apply card number spacing
		let l = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
	    let getMatches = l.match(/\d{4,16}/g);
	    let getMatch = getMatches && getMatches[0] || ''
	    let getParts = []
		for (i=0, len=getMatch.length; i<len; i+=4) {
	        getParts.push(getMatch.substring(i, i+4));
	    }
	    if (getParts.length) {
	    	event.target.value = getParts.join(' ');
	    	cardNumberValue = event.target.value;
	    }
	    else {
	    	cardNumberValue = '';
	    }
	    // card types number limit
		if(cardType === American && cardInput.split('').length > 17) {
			cardNumberValue = event.target.value;
			event.preventDefault();
			// enable and focus other fields
			cvvField.disabled = false;
			expiryDateField.disabled = false;
			cvvField.focus();
		}
		else if(cardInput.split('').length > 18 && (cardType === VISA || cardType === Discover || cardType === Master)) {
			cardNumberValue = event.target.value;
			event.preventDefault();
			// enable and focus other fields
			cvvField.disabled = false;
			expiryDateField.disabled = false;
			cvvField.focus();
		}
		else {
			cardNumberValue = '';
			invalidFields.innerHTML = "Enter a valid card number!";
		}
	}
	handleButtonState(cardNumberValue, cvvValue, expiryDateVal);
}

// card input onchange function
function handleChange(event) {
	// apply card number spacing
	var v = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    var matches = v.match(/\d{4,16}/g);
    var match = matches && matches[0] || ''
    var parts = []
    for (i=0, len=match.length; i<len; i+=4) {
        parts.push(match.substring(i, i+4));
    }
    if (parts.length) {
    	event.target.value = parts.join(' ');
    	cardNumberValue = event.target.value;
    }
    else {
    	cardNumberValue = '';
    }
    handleButtonState(cardNumberValue, cvvValue, expiryDateVal);
}

// card number field onkeypress function
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

// cvv field on keydown
cvvField.addEventListener('keyup', (event) => {
	handleCvvField(event);
});

// on paste
cvvField.addEventListener('paste', (event) => {
	handleCvvField(event);
});

// handle cvv field functionality
function handleCvvField(event) {
	let cvvInput = event.target.value;
	let key = event.keyCode || event.charCode;
	if(key !== 8) {
		if(cardType === American && cvvInput.length > 3) {
			cvvValue = event.target.value;
			event.preventDefault();
			expiryDateField.focus();
		}
		else if(cvvInput.length > 2 && (cardType === VISA || cardType === Discover || cardType === Master)) {
			cvvValue = event.target.value;
			event.preventDefault();
			expiryDateField.focus();
		}
	}
	handleButtonState(cardNumberValue, cvvValue, expiryDateVal);
}

// cvv field onchange
function handleCvvChange(event) {
	let cvvInput = event.target.value;
	let key = event.keyCode || event.charCode;
	if(key !== 8) {
		if(cardType === American && cvvInput.length > 3)
			cvvValue = event.target.value;
		else if(cvvInput.length > 2)
			cvvValue = event.target.value;
		else
			cvvValue = '';
	}
	handleButtonState(cardNumberValue, cvvValue, expiryDateVal);
}

// expiry date keyup
expiryDateField.addEventListener('keyup', (event) => {
	handleDate(event);
})

// card date handle
function handleDate(event) {
	let key = event.keyCode || event.charCode;
	let dateValue = '';
	let today = new Date();
	let mm = parseInt(today.getMonth());
	let yyyy = parseInt(today.getFullYear());
	// validations and button state control
	if(event.currentTarget.value !== '') {
		dateValue = event.currentTarget.value.split('-');
		invalidFields.innerHTML = "Enter a valid expiration date!";
		if(((parseInt(dateValue[1]) >= (mm + 1) && parseInt(dateValue[0]) === yyyy) || parseInt(dateValue[0]) > yyyy) && dateValue[0].split('').length === 4) {
			expiryDateVal = dateValue[1] + '-' + dateValue[0];
			invalidFields.innerHTML = null;
			if(key !== 8) {
				event.preventDefault();
				submitButton.focus();
			}
		}
		else {
			expiryDateVal = '';
		}
	}
	handleButtonState(cardNumberValue, cvvValue, expiryDateVal);
}

// form onSubmit event handler
function handleSubmit(event) {
	let isValidated = true;
	if(cardNumberValue === '' || cvvValue === '' || expiryDateVal === '')
		isValidated = false;

	if(isValidated)
		handleStorage();
	else
		invalidFields.innerHTML = "Fill up the fields correctly!";
}

// insert data in local storage
function handleStorage() {
	let arr = [];
	let data = localStorage.getItem('cardList');
	let obj = {
		cardNumber: cardNumberValue,
		cvv: cvvValue,
		expiryDate: expiryDateVal
	};
	let sameCardPresent = false;
	if(data) {
		data = JSON.parse(data);
		if(data.length > 0) {
			data.map(item => {
				if(item.cardNumber === obj.cardNumber)
					sameCardPresent = true;
			});
			arr = data;
		}

		if(sameCardPresent)
			invalidFields.innerHTML = "Same card is present in the list";
		else
			arr.push(obj);
	}
	handleFetch(arr);
	let arrToString = JSON.stringify(arr);
	localStorage.setItem("cardList", arrToString);
	resetFields();
}

// method to get data from local storage
function handleFetch(cardList) {
	let getFetchedList = document.getElementById('fetchedList_1');
	// getFetchedList.classList.add('style__cardListOuter');
	if(getFetchedList) 
		cardListOut.removeChild(getFetchedList);

	let getList = cardList;
	let fetchedList = document.createElement('div');
	fetchedList.id = "fetchedList_1";
	let h4 = document.createElement('h4');
	h4.classList.add('style__savedCardsText');
	h4.innerHTML = "Saved Cards";

	if(getList && typeof getList === "string")
		getList = JSON.parse(getList);
	
	if(getList && getList.length > 0) {
		fetchedList.appendChild(h4);
		getList.map((list, index) => {
			configureElements(list, index, fetchedList);
		});
		getList.map((list, index) => {
			let cardFirstFour = list.cardNumber.split(" ");
			let removeButton = document.getElementById("id_index_" + cardFirstFour[0]);
			removeButton.addEventListener('click', function() {
				handleRemoveCard(list.cardNumber);
			});
		});
	}
}

// remove card method
function handleRemoveCard(cardNumber) {
	let fetchedList = document.getElementById('fetchedList_1');
	if(fetchedList) 
		cardListOut.removeChild(fetchedList);

	let getList = localStorage.getItem('cardList');
	let getIndex = null;
	if(getList) {
		getList = JSON.parse(getList);
		if(getList.length > 0) {
			getList.map((item, index) => {
				if(item.cardNumber === cardNumber) {
					getIndex = index;
				}
			})

			if(getIndex !== null)
				getList.splice(getIndex, 1);
			
			handleFetch(getList);
		}
	}

	let arrToString = JSON.stringify(getList);
	localStorage.setItem("cardList", arrToString);

}

// field reset method
function resetFields() {
	cardNumberValue = '';
	cvvValue = '';
	expiryDateVal = '';
	cardNumberField.value = '';
	cvvField.value = '';
	cvvField.disabled = true;
	expiryDateField.disabled = true;
	submitButton.disabled = true;
	if(imgOuter.classList.contains('style__imgOuterClass')) {
		imgOuter.classList.remove('style__imgOuterClass');
		card_number_01.classList.remove('style__fieldOuterClass');
	}
}

// method to configure elements
function configureElements(list, index, fetchedList) {
	let cardFirstFour = list.cardNumber.split(" ");
	// create element
	let rowDiv = document.createElement('div');
	let cardNumberDiv = document.createElement('div');
	let cvvDiv = document.createElement('div');
	let expiryDateDiv = document.createElement('div');
	let buttonOuterDiv = document.createElement('div');
	let removeButton = document.createElement('button');
	let iconOuterDiv = document.createElement('div');
	let cardIconDiv = document.createElement('img');
	// card type detect
	let getCardType = checkCards(list.cardNumber);
	let configureElements = true;
	let getCardIcon = setCardIcon(getCardType, configureElements);
	// card icon set
	cardIconDiv.src = getCardIcon;
	iconOuterDiv.classList.add('style__iconOuterDiv');
	cardIconDiv.classList.add('style_listIconClass');
	// add class List
	rowDiv.classList.add('style__rowStyle');
	cardNumberDiv.classList.add('style___colStyle', 'style_numberWidth');
	cvvDiv.classList.add('style___colStyle', 'style_fetchedCvvWidth');
	expiryDateDiv.classList.add('style___colStyle');
	buttonOuterDiv.classList.add('style__buttonOuter');
	removeButton.classList.add('style__removeButton');
	// append data
	cardNumberDiv.innerHTML = list.cardNumber;
	cvvDiv.innerHTML = list.cvv;
	expiryDateDiv.innerHTML = list.expiryDate;
	removeButton.innerHTML = "Remove";
	removeButton.id = "id_index_" + cardFirstFour[0];
	removeButton.addEventListener('click', function() {
		handleRemoveCard(list.cardNumber);
	});	
	// wrapping up childs with the parent element
	iconOuterDiv.appendChild(cardIconDiv);
	buttonOuterDiv.appendChild(removeButton);
	rowDiv.appendChild(iconOuterDiv);			
	rowDiv.appendChild(cardNumberDiv);
	rowDiv.appendChild(cvvDiv);
	rowDiv.appendChild(expiryDateDiv);
	rowDiv.appendChild(buttonOuterDiv);
	fetchedList.appendChild(rowDiv);
	cardListOut.appendChild(fetchedList);
}

