// ============================================================================
// Application State
// ============================================================================

const state = {
    currentView: 'dashboard',
    currentSubject: null,
    currentQuestionIndex: 0,
    questions: [],
    isReviewMode: false,
    isMemorizeMode: false, // Track memorize mode state
    isRandomMode: false, // Track random mode state
    sessionAnswers: {}, // Track answers in current session
    questionsCache: {}, // Cache loaded questions
    navigationPanelOpen: true, // Navigation panel state
    questionStatuses: {}, // Track status for each question: unanswered, correct, incorrect, viewed
    type3Revealed: {} // Track reveal state for type 3 questions: { questionId: boolean }
};

// ============================================================================
// Configuration
// ============================================================================

const SUBJECTS = [
    { name: '马克思主义基本原理', file: '马克思主义基本原理.json' },
    { name: '中国近代史纲要', file: '中国近代史纲要.json' },
    { name: '习近平新时代', file: '习近平新时代.json' },
    { name: '中国近代史纲要_2', file: '中国近代史纲要_2.json' }
];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Fisher-Yates shuffle algorithm - randomly shuffles an array
 * @param {Array} array - The array to shuffle
 * @returns {Array} A new shuffled array (does not modify the original)
 *
 * Algorithm explanation:
 * - Iterate from the last element to the first
 * - For each position i, pick a random index j from 0 to i
 * - Swap elements at positions i and j
 * - This ensures uniform random distribution
 */
function shuffle(array) {
    const result = [...array]; // Create a copy to avoid modifying the original
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// ============================================================================
// Local Storage Functions
// ============================================================================

const Storage = {
    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error writing to localStorage:', e);
        }
    },

    clear() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Error clearing localStorage:', e);
        }
    }
};

// ============================================================================
// Session Storage Functions (for navigation panel state)
// ============================================================================

const SessionState = {
    getNavigationPanelOpen() {
        try {
            const value = sessionStorage.getItem('navigationPanelOpen');
            return value !== null ? JSON.parse(value) : true; // Default to open
        } catch (e) {
            console.error('Error reading from sessionStorage:', e);
            return true;
        }
    },

    setNavigationPanelOpen(isOpen) {
        try {
            sessionStorage.setItem('navigationPanelOpen', JSON.stringify(isOpen));
        } catch (e) {
            console.error('Error writing to sessionStorage:', e);
        }
    }
};

// ============================================================================
// Question Status Management
// ============================================================================

// Helper function to detect type 3 (short-answer) questions
function isType3Question(question) {
    return question.type === 3;
}

function isWrongQuestion(questionId) {
    const wrongIds = WrongAnswers.get(state.currentSubject);
    return wrongIds.includes(questionId);
}

function initializeQuestionStatuses() {
    // Initialize statuses for all questions based on persistent storage and session answers
    state.questionStatuses = {};
    state.questions.forEach((question, index) => {
        const questionId = question.questionId;

        // Try persistent storage first
        const persistedData = AnsweredQuestions.get(state.currentSubject, questionId);
        if (persistedData) {
            state.questionStatuses[index] = persistedData.status;
            // For type 3 questions, also update reveal state
            if (isType3Question(question) && persistedData.status === 'viewed') {
                state.type3Revealed[questionId] = true;
            }
            return;
        }

        // Fall back to session memory
        const sessionAnswer = state.sessionAnswers[questionId];
        if (sessionAnswer) {
            state.questionStatuses[index] = sessionAnswer.isCorrect ? 'correct' : 'incorrect';
            return;
        }

        // Default: unanswered
        state.questionStatuses[index] = 'unanswered';
    });
}

// ============================================================================
// Answered Questions Management
// ============================================================================

const AnsweredQuestions = {
    get(subject, questionId) {
        const answeredQuestions = Storage.get('answeredQuestions', {});
        const value = answeredQuestions[subject]?.[questionId];
        if (value === undefined || value === null) {
            return null;
        }
        // Handle legacy format (plain string status)
        if (typeof value === 'string') {
            return { status: value, selected: null };
        }
        // New format: { status, selected }
        return value;
    },

    set(subject, questionId, status, selected = null) {
        const answeredQuestions = Storage.get('answeredQuestions', {});
        if (!answeredQuestions[subject]) {
            answeredQuestions[subject] = {};
        }
        // Store as object with both status and selected answers
        answeredQuestions[subject][questionId] = { status, selected };
        Storage.set('answeredQuestions', answeredQuestions);
    },

    getAll(subject) {
        const answeredQuestions = Storage.get('answeredQuestions', {});
        const data = answeredQuestions[subject] || {};
        // Normalize all values to new format
        const normalized = {};
        for (const [questionId, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                normalized[questionId] = { status: value, selected: null };
            } else {
                normalized[questionId] = value;
            }
        }
        return normalized;
    },

    clear(subject) {
        const answeredQuestions = Storage.get('answeredQuestions', {});
        if (subject) {
            delete answeredQuestions[subject];
        } else {
            // Clear all subjects
            Object.keys(answeredQuestions).forEach(key => {
                delete answeredQuestions[key];
            });
        }
        Storage.set('answeredQuestions', answeredQuestions);
    }
};

