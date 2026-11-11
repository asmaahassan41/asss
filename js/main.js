/**
 * Main Interactive Application Logic
 * Teacher Asmaa Anwar - Egyptian Math Curriculum
 */

// Teacher WhatsApp Contact Number (can be customized)
const TEACHER_PHONE = "201000000000"; // رقم الواتساب الافتراضي القابل للتعديل
const TEACHER_NAME = "مس أسماء أنور";

document.addEventListener('DOMContentLoaded', () => {
  renderCurriculum('all');
  renderResources();
  renderTestimonials();
  renderHonorRoll();
  initQuiz();
  setupEventListeners();
  createBackgroundFloatingMath();
});

// Setup navigation and general events
function setupEventListeners() {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Filter stage tabs
  const tabButtons = document.querySelectorAll('.filter-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
      });
      btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');

      const stage = btn.getAttribute('data-stage');
      renderCurriculum(stage);
    });
  });

  // Booking Form Submission
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }

  // Quick WhatsApp Floating Button
  const floatingWhatsapp = document.getElementById('floating-whatsapp');
  if (floatingWhatsapp) {
    floatingWhatsapp.addEventListener('click', (e) => {
      e.preventDefault();
      openWhatsAppWithMessage("مرحباً مس أسماء، أرغب في الاستفسار عن تفاصيل الدروس ومواعيد المجموعات.");
    });
  }
}

