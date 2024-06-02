
var gameBoard;

async function initBoard() {
	resetBoard();
	//let categories = getAllCategories();
	const response = await fetch('https://rithm-jeopardy.herokuapp.com/api/categories?count=1000');
	const categories = await response.json();
	let categoryMap = genRandom(6, categories.length + 1);
	let questions = await getQuestions(categoryMap, categories);

	addQuestionsToBoard(questions);
}

async function getQuestions(categoryMap, categories) {
	let questions = [];

	for (let i = 0; i < categoryMap.length; i++) {
		let category = categories[categoryMap[i]];
		gameBoard[0].push(category.title);
		let questionResults = await fetch('https://rithm-jeopardy.herokuapp.com/api/category?id=' + category.id);
		let question = await questionResults.json();
		questions.push(question);
	}
	return questions;
}

function resetBoard() {
	$('#jeopardy')[0].innerHTML = "<thead></thead><tbody></tbody>";
	gameBoard = [[], [], [], [], [], []];
}


function addQuestionsToBoard(questions) {
	for (let i = 0; i < questions.length; i++) {

		for (let j = 0; j < questions[i].clues.length; j++) {
			gameBoard[j + 1][i] = (questions[i].clues[j]);
		}
	}
	constructBoardFromData(gameBoard);
}

function constructBoardFromData(board) {

	let $tr = $("<tr>");
	for (let i = 0; i < board[0].length; i++) {
		$tr.append($("<th>").text(board[0][i]));
	}
	$("#jeopardy thead").append($tr);

	for (let i = 0; i < 5; i++) {
		let $tr = $("<tr>");
		for (let i = 0; i < board[0].length; i++) {
			$tr.append($("<td onClick=changeState(this)><i class='fas fa-question-circle fa-3x'></i></i></td>"));
		}
		$("#jeopardy thead").append($tr);
	}

	$('#start')[0].innerHTML = 'Restart!';
}

function changeState(element) {
	row = $(element).closest('tr')[0].rowIndex;
	column = element.cellIndex;

	let question = gameBoard[row][column];

	if (!question.state) {
		question.state = 'question';
		element.innerHTML = question.question;
	} else if (question.state == 'question') {
		question.state = 'answer';
		element.innerHTML = question.answer;
		$(element).addClass("disabled");

	}

}

function genRandom(listSize, maxVal) {
	let result = [];

	while (result.length < listSize) {
		let num = Math.floor(Math.random() * (maxVal - 1));

		if (!result.includes(num)) {
			result.push(num);
		}
	}

	return result;
}