// Helper function to restore session answers from persistent storage
function restoreSessionAnswersFromStorage(subject) {
    const answeredData = AnsweredQuestions.getAll(subject);
    for (const [questionId, data] of Object.entries(answeredData)) {
        // Only restore if we have selected answers (new format)
        if (data.selected !== null) {
            const isCorrect = data.status === 'correct';
            state.sessionAnswers[questionId] = {
                selected: data.selected,
                isCorrect: isCorrect
            };
        }
    }
}

// ============================================================================
// Wrong Answers Management
// ============================================================================

const WrongAnswers = {
    get(subject) {
        const wrongAnswers = Storage.get('wrongAnswers', {});
        return wrongAnswers[subject] || [];
    },

    add(subject, questionId) {
        const wrongAnswers = Storage.get('wrongAnswers', {});
        if (!wrongAnswers[subject]) {
            wrongAnswers[subject] = [];
        }
        if (!wrongAnswers[subject].includes(questionId)) {
            wrongAnswers[subject].push(questionId);
        }
        Storage.set('wrongAnswers', wrongAnswers);
    },

    remove(subject, questionId) {
        const wrongAnswers = Storage.get('wrongAnswers', {});
        if (wrongAnswers[subject]) {
            wrongAnswers[subject] = wrongAnswers[subject].filter(id => id !== questionId);
        }
        Storage.set('wrongAnswers', wrongAnswers);
    },

    getAll() {
        return Storage.get('wrongAnswers', {});
    },

    getTotalCount() {
        const wrongAnswers = this.getAll();
        return Object.values(wrongAnswers).reduce((sum, arr) => sum + arr.length, 0);
    }
};

// ============================================================================
// Statistics Management
// ============================================================================

const Stats = {
    get(subject) {
        const stats = Storage.get('stats', {});
        return stats[subject] || { total: 0, completed: 0, correct: 0, wrong: 0 };
    },

    update(subject, isCorrect) {
        const stats = Storage.get('stats', {});
        if (!stats[subject]) {
            stats[subject] = { total: 0, completed: 0, correct: 0, wrong: 0 };
        }
        stats[subject].completed++;
        if (isCorrect) {
            stats[subject].correct++;
        } else {
            stats[subject].wrong++;
        }
        Storage.set('stats', stats);
    },

    setTotal(subject, total) {
        const stats = Storage.get('stats', {});
        if (!stats[subject]) {
            stats[subject] = { total: 0, completed: 0, correct: 0, wrong: 0 };
        }
        stats[subject].total = total;
        Storage.set('stats', stats);
    },

    getAll() {
        return Storage.get('stats', {});
    },

    getOverallStats() {
        const allStats = this.getAll();
        const totals = { completed: 0, correct: 0, wrong: 0 };
        Object.values(allStats).forEach(stat => {
            totals.completed += stat.completed;
            totals.correct += stat.correct;
            totals.wrong += stat.wrong;
        });
        return totals;
    }
};

// ============================================================================
// Data Import/Export
// ============================================================================

