let questions = [];
let answers = [];
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;

async function loadFiles() {
    const questionResponse = await fetch('questions.txt');
    const questionText = await questionResponse.text();
    questions = questionText.trim().split('\n').map(line => {
        const [question, ...options] = line.split(',');
        return { question, options };
    });

    const answerResponse = await fetch('answers.txt');
    const answerText = await answerResponse.text();
    answers = answerText.trim().split('\n').map(line => line.split(' ')[1]);

    totalQuestions = questions.length;
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        document.querySelector('.quiz-container').innerHTML = `<h2>কুইজ শেষ!</h2><h3>আপনার মোট মার্ক: ${score}/${totalQuestions}</h3>`;
        return;
    }

    const q = questions[currentQuestionIndex];
    document.getElementById('question').textContent = q.question;
    const optionButtons = document.querySelectorAll('.option');
    optionButtons.forEach((btn, index) => {
        btn.textContent = `${String.fromCharCode(65 + index)}. ${q.options[index]}`;
        btn.classList.remove('green', 'red');
        btn.disabled = false;
    });
    document.getElementById('feedback').textContent = '';
}

function checkAnswer(selected) {
    const correctAnswer = answers[currentQuestionIndex];
    const optionButtons = document.querySelectorAll('.option');
    
    optionButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent.startsWith(selected)) {
            btn.classList.add(selected === correctAnswer ? 'green' : 'red');
        }
        if (btn.textContent.startsWith(correctAnswer)) {
            btn.classList.add('green');
        }
    });

    if (selected === correctAnswer) {
        score++;
        document.getElementById('feedback').textContent = 'সঠিক উত্তর!';
    } else {
        document.getElementById('feedback').textContent = `সঠিক উত্তর: ${correctAnswer}. ${questions[currentQuestionIndex].options[correctAnswer.charCodeAt(0) - 65]}`;
    }
}

function loadNextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

loadFiles();
