 // 1. بيانات الأسئلة والتحديات
const quizData = [
    {
        question: "أين تقع دولة إيطاليا؟",
        options: ["خيار 1 أوروبا", "خيار 2 آسيا", "خيار 3 أفريقيا", "خيار 4 أمريكا"],
        correct: 0
    },
    {
        question: "ما عاصمة مصر؟",
        options: ["خيار 1 الإسكندرية", "خيار 2 القاهرة", "خيار 3 أسوان", "خيار 4 الجيزة"],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let studentName = "";

// ⚠️ ضع رابط تطبيق الويب (Web App URL) المستخرج من النشر الجديد لسكريبت جوجل هنا:
const webAppUrl = "https://script.google.com/macros/s/AKfycbwWavpID7mIVqaGedRpPDUITXRZlCKvKdr-Pvsl9LeW15GoOnP9EMsOUKEjiDBAzwL2/exec"; 

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('progress');

// بدء الاختبار عند الضغط على زر البداية
startBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('student-name').value.trim();
    if (nameInput === "") {
        alert("من فضلك أدخل اسمك الثلاثي أولاً!");
        return;
    }
    studentName = nameInput;
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    loadQuestion();
});

// تحميل السؤال الحالي
function loadQuestion() {
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = "";
    
    const currentQuestion = quizData[currentQuestionIndex];
    progressText.innerText = `السؤال ${currentQuestionIndex + 1} من ${quizData.length}`;
    questionText.innerText = currentQuestion.question;

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(button, index));
        optionsContainer.appendChild(button);
    });
}

// فحص الإجابة المختارة
function selectOption(selectedBtn, index) {
    const currentQuestion = quizData[currentQuestionIndex];
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.disabled = true);

    if (index === currentQuestion.correct) {
        selectedBtn.classList.add('correct');
        score++;
    } else {
        selectedBtn.classList.add('wrong');
        allButtons[currentQuestion.correct].classList.add('correct');
    }
    nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// شاشة النهاية وإرسال البيانات بالتحديث الجديد المعتمد لاسم الطالب ودرجته
function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    document.getElementById('display-name').innerText = studentName;
    document.getElementById('final-score').innerText = score;
    document.getElementById('total-questions').innerText = quizData.length;

    // صياغة حقول البيانات المحدثة المتوافقة مع السكريبت والشيت
    const payload = {
        studentName: studentName,
        studentScore: `${score} / ${quizData.length}`
    };

    fetch(webAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        document.getElementById('upload-status').innerText = "✅ تم حفظ نتيجتك بنجاح في جدول البيانات!";
        document.getElementById('upload-status').className = "status-message";
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById('upload-status').innerText = "❌ حدث خطأ أثناء إرسال النتيجة.";
        document.getElementById('upload-status').style.color = "red";
    });
}