const DataManager = {
    export() {
        const data = {
            version: 2,  // Version 2 includes selected answers
            wrongAnswers: WrongAnswers.getAll(),
            stats: Stats.getAll(),
            answeredQuestions: Storage.get('answeredQuestions', {}),
            exportDate: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `刷题数据_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    import(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.wrongAnswers) {
                    Storage.set('wrongAnswers', data.wrongAnswers);
                }
                if (data.stats) {
                    Storage.set('stats', data.stats);
                }
                if (data.answeredQuestions) {
                    Storage.set('answeredQuestions', data.answeredQuestions);
                }
                alert('数据导入成功！');
                showDashboard();
            } catch (error) {
                alert('导入失败：文件格式错误');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    },

    clear() {
        if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
            Storage.clear();
            alert('数据已清除');
            showDashboard();
        }
    }
};

// ============================================================================
// Question Loader
// ============================================================================

const QuestionLoader = {
    async load(subject) {
        // Check cache first
        if (state.questionsCache[subject]) {
            return state.questionsCache[subject];
        }

        const subjectConfig = SUBJECTS.find(s => s.name === subject);
        if (!subjectConfig) {
            throw new Error(`Subject not found: ${subject}`);
        }

        showLoading(true);

        try {
            const response = await fetch(subjectConfig.file);
            if (!response.ok) {
                throw new Error(`Failed to load ${subjectConfig.file}`);
            }
            const data = await response.json();
            const questions = this.parseQuestions(data);

            // Cache the questions
            state.questionsCache[subject] = questions;

            // Update total count in stats
            Stats.setTotal(subject, questions.length);

            return questions;
        } catch (error) {
            alert(`加载题目失败: ${error.message}`);
            console.error('Load error:', error);
            return [];
        } finally {
            showLoading(false);
        }
    },

    parseQuestions(data) {
        const questions = [];
        data.forEach(section => {
            if (section.questions && Array.isArray(section.questions)) {
                section.questions.forEach(q => {
                    questions.push({
                        questionId: q.questionId,
                        title: q.title,
                        type: q.type, // 0 = single-choice, 1 = multiple-choice
                        answerOptions: q.answerOptions,
                        answer: q.answer, // Array of correct answer indices (as strings)
                        score: q.score,
                        analysis: q.analysis
                    });
                });
            }
        });
        return questions;
    }
};

// ============================================================================
// View Management
// ============================================================================

function showView(viewName) {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('practice-view').style.display = 'none';

    if (viewName === 'dashboard') {
        document.getElementById('dashboard-view').style.display = 'block';
    } else if (viewName === 'practice' || viewName === 'review' || viewName === 'memorize') {
        document.getElementById('practice-view').style.display = 'block';
    }

    state.currentView = viewName;
}

// ============================================================================
// Navigation Panel
// ============================================================================

function renderNavigationPanel() {
    const grid = document.getElementById('question-grid');
    grid.innerHTML = '';

    state.questions.forEach((question, index) => {
        const box = document.createElement('div');
        box.className = 'question-box';
        box.setAttribute('tabindex', '0');
        box.setAttribute('role', 'button');
        box.setAttribute('aria-label', `跳转到题目 ${index + 1}`);

        // Determine status
        let status = state.questionStatuses[index] || 'unanswered';

        // In memorize mode, override status for wrong questions
        if (state.isMemorizeMode && isWrongQuestion(question.questionId)) {
            status = 'incorrect';
        }

        box.classList.add(status);

        // Highlight current question
        if (index === state.currentQuestionIndex) {
            box.classList.add('current');
        }

        // Display question number
        box.textContent = index + 1;

        // Click handler to jump to question
        box.addEventListener('click', () => jumpToQuestion(index));

        // Keyboard support
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                jumpToQuestion(index);
            }
        });

        grid.appendChild(box);
    });
}

function toggleNavigationPanel() {
    const panel = document.getElementById('navigation-panel');
    const icon = document.getElementById('nav-panel-icon');

    state.navigationPanelOpen = !state.navigationPanelOpen;

    if (state.navigationPanelOpen) {
        panel.classList.add('open');
        panel.style.display = 'flex';
        icon.textContent = '✕';
        // Scroll to current question
        scrollToCurrentQuestion();
    } else {
        panel.classList.remove('open');
        icon.textContent = '☰';
        // Hide after animation
        setTimeout(() => {
            if (!state.navigationPanelOpen) {
                panel.style.display = 'none';
            }
        }, 300);
    }

    // Save state to sessionStorage
    SessionState.setNavigationPanelOpen(state.navigationPanelOpen);
}

function jumpToQuestion(index) {
    if (index >= 0 && index < state.questions.length) {
        // Save viewed status before navigating away
        saveType3ViewedStatus();

        state.currentQuestionIndex = index;
        renderQuestion();
        updateNavigationPanelHighlight();
    }
}

function updateNavigationPanelHighlight() {
    const boxes = document.querySelectorAll('.question-box');
    boxes.forEach((box, index) => {
        if (index === state.currentQuestionIndex) {
            box.classList.add('current');
        } else {
            box.classList.remove('current');
        }
    });
}

function updateQuestionStatus(index, status) {
    state.questionStatuses[index] = status;

    // Update the visual indicator in navigation panel
    const boxes = document.querySelectorAll('.question-box');
    if (boxes[index]) {
        boxes[index].className = 'question-box ' + status;
        if (index === state.currentQuestionIndex) {
            boxes[index].classList.add('current');
        }
    }
}

function scrollToCurrentQuestion() {
    const boxes = document.querySelectorAll('.question-box');
    const currentBox = boxes[state.currentQuestionIndex];
    if (currentBox) {
        currentBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function showLoading(show) {
    const loadingEl = document.getElementById('loading-indicator');
    const questionEl = document.getElementById('question-container');
    if (show) {
        loadingEl.style.display = 'block';
        questionEl.style.display = 'none';
    } else {
        loadingEl.style.display = 'none';
        questionEl.style.display = 'block';
    }
}

// ============================================================================
// Dashboard
// ============================================================================

async function loadAllQuestionCounts() {
    // Load question counts for all subjects to display on dashboard
    for (const subject of SUBJECTS) {
        const stats = Stats.get(subject.name);
        // Only load if we don't have the total count yet
        if (!stats.total || stats.total === 0) {
            try {
                await QuestionLoader.load(subject.name);
            } catch (error) {
                console.error(`Failed to load ${subject.name}:`, error);
            }
        }
    }
}

async function showDashboard() {
    showView('dashboard');
    // Load question counts in background
    loadAllQuestionCounts().then(() => {
        renderSubjects(); // Re-render after counts are loaded
    });
    renderOverallStats();
    renderSubjects();
    updatePracticeModeSettings();
}

/**
 * Update the practice mode settings display on Dashboard
 */
function updatePracticeModeSettings() {
    const preferredMode = Storage.get('preferredPracticeMode', null);
    const settingsDiv = document.getElementById('practice-mode-card');
    const modeDisplay = document.getElementById('current-mode-display');

    if (preferredMode) {
        settingsDiv.style.display = 'block';
        modeDisplay.textContent = preferredMode === 'random' ? '随机练习' : '顺序练习';
    } else {
        settingsDiv.style.display = 'none';
    }
}

/**
 * Clear the saved practice mode preference
 */
function clearPracticeMode() {
    Storage.set('preferredPracticeMode', null);
    updatePracticeModeSettings();
}

function renderOverallStats() {
    const overall = Stats.getOverallStats();
    const totalWrong = WrongAnswers.getTotalCount();
    const accuracy = overall.completed > 0
        ? Math.round((overall.correct / overall.completed) * 100)
        : 0;

    document.getElementById('total-completed').textContent = overall.completed;
    document.getElementById('overall-accuracy').textContent = accuracy + '%';
    document.getElementById('total-wrong').textContent = totalWrong;
}

function renderSubjects() {
    const container = document.getElementById('subjects-container');
    container.innerHTML = '';

    SUBJECTS.forEach(subject => {
        const stats = Stats.get(subject.name);
        const wrongCount = WrongAnswers.get(subject.name).length;
        const accuracy = stats.completed > 0
            ? Math.round((stats.correct / stats.completed) * 100)
            : 0;

        // Show loading state for total if not yet loaded
        const totalDisplay = stats.total > 0 ? stats.total : '<span style="color: #95a5a6;">加载中...</span>';

        const card = document.createElement('div');
        card.className = 'subject-card';
        card.innerHTML = `
            <h3>${subject.name}</h3>
            <div class="subject-stats">
                <div><span>总题数</span><span>${totalDisplay}</span></div>
                <div><span>已完成</span><span>${stats.completed}</span></div>
                <div><span>正确</span><span>${stats.correct}</span></div>
                <div><span>错误</span><span>${stats.wrong}</span></div>
                <div><span>准确率</span><span>${accuracy}%</span></div>
                <div><span>错题数</span><span>${wrongCount}</span></div>
            </div>
            <div class="subject-actions">
                <button class="btn btn-success" onclick="startPractice('${subject.name}')">开始练习</button>
                <button class="btn btn-warning" onclick="startReview('${subject.name}')" ${wrongCount === 0 ? 'disabled' : ''}>
                    复习错题 (${wrongCount})
                </button>
                <button class="btn btn-info" onclick="startMemorize('${subject.name}')">背题模式</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// ============================================================================
// Practice Mode Selection Modal
// ============================================================================

/**
 * Show the practice mode selection modal and return the user's choice
 * @returns {Promise<string>} Resolves to 'sequential' or 'random', or null if cancelled
 */
function showModeSelectionModal() {
    return new Promise((resolve) => {
        const modal = document.getElementById('mode-selection-modal');
        const overlay = modal.querySelector('.modal-overlay');
        const startBtn = document.getElementById('modal-start-btn');
        const cancelBtn = document.getElementById('modal-cancel-btn');
        const rememberCheckbox = document.getElementById('remember-mode-choice');
        const radioButtons = modal.querySelectorAll('input[name="practice-mode"]');

        // Reset modal state
        const sequentialRadio = modal.querySelector('input[value="sequential"]');
        sequentialRadio.checked = true;
        rememberCheckbox.checked = false;

        // Show modal
        modal.style.display = 'flex';

        // Handle start button click
        const handleStart = () => {
            const selectedMode = modal.querySelector('input[name="practice-mode"]:checked').value;
            const remember = rememberCheckbox.checked;

            // Save preference if "remember" is checked
            if (remember) {
                Storage.set('preferredPracticeMode', selectedMode);
            }

            // Hide modal
            modal.style.display = 'none';

            // Clean up listeners
            cleanup();

            // Resolve with selected mode
            resolve(selectedMode);
        };

        // Handle cancel button click
        const handleCancel = () => {
            modal.style.display = 'none';
            cleanup();
            resolve(null);
        };

        // Handle ESC key
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                handleCancel();
            }
        };

        // Handle overlay click
        const handleOverlayClick = () => {
            handleCancel();
        };

        // Cleanup function
        const cleanup = () => {
            startBtn.removeEventListener('click', handleStart);
            cancelBtn.removeEventListener('click', handleCancel);
            overlay.removeEventListener('click', handleOverlayClick);
            document.removeEventListener('keydown', handleEsc);
        };

        // Attach event listeners
        startBtn.addEventListener('click', handleStart);
        cancelBtn.addEventListener('click', handleCancel);
        overlay.addEventListener('click', handleOverlayClick);
        document.addEventListener('keydown', handleEsc);
    });
}

// ============================================================================
// Practice Mode
// ============================================================================

async function startPractice(subject) {
    // Check for saved practice mode preference
    const preferredMode = Storage.get('preferredPracticeMode', null);

    // If no preference, show modal to get user choice
    let mode;
    if (preferredMode === null) {
        mode = await showModeSelectionModal();
        // If user cancelled, return to dashboard
        if (mode === null) {
            return;
        }
    } else {
        mode = preferredMode;
    }

    state.currentSubject = subject;
    state.isReviewMode = false;
    state.isMemorizeMode = false;
    state.currentQuestionIndex = 0;
    state.sessionAnswers = {};

    const questions = await QuestionLoader.load(subject);

    if (questions.length === 0) {
        alert('没有可用的题目');
        return;
    }

    // Apply shuffle if random mode is selected
    if (mode === 'random') {
        state.questions = shuffle(questions);
        state.isRandomMode = true;
    } else {
        state.questions = questions;
        state.isRandomMode = false;
    }

    // Initialize question statuses
    initializeQuestionStatuses();

    // Restore session answers from persistent storage
    restoreSessionAnswersFromStorage(subject);

    // Load panel state from sessionStorage
    state.navigationPanelOpen = SessionState.getNavigationPanelOpen();

    showView('practice');
    // Display mode icon based on random mode state
    document.getElementById('mode-icon').textContent = state.isRandomMode ? '📝 🔀' : '📝';
    document.getElementById('no-questions-message').style.display = 'none';

    // Render navigation panel
    renderNavigationPanel();

    // Show/hide panel based on saved state
    const panel = document.getElementById('navigation-panel');
    const icon = document.getElementById('nav-panel-icon');
    if (state.navigationPanelOpen) {
        panel.style.display = 'flex';
        panel.classList.add('open');
        icon.textContent = '✕';
    } else {
        panel.style.display = 'none';
        panel.classList.remove('open');
        icon.textContent = '☰';
    }

    renderQuestion();
}

async function startReview(subject) {
    state.currentSubject = subject;
    state.isReviewMode = true;
    state.isMemorizeMode = false;
    state.currentQuestionIndex = 0;
    state.sessionAnswers = {};

    const allQuestions = await QuestionLoader.load(subject);
    const wrongIds = WrongAnswers.get(subject);

    // Filter to wrong answers only (exclude type 3 questions - they're reference material)
    state.questions = allQuestions.filter(q =>
        wrongIds.includes(q.questionId) && !isType3Question(q)
    );

    // Initialize question statuses
    initializeQuestionStatuses();

    // Restore session answers from persistent storage
    restoreSessionAnswersFromStorage(subject);

    // Load panel state from sessionStorage
    state.navigationPanelOpen = SessionState.getNavigationPanelOpen();

    showView('review');
    document.getElementById('mode-icon').textContent = '🔄';

    if (state.questions.length === 0) {
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('no-questions-message').style.display = 'block';
        // Hide navigation panel
        document.getElementById('navigation-panel').style.display = 'none';
    } else {
        document.getElementById('question-container').style.display = 'block';
        document.getElementById('no-questions-message').style.display = 'none';

        // Render navigation panel (filtered to wrong answers)
        renderNavigationPanel();

        // Show/hide panel based on saved state
        const panel = document.getElementById('navigation-panel');
        const icon = document.getElementById('nav-panel-icon');
        if (state.navigationPanelOpen) {
            panel.style.display = 'flex';
            panel.classList.add('open');
            icon.textContent = '✕';
        } else {
            panel.style.display = 'none';
            panel.classList.remove('open');
            icon.textContent = '☰';
        }

        renderQuestion();
    }
}

async function startMemorize(subject) {
    state.currentSubject = subject;
    state.isReviewMode = false;
    state.isMemorizeMode = true;
    state.currentQuestionIndex = 0;
    state.sessionAnswers = {};

    const questions = await QuestionLoader.load(subject);
    state.questions = questions;

    if (questions.length === 0) {
        alert('没有可用的题目');
        return;
    }

    // Initialize question statuses
    initializeQuestionStatuses();

    // Load panel state from sessionStorage
    state.navigationPanelOpen = SessionState.getNavigationPanelOpen();

    showView('memorize');
    document.getElementById('mode-icon').textContent = '📖';
    document.getElementById('no-questions-message').style.display = 'none';

    // Render navigation panel
    renderNavigationPanel();

    // Show/hide panel based on saved state
    const panel = document.getElementById('navigation-panel');
    const icon = document.getElementById('nav-panel-icon');
    if (state.navigationPanelOpen) {
        panel.style.display = 'flex';
        panel.classList.add('open');
        icon.textContent = '✕';
    } else {
        panel.style.display = 'none';
        panel.classList.remove('open');
        icon.textContent = '☰';
    }

    renderQuestion();
}

function renderQuestion() {
    const question = state.questions[state.currentQuestionIndex];
    if (!question) return;

    // Update counter
    let counterText;
    if (state.isMemorizeMode) {
        counterText = `背题 ${state.currentQuestionIndex + 1}/${state.questions.length}`;
    } else if (state.isReviewMode) {
        counterText = `复习 ${state.currentQuestionIndex + 1}/${state.questions.length}`;
    } else {
        counterText = `练习 ${state.currentQuestionIndex + 1}/${state.questions.length}`;
    }
    document.getElementById('question-counter').textContent = counterText;

    // Update progress bar
    const progressPct = ((state.currentQuestionIndex + 1) / state.questions.length) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) progressBar.style.width = progressPct + '%';

    // Update title (with wrong question marker in memorize mode)
    let titleText = question.title;
    if (state.isMemorizeMode && isWrongQuestion(question.questionId)) {
        titleText = '❌ ' + titleText;
    }
    document.getElementById('question-title').textContent = titleText;

    // Branch based on mode and question type
    if (state.isMemorizeMode) {
        // Memorize mode - show answers directly
        if (isType3Question(question)) {
            renderShortAnswerQuestion(question);
        } else {
            renderMemorizeChoiceQuestion(question);
        }
    } else {
        // Practice/Review mode - normal flow
        if (isType3Question(question)) {
            renderShortAnswerQuestion(question);
        } else {
            renderMultipleChoiceQuestion(question);
        }
    }

    // Update navigation panel highlight
    updateNavigationPanelHighlight();
}

