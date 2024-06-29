const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .exit");
const continue_btn = info_box.querySelector(".buttons .continue");
const quiz_box = document.querySelector(".quiz_box");
const timeCount = quiz_box.querySelector(".timer .timer_sec");

const option_list = document.querySelector(".option_list");

start_btn.onclick = () => {
    info_box.classList.add("activeInfo");
};

exit_btn.onclick = () => {
    info_box.classList.remove("activeInfo");
};

continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    showQuestions(0);
    queCounter(1);
    startTimer(10);
};

let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let timeValue = 10;
let selectedAnswers = [];

const next_btn = quiz_box.querySelector(".next_btn");
const result_box = document.querySelector(".result_box");
const restart_quiz = result_box.querySelector(".buttons .continue");
const exit_quiz = result_box.querySelector(".buttons .exit");

restart_quiz.onclick = () => {
    quiz_box.classList.add("activeQuiz");
    result_box.classList.remove("activeResult");
    timeValue = 10;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    selectedAnswers = [];
    showQuestions(que_count);
    queCounter(que_numb);
    clearInterval(counter);
    startTimer(timeValue);
    next_btn.style.display = "none";
};

exit_quiz.onclick = () => {
    window.location.reload();
};

next_btn.onclick = () => {
    if (que_count < questions.length - 1) {
        que_count++;
        que_numb++;
        selectedAnswers = [];
        showQuestions(que_count);
        queCounter(que_numb);
        clearInterval(counter);
        startTimer(timeValue);
        next_btn.style.display = "none";
    } else {
        console.log("Questions completed");
        showResultBox();
    }
};

function showQuestions(index) {
    const que_text = document.querySelector(".que_text");
    let que_tag = '<span>' + questions[index].numb + ". " + questions[index].question + '</span>';
    que_text.innerHTML = que_tag;
    let option_tag = '<div class="option">' + questions[index].options[0] + '<span></span></div>'
        + '<div class="option">' + questions[index].options[1] + '<span></span></div>'
        + '<div class="option">' + questions[index].options[2] + '<span></span></div>';
    option_list.innerHTML = option_tag;
    const option = option_list.querySelectorAll(".option");
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

function optionSelected(answer) {
    let userAns = answer.textContent;
    if (!selectedAnswers.includes(userAns)) {
        selectedAnswers.push(userAns);
        answer.classList.add("selected");
    } else {
        selectedAnswers.splice(selectedAnswers.indexOf(userAns), 1);
        answer.classList.remove("selected");
    }

    if (selectedAnswers.length === questions[que_count].answer.length) {
        clearInterval(counter);
        checkAnswer();
    }
}

function checkAnswer() {
    let correctAns = questions[que_count].answer;
    let allOptions = option_list.children.length;
    let allCorrect = selectedAnswers.every(ans => correctAns.includes(ans)) && selectedAnswers.length === correctAns.length;

    if (allCorrect) {
        userScore += 1;
        for (let i = 0; i < allOptions; i++) {
            if (correctAns.includes(option_list.children[i].textContent)) {
                option_list.children[i].classList.add("correct");
            }
        }
        console.log("Correct");
    } else {
        for (let i = 0; i < allOptions; i++) {
            if (correctAns.includes(option_list.children[i].textContent)) {
                option_list.children[i].classList.add("correct");
            } else if (selectedAnswers.includes(option_list.children[i].textContent)) {
                option_list.children[i].classList.add("incorrect");
            }
        }
        console.log("Wrong");
    }

    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
    }

    next_btn.style.display = "block";
}

function showResultBox() {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
    const scoreText = result_box.querySelector(".score_text");
    if (userScore > 3) {
        let scoreTag = '<span>and congrats! You got <p>' + userScore + '</p> out of <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    } else if (userScore > 1) {
        let scoreTag = '<span>and nice! You got <p>' + userScore + '</p> out of <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    } else {
        let scoreTag = '<span>and sorry! You got only <p>' + userScore + '</p> out of <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }
}

function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
        if (time < 9) {
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero;
        }
        if (time < 0) {
            clearInterval(counter);
            timeCount.textContent = "00";

            checkAnswer();
        }
    }
}

function queCounter(index) {
    const bottom_ques_counter = quiz_box.querySelector(".total_que");
    let totalQuesCountTag = '<span><p>' + index + '</p> of <p>' + questions.length + '</p> Questions</span>';
    bottom_ques_counter.innerHTML = totalQuesCountTag;
}
