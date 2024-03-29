function clearFieldNumber() {
	numberEl.innerText = '0';
}


function deleteSymbolFromField() {
	const textLength = numberEl.innerText.length;
	numberEl.innerText = numberEl.innerText.substr(0, textLength - 1);
	if (numberEl.innerText.length === 0) numberEl.innerText = '0';
}


function makeResult() {
	correctBrackets();
	numberEl.innerText = eval(numberEl.innerText);
}


function isNegativeNumber() {
	return numberEl.innerText[0] === '-';
}


function square() {
	makeResult();
	numberEl.innerText *= numberEl.innerText;
}


function isLastSymbolIsOperator() {
	const expressionLength = numberEl.innerText.length;
	const lastSymbolInExpression = numberEl.innerText[expressionLength - 1];
	return lastSymbolInExpression.match(/[*\-+.]/);
}


function isSymbolIsOperator(symbol) {
	return symbol.match(/[*\-+.]/);
}


function isLastSymbolIsOpenBracket() {
	const expressionLength = numberEl.innerText.length;
	const lastSymbolInExpression = numberEl.innerText[expressionLength - 1];
	return lastSymbolInExpression === '(';
}


function isLastSymbolIsCloseBracket() {
	const expressionLength = numberEl.innerText.length;
	const lastSymbolInExpression = numberEl.innerText[expressionLength - 1];
	return lastSymbolInExpression === ')';
}


function isValidCloseBracket() {
	const expression = numberEl.innerText.split('');
	const openBracketsLength = expression.filter(symbol => symbol === '(').length;
	const closeBracketsLength = expression.filter(symbol => symbol === ')').length;
	return openBracketsLength > closeBracketsLength;
}


function symbolIsValid(symbol) {
	const isOpenBracket = symbol === '(';
	const isLastOperator = isLastSymbolIsOperator();
	const isLastIsOpenBracket = isLastSymbolIsOpenBracket();
	if (isOpenBracket && !isLastOperator && !isLastIsOpenBracket) return;
	const isOperator = isSymbolIsOperator(symbol);
	if (isLastIsOpenBracket && isOperator) return;
	if (isLastOperator && isOperator) return;
	const isCloseBracket = symbol === ')';
	if (isCloseBracket && isLastOperator) return;
	const canIWriteCloseBracket = isValidCloseBracket();
	if (isCloseBracket && !canIWriteCloseBracket) return;
	const isNumberKey = symbol.match(/[0-9]/);
	const isLastSymbolCloseBracket = isLastSymbolIsCloseBracket()
	if (isNumberKey && isLastSymbolCloseBracket) return;
	if (isLastIsOpenBracket && isCloseBracket) return;
	return true;
}


function correctBrackets() {
	const expression = numberEl.innerText.split('');
	const openBracketsLength = expression.filter(symbol => symbol === '(').length;
	const closeBracketsLength = expression.filter(symbol => symbol === ')').length;
	if (openBracketsLength !== closeBracketsLength) {
		const different = openBracketsLength - closeBracketsLength;
		const brackets = ')'.repeat(different);
		numberEl.innerText += brackets;
	}
}


function togglePressedButtonClass(method, pressedKey, isValidKey, isFButtonPressed) {
	if (isFButtonPressed) return;
	let buttonEl;
	switch (pressedKey) {
		case 'Enter':
			buttonEl = buttonEls.find(buttonEl => buttonEl.innerText === '=');
			buttonEl.classList[method]('pressed');
			break;
		case 'Backspace':
			buttonEl = buttonEls.find(buttonEl => buttonEl.innerText === 'CE');
			buttonEl.classList[method]('pressed');
			break;
		case 'Escape':
			buttonEl = buttonEls.find(buttonEl => buttonEl.innerText === 'C');
			buttonEl.classList[method]('pressed');
			break;
		default:
			if (isValidKey) {
				buttonEl = buttonEls.find(buttonEl => buttonEl.innerText === isValidKey.input);
				buttonEl.classList[method]('pressed');
			}
	}
}


const buttonEls = [ ...document.querySelectorAll('.button') ];
const numberEl = document.querySelector('.number');
const buttonElsLength = buttonEls.length;


for (let i = 0; i < buttonElsLength; i++) {
	buttonEls[i].addEventListener('click', e => {
		const currentTarget = e.currentTarget;
		const text = currentTarget.innerText;
		const isNumberKey = text.match(/[0-9]/);
		const isValidSymbol = symbolIsValid(text);
		if (!isValidSymbol) return;
		switch (text) {
			case '=':
				makeResult();
				break;
			case 'C':
				clearFieldNumber();
				break;
			case 'CE':
				deleteSymbolFromField();
				break;
			case '+/-':
				const isNegative = isNegativeNumber();
				if (isNegative) {
					numberEl.innerText = numberEl.innerText.substr(1);
				} else {
					numberEl.innerText = '-' + numberEl.innerText;
				}
				break;
			case 'n2':
				square();
				return;
			default:
				if (+numberEl.innerText === 0 && isNumberKey) {
					numberEl.innerText = text;
				} else {
					numberEl.innerText += text;
				}
		}
	});
}


document.addEventListener('keydown', e => {
	const pressedKey = e.key;
	const isValidKey = pressedKey.match(/[0-9%\/*\-+\(\).]/);
	const isNumberKey = pressedKey.match(/[0-9]/);
	const isBackSpacePressed = e.key === 'Backspace';
	const isEnterPressed = e.key === 'Enter';
	const isEscPressed = e.key === 'Escape';
	const isFButtonPressed = e.key.startsWith('F');
	togglePressedButtonClass('add', pressedKey, isValidKey, isFButtonPressed);
	const isValidSymbol = symbolIsValid(pressedKey);
	if (!isValidSymbol) return;
	if (isValidKey && !isFButtonPressed) {
		if (+numberEl.innerText === 0 && isNumberKey) {
			numberEl.innerText = e.key;
		} else {
			numberEl.innerText += e.key;
		}
	}
	if (isBackSpacePressed) deleteSymbolFromField();
	if (isEscPressed) clearFieldNumber();
	if (isEnterPressed) makeResult();
});


document.addEventListener('keyup', e => {
	const pressedKey = e.key;
	const isValidKey = pressedKey.match(/[0-9%\/*\-+\(\).]/);
	const isFButtonPressed = e.key.startsWith('F');
	togglePressedButtonClass('remove', pressedKey, isValidKey, isFButtonPressed);
})