function renderMultipleChoiceQuestion(question) {
    // Render options
    const optionsContainer = document.getElementById('answer-options');
    optionsContainer.innerHTML = '';

    const inputType = question.type === 0 ? 'radio' : 'checkbox';
    const inputName = question.type === 0 ? 'answer' : '';

    // Check for previously selected answers in this session
    const sessionAnswer = state.sessionAnswers[question.questionId];
    const previouslySelected = sessionAnswer ? sessionAnswer.selected : [];

    question.answerOptions.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        const isChecked = previouslySelected.includes(String(index));
        optionDiv.innerHTML = `
            <input type="${inputType}"
                   ${inputName ? `name="${inputName}"` : ''}
                   id="option-${index}"
                   value="${index}"
                   ${isChecked ? 'checked' : ''}>
            <label class="option-label" for="option-${index}">
                ${String.fromCharCode(65 + index)}. ${option.content}
            </label>
        `;

        // Add click handler for the entire option div
        optionDiv.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                const input = optionDiv.querySelector('input');
                if (question.type === 0) {
                    // Radio button - select this one
                    input.checked = true;
                } else {
                    // Checkbox - toggle
                    input.checked = !input.checked;
                }
                updateOptionStyles();
            }
        });

        optionsContainer.appendChild(optionDiv);
    });

    // Hide feedback
    document.getElementById('feedback').style.display = 'none';

    // Show submit button, reset button states
    document.getElementById('submit-btn').style.display = 'inline-block';
    document.getElementById('submit-btn').disabled = false;
    document.getElementById('prev-btn').disabled = state.currentQuestionIndex === 0;
    document.getElementById('next-btn').disabled = false;

    updateOptionStyles();
}

