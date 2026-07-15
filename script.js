let totalSeconds = 25 * 60;
let timerInterval = null;
let isRunning = false;

const timerDisplay = document.querySelector('.timer-display');
const startBtn = document.querySelector('.start-btn');
const resetBtn = document.querySelector('.reset-btn');

function updateDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  timerDisplay.textContent = `${minutes}:${formattedSeconds}`;
  document.title = `${minutes}:${formattedSeconds} - PushLimit`;
}

function startTimer() {
  // If timer is running, pause it
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = "Start";
    return;
  }

  // Otherwise, start it
  isRunning = true;
  startBtn.textContent = "Pause";

  timerInterval = setInterval(() => {
    totalSeconds--;
    updateDisplay();

    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      isRunning = false;

      const currentTab = document.querySelector('.tab.active').textContent;

      if (currentTab === 'Flow') {
        switchToTab('Short Break');
      } else {
        switchToTab('Flow');
      }

      startBtn.textContent = "Pause";
      startTimer();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;

  const activeTab = document.querySelector('.tab.active').textContent;
  totalSeconds = durations[activeTab];

  startBtn.textContent = "Start";
  updateDisplay();
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

const tabs = document.querySelectorAll('.tab');
const durations = {
  Flow: 25 * 60,
  'Short Break': 5 * 60,
  'Long Break': 15 * 60,
};

function switchToTab(tabName) {
  tabs.forEach(t => {
    t.classList.remove('active');
    if (t.textContent === tabName) {
      t.classList.add('active');
    }
  });

  totalSeconds = durations[tabName];
  updateDisplay();
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    switchToTab(tab.textContent);
    startBtn.textContent = "Start";
  });
});

const settingsBtn = document.getElementById('settingsBtn');
const taskBtn = document.getElementById('taskBtn');
const settingsOverlay = document.getElementById('settingsOverlay');
const taskOverlay = document.getElementById('taskOverlay');
const closeSettings = document.getElementById('closeSettings');
const closeTasks = document.getElementById('closeTasks');

settingsBtn.addEventListener('click', () => {
  settingsOverlay.classList.add('open');
});

closeSettings.addEventListener('click', () => {
  settingsOverlay.classList.remove('open');
});

taskBtn.addEventListener('click', () => {
  taskOverlay.classList.add('open');
});

closeTasks.addEventListener('click', () => {
  taskOverlay.classList.remove('open');
});

const focusModeBtn = document.querySelector('.cta-btn');
const timerSection = document.getElementById('timerSection');

focusModeBtn.addEventListener('click', () => {
  timerSection.scrollIntoView({ behavior: 'smooth' });
});

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#taskList li span').forEach(span => {
    tasks.push(span.textContent);
  });
  localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
}

function createTaskElement(taskText) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${taskText}</span>
    <button class="delete-task-btn">&times;</button>
  `;

  taskList.appendChild(li);

  const deleteBtn = li.querySelector('.delete-task-btn');
  deleteBtn.addEventListener('click', () => {
    li.remove();
    saveTasks();
  });
}

function loadTasks() {
  const savedTasks = localStorage.getItem('pomodoroTasks');
  if (!savedTasks) return;

  const tasks = JSON.parse(savedTasks);
  tasks.forEach(taskText => {
    createTaskElement(taskText);
  });
}

addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  createTaskElement(taskText);
  taskInput.value = '';
  saveTasks();
});

loadTasks();

const saveSettingsBtn = document.getElementById('saveSettings');
const focusInput = document.getElementById('focusInput');
const shortBreakInput = document.getElementById('shortBreakInput');
const longBreakInput = document.getElementById('longBreakInput');

saveSettingsBtn.addEventListener('click', () => {
  const focusMinutes = parseInt(focusInput.value);
  const shortBreakMinutes = parseInt(shortBreakInput.value);
  const longBreakMinutes = parseInt(longBreakInput.value);

  durations.Flow = focusMinutes * 60;
  durations['Short Break'] = shortBreakMinutes * 60;
  durations['Long Break'] = longBreakMinutes * 60;

  const activeTab = document.querySelector('.tab.active');
  clearInterval(timerInterval);
  isRunning = false;
  totalSeconds = durations[activeTab.textContent];
  updateDisplay();

  settingsOverlay.classList.remove('open');
});