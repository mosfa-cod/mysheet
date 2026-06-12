// 1. بيانات الأسئلة (يمكنك تعديلها وزيادتها كما تحب)
const quizData = [
    {
        question: "أين تقع دولة إيطاليا؟",
        options: ["خيار 1 أوروبا", "خيار 2 آسيا", "خيار 3 أفريقيا", "خيار 4 أمريكا"],
        correct: 0 // الترتيب يبدأ من 0 (خيار 1 أوروبا هو الإجابة الصحيحة)
    },
    {
        question: "ما عاصمة مصر؟",
        options: ["خيار 1 الإسكندرية", "خيار 2 القاهرة", "خيار 3 أسوان", "خيار 4 الجيزة"],
        correct: 1
    }
];

// 2. المتغيرات العامة لإدارة حالة الاختبار
let currentQuestionIndex = 0;
let score = 0;
let studentName = "";
const webAppUrl = "https://script.google.com/macros/s/AKfycbyrkAriBqy894vb_UGywxVvHlWKmIIQhbJ3dWNEZJLCF3s2J9IU9H-WWXoPP4cLH9Rg/exec"; // ضع رابط النشر (Deploy) هنا

// 3. استدعاء عناصر الواجهة
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('progress');

// 4. حدث عند الضغط على زر البداية
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

// 5. دالة تحميل السؤال الحالي
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

// 6. دالة التحقق من الإجابة المختارة
function selectOption(selectedBtn, index) {
    const currentQuestion = quizData[currentQuestionIndex];
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    
    // تعطيل الأزرار حتى لا يضغط الطالب مرتين
    allButtons.forEach(btn => btn.disabled = true);

    if (index === currentQuestion.correct) {
        selectedBtn.classList.add('correct');
        score++;
    } else {
        selectedBtn.classList.add('wrong');
        // إظهار الإجابة الصحيحة باللون الأخضر
        allButtons[currentQuestion.correct].classList.add('correct');
    }

    nextBtn.classList.remove('hidden');
}

// 7. حدث عند الضغط على زر السؤال التالي
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// 8. شاشة النهاية وإرسال البيانات إلى جوجل شيت
function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    document.getElementById('display-name').innerText = studentName;
    document.getElementById('final-score').innerText = score;
    document.getElementById('total-questions').innerText = quizData.length;

    // تجهيز البيانات للإرسال
    const payload = {
        name: studentName,
        score: `${score} / ${quizData.length}`
    };

    // إرسال البيانات باستخدام Fetch API إلى Google Apps Script
    fetch(webAppUrl, {
        method: 'POST',
        mode: 'no-cors', // لتفادي مشاكل الـ CORS أثناء الإرسال من الجيتهاب
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        document.getElementById('upload-status').innerText = "✅ تم حفظ نتيجتك بنجاح في جدول البيانات!";
        document.getElementById('upload-status').style.color = "green";
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById('upload-status').innerText = "❌ حدث خطأ أثناء إرسال النتيجة، يرجى التحقق من الاتصال.";
        document.getElementById('upload-status').style.color = "red";
    });
}