function renderMemorizeChoiceQuestion(question) {
    // Render options with correct answer highlighted
    const optionsContainer = document.getElementById('answer-options');
    optionsContainer.innerHTML = '';

    const inputType = question.type === 0 ? 'radio' : 'checkbox';
    const inputName = question.type === 0 ? 'answer' : '';
    const correctAnswers = question.answer.map(a => String(a));

    question.answerOptions.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        const isCorrect = correctAnswers.includes(String(index));
        optionDiv.className = 'option' + (isCorrect ? ' correct' : '');

        optionDiv.innerHTML = `
            <input type="${inputType}"
                   ${inputName ? `name="${inputName}"` : ''}
                   id="option-${index}"
                   value="${index}"
                   ${isCorrect ? 'checked' : ''}
                   disabled>
            <label class="option-label" for="option-${index}">
                ${String.fromCharCode(65 + index)}. ${option.content}
            </label>
        `;

        optionsContainer.appendChild(optionDiv);
    });

    // Show analysis if exists (without the "correct answer" feedback message)
    const feedbackEl = document.getElementById('feedback');
    const messageEl = document.getElementById('feedback-message');

    if (question.analysis && question.analysis.trim()) {
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'feedback correct';
        messageEl.style.display = 'none'; // Hide the feedback message
        renderAnalysis(question);
    } else {
        // No analysis, hide feedback area completely
        feedbackEl.style.display = 'none';
        messageEl.style.display = 'none';
    }

    // Hide submit button (not needed in memorize mode)
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('prev-btn').disabled = state.currentQuestionIndex === 0;
    document.getElementById('next-btn').disabled = false;
}