// Render Curriculum Cards based on selected Stage Filter
function renderCurriculum(filter = 'all') {
  const container = document.getElementById('curriculum-grid');
  if (!container) return;

  const filtered = filter === 'all' 
    ? CURRICULUM_DATA 
    : CURRICULUM_DATA.filter(item => item.stage === filter);

  container.innerHTML = filtered.map(item => `
    <div class="glass-card rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between border border-slate-200 hover:shadow-xl transition-all duration-300">
      <div>
        <div class="p-6 bg-gradient-to-l ${item.color} text-white relative overflow-hidden">
          <div class="absolute -left-4 -bottom-4 text-white/10 text-8xl">
            <i class="fa-solid ${item.icon}"></i>
          </div>
          <div class="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-2">
            ${item.stageName}
          </div>
          <h3 class="text-2xl font-bold mb-1">${item.grade}</h3>
          <p class="text-sm text-white/90 font-medium">${item.term}</p>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
              item.stage === 'primary' ? 'badge-gold' : item.stage === 'prep' ? 'badge-blue' : 'badge-purple'
            }">
              <i class="fa-solid fa-star text-amber-500"></i> ${item.badge}
            </span>
          </div>

          <p class="text-slate-600 text-sm mb-5 leading-relaxed">${item.description}</p>

          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">أبرز موضوعات المنهج:</h4>
          <ul class="space-y-2 mb-6">
            ${item.topics.map(t => `
              <li class="flex items-start text-xs text-slate-700">
                <i class="fa-solid fa-circle-check text-emerald-500 mt-1 ml-2 flex-shrink-0"></i>
                <span>${t}</span>
              </li>
            `).join('')}
          </ul>

          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">مزايا الكورس:</h4>
          <div class="flex flex-wrap gap-1.5 mb-4">
            ${item.features.map(f => `
              <span class="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md border border-slate-200">
                <i class="fa-solid fa-check text-blue-600 ml-1"></i>${f}
              </span>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="p-6 pt-0 border-t border-slate-100 mt-auto bg-slate-50/50 flex flex-col sm:flex-row gap-2">
        <button onclick="quickBookStage('${item.grade}')" class="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition">
          <i class="fa-solid fa-user-plus"></i>
          <span>حجز مقعد</span>
        </button>
        <button onclick="openWhatsAppWithMessage('${item.whatsappMsg}')" class="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition">
          <i class="fa-brands fa-whatsapp text-lg"></i>
          <span class="hidden sm:inline">استفسار</span>
        </button>
      </div>
    </div>
  `).join('');
}

// Render Downloadable Free Resources
function renderResources() {
  const container = document.getElementById('resources-grid');
  if (!container) return;

  container.innerHTML = DOWNLOADABLE_RESOURCES.map((res, idx) => `
    <div class="glass-card rounded-2xl p-6 border border-slate-200 flex flex-col justify-between hover:border-blue-400 transition">
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="badge-blue text-xs font-bold px-2.5 py-1 rounded-full">
            <i class="fa-solid fa-file-pdf ml-1 text-red-500"></i> ${res.format}
          </span>
          <span class="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            ${res.badge}
          </span>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-2">${res.title}</h3>
        <p class="text-xs text-blue-600 font-bold mb-3">${res.grade}</p>
        <p class="text-xs text-slate-600 mb-4 leading-relaxed">${res.description}</p>
      </div>

      <div>
        <div class="flex items-center justify-between text-xs text-slate-500 mb-4 pt-3 border-t border-slate-100">
          <span><i class="fa-regular fa-file-lines ml-1"></i> ${res.pages}</span>
          <span><i class="fa-solid fa-download ml-1 text-emerald-600"></i> ${res.downloads} تحميل</span>
        </div>
        <button onclick="downloadResourceModal(${idx})" class="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm">
          <i class="fa-solid fa-cloud-arrow-down"></i>
          <span>تحميل المذكرة مجاناً</span>
        </button>
      </div>
    </div>
  `).join('');
}

// Download action with modal notification
function downloadResourceModal(index) {
  const res = DOWNLOADABLE_RESOURCES[index];
  const modal = document.getElementById('download-modal');
  const modalTitle = document.getElementById('modal-res-title');
  const modalDesc = document.getElementById('modal-res-desc');
  
  if (modalTitle && modalDesc) {
    modalTitle.textContent = res.title;
    modalDesc.textContent = `تم إعداد هذه المذكرة بواسطة مس أسماء أنور (${res.grade} - ${res.pages}). يمكنك تحميلها فوراً أو الانضمام لقناة التليجرام لمتابعة التحديثات.`;
  }
  
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeDownloadModal() {
  const modal = document.getElementById('download-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Render Testimonials
function renderTestimonials() {
  const container = document.getElementById('testimonials-grid');
  if (!container) return;

  container.innerHTML = TESTIMONIALS.map(item => `
    <div class="glass-card rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">${item.avatar}</span>
            <div>
              <h4 class="font-bold text-slate-800 text-base">${item.name}</h4>
              <p class="text-xs text-slate-500">${item.role}</p>
            </div>
          </div>
          <span class="badge-gold text-xs px-2.5 py-1 rounded-full font-bold">
            ${item.tag}
          </span>
        </div>
        <div class="flex text-amber-400 text-xs mb-3">
          ${'<i class="fa-solid fa-star"></i>'.repeat(item.rating)}
        </div>
        <p class="text-slate-600 text-sm leading-relaxed italic">"${item.comment}"</p>
      </div>
    </div>
  `).join('');
}

// Render Honor Roll
function renderHonorRoll() {
  const container = document.getElementById('honor-roll-grid');
  if (!container) return;

  container.innerHTML = HONOR_ROLL.map(student => `
    <div class="bg-gradient-to-br from-white to-amber-50/40 rounded-2xl p-5 border border-amber-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-amber-500/20">
          <i class="fa-solid fa-trophy"></i>
        </div>
        <div>
          <h4 class="font-bold text-slate-900 text-base mb-0.5">${student.name}</h4>
          <p class="text-xs text-slate-500">${student.school}</p>
        </div>
      </div>
      <div class="text-left">
        <span class="inline-block bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-lg border border-emerald-300">
          ${student.score}
        </span>
        <p class="text-[10px] text-slate-400 mt-1">${student.year}</p>
      </div>
    </div>
  `).join('');
}

// Interactive Quiz System
let currentStage = 'prep';
let currentQuestionIndex = 0;
let userAnswers = [];
let quizActive = false;

function initQuiz() {
  const stageSelectButtons = document.querySelectorAll('.quiz-stage-btn');
  stageSelectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      stageSelectButtons.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-700');
      });
      btn.classList.remove('bg-slate-100', 'text-slate-700');
      btn.classList.add('bg-blue-600', 'text-white');

      currentStage = btn.getAttribute('data-quiz-stage');
      startQuiz();
    });
  });

  const startBtn = document.getElementById('start-quiz-btn');
  if (startBtn) {
    startBtn.addEventListener('click', startQuiz);
  }
}

function startQuiz() {
  currentQuestionIndex = 0;
  userAnswers = [];
  quizActive = true;

  document.getElementById('quiz-intro').classList.add('hidden');
  document.getElementById('quiz-result').classList.add('hidden');
  document.getElementById('quiz-active-area').classList.remove('hidden');

  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  const questions = QUIZ_QUESTIONS[currentStage] || QUIZ_QUESTIONS['prep'];
  const q = questions[currentQuestionIndex];
  const total = questions.length;

  document.getElementById('quiz-counter').textContent = `السؤال ${currentQuestionIndex + 1} من ${total}`;
  document.getElementById('quiz-progress-bar').style.width = `${((currentQuestionIndex + 1) / total) * 100}%`;
  document.getElementById('quiz-question-text').textContent = q.question;

  const optionsContainer = document.getElementById('quiz-options-container');
  optionsContainer.innerHTML = q.options.map((opt, i) => `
    <button onclick="selectQuizAnswer(${i})" class="quiz-option w-full p-4 rounded-xl text-right font-medium text-slate-800 flex items-center justify-between bg-white text-sm">
      <div class="flex items-center gap-3">
        <span class="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">${i + 1}</span>
        <span>${opt}</span>
      </div>
      <i class="fa-regular fa-circle text-slate-300 option-radio"></i>
    </button>
  `).join('');

  document.getElementById('quiz-explanation').classList.add('hidden');
  document.getElementById('next-question-btn').classList.add('hidden');
}

function selectQuizAnswer(selectedIndex) {
  const questions = QUIZ_QUESTIONS[currentStage] || QUIZ_QUESTIONS['prep'];
  const q = questions[currentQuestionIndex];
  const options = document.querySelectorAll('.quiz-option');

  // Disable all options after clicking
  options.forEach((opt, idx) => {
    opt.disabled = true;
    if (idx === q.correct) {
      opt.classList.add('correct');
      opt.querySelector('.option-radio').className = 'fa-solid fa-circle-check text-emerald-600';
    } else if (idx === selectedIndex) {
      opt.classList.add('incorrect');
      opt.querySelector('.option-radio').className = 'fa-solid fa-circle-xmark text-rose-600';
    }
  });

  const isCorrect = selectedIndex === q.correct;
  userAnswers.push({
    question: q.question,
    selected: selectedIndex,
    correct: q.correct,
    isCorrect: isCorrect
  });

  // Show explanation
  const expBox = document.getElementById('quiz-explanation');
  const expText = document.getElementById('quiz-explanation-text');
  expText.textContent = q.explanation;
  expBox.classList.remove('hidden');

  // Show next button
  const nextBtn = document.getElementById('next-question-btn');
  nextBtn.classList.remove('hidden');
  
  if (currentQuestionIndex + 1 >= questions.length) {
    nextBtn.innerHTML = `<span>عرض النتيجة النهائية</span> <i class="fa-solid fa-trophy mr-1"></i>`;
  } else {
    nextBtn.innerHTML = `<span>السؤال التالي</span> <i class="fa-solid fa-arrow-left mr-1"></i>`;
  }
}

function nextQuestion() {
  const questions = QUIZ_QUESTIONS[currentStage] || QUIZ_QUESTIONS['prep'];
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    renderCurrentQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  quizActive = false;
  document.getElementById('quiz-active-area').classList.add('hidden');
  document.getElementById('quiz-result').classList.remove('hidden');

  const questions = QUIZ_QUESTIONS[currentStage] || QUIZ_QUESTIONS['prep'];
  const total = questions.length;
  const score = userAnswers.filter(a => a.isCorrect).length;
  const percentage = Math.round((score / total) * 100);

  document.getElementById('result-score').textContent = `${score} / ${total}`;
  document.getElementById('result-percentage').textContent = `${percentage}%`;

  let title = '';
  let badgeColor = '';
  let advice = '';

  if (percentage === 100) {
    title = 'عبقري الرياضيات! ما شاء الله 🎉';
    badgeColor = 'text-emerald-600';
    advice = 'مستواك ممتاز ومؤهل للدرجة النهائية! يمكنك الانضمام لمجموعات المتفوقين مع مس أسماء للحفاظ على هذا التميز.';
    triggerConfetti();
  } else if (percentage >= 70) {
    title = 'مستوى رائع جداً! 👏';
    badgeColor = 'text-blue-600';
    advice = 'لديك أساسيات قوية ونحتاج فقط لضبط بعض التكات والمسائل التراكمية لتضمن الـ 100% بإذن الله.';
  } else {
    title = 'فرصة ممتازة للتحسين والتعويض 💪';
    badgeColor = 'text-amber-600';
    advice = 'لا تقلق! مع أسلوب مس أسماء المبسط في الشرح وحل التمارين خطوة بخطوة، ستتحول الرياضيات لأسهل مادة عندك.';
  }

  document.getElementById('result-title').textContent = title;
  document.getElementById('result-title').className = `text-2xl font-black mb-2 ${badgeColor}`;
  document.getElementById('result-advice').textContent = advice;
}

// Confetti effect celebration
function triggerConfetti() {
  // Simple CSS particle burst fallback
  const confettiBox = document.getElementById('confetti-container');
  if (!confettiBox) return;
  confettiBox.innerHTML = '';
  for (let i = 0; i < 35; i++) {
    const el = document.createElement('div');
    el.className = 'absolute rounded-full pointer-events-none animate-ping';
    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'];
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = `${Math.random() * 12 + 6}px`;
    el.style.height = el.style.width;
    el.style.top = `${Math.random() * 80}%`;
    el.style.left = `${Math.random() * 90}%`;
    el.style.opacity = '0.8';
    confettiBox.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }
}

// Quick booking button from card
function quickBookStage(gradeName) {
  const gradeSelect = document.getElementById('form-grade');
  if (gradeSelect) {
    for (let opt of gradeSelect.options) {
      if (opt.text.includes(gradeName) || gradeName.includes(opt.text)) {
        gradeSelect.value = opt.value;
        break;
      }
    }
  }
  const formElement = document.getElementById('booking-section');
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth' });
  }
}

// Handle Smart Booking Form Submission
function handleBookingSubmit(e) {
  e.preventDefault();

  const studentName = document.getElementById('student-name')?.value.trim();
  const studentPhone = document.getElementById('student-phone')?.value.trim();
  const parentPhone = document.getElementById('parent-phone')?.value.trim();
  const grade = document.getElementById('form-grade')?.value;
  const curriculumType = document.getElementById('form-curriculum')?.value;
  const attendanceType = document.getElementById('form-attendance')?.value;
  const governorate = document.getElementById('form-governorate')?.value;
  const notes = document.getElementById('form-notes')?.value.trim();

  if (!studentName || !studentPhone || !grade) {
    alert('من فضلك أكمل البيانات الأساسية (اسم الطالب، رقم الهاتف، والصف الدراسي).');
    return;
  }

  // Generate structured WhatsApp message
  let msg = `*طلب تسجيل جديد - منصة مس أسماء أنور*\n\n`;
  msg += `👤 *اسم الطالب:* ${studentName}\n`;
  msg += `📱 *هاتف الطالب:* ${studentPhone}\n`;
  if (parentPhone) msg += `📞 *هاتف ولي الأمر:* ${parentPhone}\n`;
  msg += `📚 *الصف الدراسي:* ${grade}\n`;
  msg += `📖 *نوع الدراسة:* ${curriculumType}\n`;
  msg += `🏫 *طريقة الحضور المرجوة:* ${attendanceType}\n`;
  if (governorate) msg += `📍 *المحافظة:* ${governorate}\n`;
  if (notes) msg += `💬 *ملاحظات خاصة:* ${notes}\n`;
  msg += `\n_تم الإرسال عبر الموقع الإلكتروني الرسمي_`;

  openWhatsAppWithMessage(msg);
}

// Open WhatsApp with text
function openWhatsAppWithMessage(text) {
  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${TEACHER_PHONE}?text=${encoded}`;
  window.open(url, '_blank');
}

// Background Floating Math Symbols Generator
function createBackgroundFloatingMath() {
  const symbols = ['π', '∑', '√x', '∫', 'sin θ', 'x²', '∞', '∆', 'lim', 'cos α', '≠', '≤', 'f(x)'];
  const hero = document.getElementById('hero-section');
  if (!hero) return;

  for (let i = 0; i < 14; i++) {
    const span = document.createElement('span');
    span.className = 'math-bg-symbol';
    span.textContent = symbols[i % symbols.length];
    span.style.top = `${Math.random() * 85}%`;
    span.style.left = `${Math.random() * 90}%`;
    span.style.fontSize = `${Math.random() * 28 + 18}px`;
    span.style.animationDuration = `${Math.random() * 6 + 6}s`;
    span.style.animationDelay = `${Math.random() * 3}s`;
    hero.appendChild(span);
  }
}