function renderShortAnswerQuestion(question) {
    const optionsContainer = document.getElementById('answer-options');
    optionsContainer.innerHTML = '';

    const questionId = question.questionId;
    const isRevealed = state.type3Revealed[questionId];

    // In memorize mode, always show answer directly
    if (state.isMemorizeMode || isRevealed) {
        // Show answer text
        const answerContainer = document.createElement('div');
        answerContainer.className = 'short-answer-content';

        const answerLabel = document.createElement('div');
        answerLabel.className = 'answer-label';
        answerLabel.textContent = '📖 答案：';

        const answerText = document.createElement('div');
        answerText.className = 'answer-text';
        answerText.textContent = question.answer[0] || '';

        answerContainer.appendChild(answerLabel);
        answerContainer.appendChild(answerText);
        optionsContainer.appendChild(answerContainer);

        // In memorize mode, also show analysis (without feedback message)
        if (state.isMemorizeMode) {
            const feedbackEl = document.getElementById('feedback');
            const messageEl = document.getElementById('feedback-message');

            if (question.analysis && question.analysis.trim()) {
                feedbackEl.style.display = 'block';
                feedbackEl.className = 'feedback correct';
                messageEl.style.display = 'none'; // Hide the feedback message
                renderAnalysis(question);
            } else {
                // No analysis, hide feedback area completely
                feedbackEl.style.display = 'none';
                messageEl.style.display = 'none';
            }
        }
    } else {
        // Show reveal button (practice/review mode only)
        const revealContainer = document.createElement('div');
        revealContainer.className = 'short-answer-reveal';

        const revealBtn = document.createElement('button');
        revealBtn.className = 'reveal-btn';
        revealBtn.textContent = '💡 显示答案';
        revealBtn.addEventListener('click', () => revealAnswer(questionId));

        revealContainer.appendChild(revealBtn);
        optionsContainer.appendChild(revealContainer);
    }

    // Hide feedback and submit button for type 3 (unless memorize mode already showed it)
    if (!state.isMemorizeMode) {
        document.getElementById('feedback').style.display = 'none';
    }
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('prev-btn').disabled = state.currentQuestionIndex === 0;
    document.getElementById('next-btn').disabled = false;
}

function updateOptionStyles() {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        const input = option.querySelector('input');
        if (input.checked) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

function revealAnswer(questionId) {
    // Mark as revealed in session state
    state.type3Revealed[questionId] = true;

    // Update question status to "revealed"
    updateQuestionStatus(state.currentQuestionIndex, 'revealed');

    // Re-render to show answer
    renderQuestion();
}

function saveType3ViewedStatus() {
    // Don't save viewed status in memorize mode
    if (state.isMemorizeMode) {
        return;
    }

    // Save viewed status for current type 3 question if revealed
    const question = state.questions[state.currentQuestionIndex];
    if (question && isType3Question(question) && state.type3Revealed[question.questionId]) {
        AnsweredQuestions.set(state.currentSubject, question.questionId, 'viewed');
        updateQuestionStatus(state.currentQuestionIndex, 'viewed');
    }
}

function getSelectedAnswers() {
    const question = state.questions[state.currentQuestionIndex];
    const selected = [];

    question.answerOptions.forEach((_, index) => {
        const input = document.getElementById(`option-${index}`);
        if (input && input.checked) {
            selected.push(String(index));
        }
    });

    return selected;
}

function submitAnswer() {
    const question = state.questions[state.currentQuestionIndex];

    // Skip type 3 questions (they don't have answers to submit)
    if (isType3Question(question)) {
        return;
    }

    const selected = getSelectedAnswers();

    if (selected.length === 0) {
        alert('请选择答案');
        return;
    }

    // Check if answer is correct
    const correctAnswers = question.answer.map(a => String(a));
    const isCorrect =
        selected.length === correctAnswers.length &&
        selected.every(a => correctAnswers.includes(a));

    // Update session tracking
    state.sessionAnswers[question.questionId] = { selected, isCorrect };

    // Update persistent answered questions tracking
    AnsweredQuestions.set(state.currentSubject, question.questionId, isCorrect ? 'correct' : 'incorrect', selected);

    // Update stats
    Stats.update(state.currentSubject, isCorrect);

    // Update wrong answers list
    if (isCorrect) {
        WrongAnswers.remove(state.currentSubject, question.questionId);
    } else {
        WrongAnswers.add(state.currentSubject, question.questionId);
    }

    // Show feedback
    showFeedback(isCorrect, correctAnswers);

    // Update question status in navigation panel
    updateQuestionStatus(state.currentQuestionIndex, isCorrect ? 'correct' : 'incorrect');

    // Disable submit button
    document.getElementById('submit-btn').disabled = true;
}

function showFeedback(isCorrect, correctAnswers) {
    const feedbackEl = document.getElementById('feedback');
    const messageEl = document.getElementById('feedback-message');

    feedbackEl.style.display = 'block';
    feedbackEl.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
    messageEl.style.display = 'block'; // Ensure message is visible
    messageEl.textContent = isCorrect ? '正确!' : '错误!'; // Icon added by CSS ::before

    // Highlight correct and incorrect options
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        const input = option.querySelector('input');
        option.classList.add('disabled');
        input.disabled = true;

        if (correctAnswers.includes(String(index))) {
            option.classList.add('correct');
        } else if (input.checked) {
            option.classList.add('incorrect');
        }
    });

    // Show analysis if available
    const question = state.questions[state.currentQuestionIndex];
    renderAnalysis(question);
}

function renderAnalysis(question) {
    const analysisEl = document.getElementById('analysis-content');

    if (question.analysis && question.analysis.trim()) {
        analysisEl.innerHTML = `
            <div class="analysis-label">📖 解析：</div>
            <div class="analysis-text">${question.analysis}</div>
        `;
        analysisEl.style.display = 'block';
    } else {
        analysisEl.innerHTML = '';
        analysisEl.style.display = 'none';
    }
}

function nextQuestion() {
    // Save viewed status before navigating away
    saveType3ViewedStatus();

    if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex++;
        renderQuestion();
    } else {
        // End of questions
        if (confirm('已完成所有题目！返回首页？')) {
            showDashboard();
        }
    }
}

function prevQuestion() {
    // Save viewed status before navigating away
    saveType3ViewedStatus();

    if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        renderQuestion();
    }
}

function exitPractice() {
    if (confirm('确定要退出吗？')) {
        showDashboard();
    }
}

// ============================================================================
// Keyboard Shortcuts
// ============================================================================

document.addEventListener('keydown', (e) => {
    // Support practice, review, and memorize modes
    if (state.currentView !== 'practice' && state.currentView !== 'review' && state.currentView !== 'memorize') {
        return;
    }

    const key = e.key.toLowerCase();

    // A, B, C, D for selecting options (only in practice/review mode, not memorize mode)
    if (['a', 'b', 'c', 'd'].includes(key) && !state.isMemorizeMode) {
        const index = key.charCodeAt(0) - 97; // a=0, b=1, c=2, d=3
        const input = document.getElementById(`option-${index}`);
        if (input && !input.disabled) {
            const question = state.questions[state.currentQuestionIndex];
            if (question.type === 0) {
                // Radio button
                input.checked = true;
            } else {
                // Checkbox
                input.checked = !input.checked;
            }
            updateOptionStyles();
        }
        e.preventDefault();
    }

    // Enter to submit or reveal (not in memorize mode)
    if (key === 'enter' && !state.isMemorizeMode) {
        const question = state.questions[state.currentQuestionIndex];
        if (isType3Question(question) && !state.type3Revealed[question.questionId]) {
            // Reveal type 3 answer
            revealAnswer(question.questionId);
        } else {
            // Submit multiple choice answer
            const submitBtn = document.getElementById('submit-btn');
            if (!submitBtn.disabled && submitBtn.style.display !== 'none') {
                submitAnswer();
            }
        }
        e.preventDefault();
    }

    // Space to reveal type 3 answers (not in memorize mode)
    if (key === ' ' && !state.isMemorizeMode) {
        const question = state.questions[state.currentQuestionIndex];
        if (isType3Question(question) && !state.type3Revealed[question.questionId]) {
            revealAnswer(question.questionId);
            e.preventDefault();
        }
    }

    // N for next
    if (key === 'n') {
        nextQuestion();
        e.preventDefault();
    }

    // P for previous
    if (key === 'p') {
        prevQuestion();
        e.preventDefault();
    }

    // Escape to exit
    if (key === 'escape') {
        exitPractice();
        e.preventDefault();
    }

    // V for toggling navigation panel
    if (key === 'v') {
        toggleNavigationPanel();
        e.preventDefault();
    }
});

// ============================================================================
// Event Listeners
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Dashboard buttons
    document.getElementById('export-btn').addEventListener('click', DataManager.export);
    document.getElementById('import-btn').addEventListener('click', () => {
        document.getElementById('import-file-input').click();
    });
    document.getElementById('import-file-input').addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            DataManager.import(e.target.files[0]);
        }
    });
    document.getElementById('clear-btn').addEventListener('click', DataManager.clear);
    document.getElementById('clear-mode-btn').addEventListener('click', clearPracticeMode);

    // Practice view buttons
    document.getElementById('exit-practice-btn').addEventListener('click', exitPractice);
    document.getElementById('submit-btn').addEventListener('click', submitAnswer);
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('prev-btn').addEventListener('click', prevQuestion);
    document.getElementById('back-to-dashboard-btn').addEventListener('click', showDashboard);

    // Navigation panel toggle button
    document.getElementById('nav-panel-toggle').addEventListener('click', toggleNavigationPanel);

    // Initialize
    showDashboard();
});
