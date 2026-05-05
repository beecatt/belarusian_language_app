const tasksList = document.getElementById('tasks-list');
const logoutBtn = document.getElementById('logout-btn');

const params = new URLSearchParams(window.location.search);
const topicId = params.get('topic_id');

function renderOptions(task) {
    if (!task.options_json) {
        return `
            <input 
                class="form__input" 
                id="answer-${task.task_id}" 
                type="text" 
                placeholder="Введите ответ"
            >
        `;
    }

    let options = task.options_json;

    if (typeof options === 'string') {
        options = JSON.parse(options);
    }

    return options.map(option => `
        <label style="display: block; margin-bottom: 8px;">
            <input 
                type="radio" 
                name="answer-${task.task_id}" 
                value="${option}"
            >
            ${option}
        </label>
    `).join('');
}

function getAnswer(task) {
    if (!task.options_json) {
        const input = document.getElementById(`answer-${task.task_id}`);
        return input.value.trim();
    }

    const checked = document.querySelector(`input[name="answer-${task.task_id}"]:checked`);
    return checked ? checked.value : '';
}

async function submitAnswer(taskId) {
    const taskCard = document.getElementById(`task-card-${taskId}`);
    const answer = taskCard.dataset.answerGetter;

    const currentTask = window.tasks.find(task => task.task_id === taskId);
    const userAnswer = getAnswer(currentTask);

    const messageBlock = document.getElementById(`task-message-${taskId}`);

    if (!userAnswer) {
        messageBlock.className = 'message message--error';
        messageBlock.textContent = 'Введите или выберите ответ';
        return;
    }

    try {
        const result = await apiRequest(`/tasks/${taskId}/submit`, {
            method: 'POST',
            body: JSON.stringify({
                answer: userAnswer
            })
        });

        messageBlock.className = result.is_correct
            ? 'message message--success'
            : 'message message--error';

        messageBlock.innerHTML = `
            ${result.message}<br>
            Баллы: ${result.score}<br>
            Прогресс по теме: ${result.mastery_percent}%<br>
            ${result.new_achievements && result.new_achievements.length
                ? `Новое достижение: ${result.new_achievements.join(', ')}`
                : ''
            }
        `;
    } catch (error) {
        messageBlock.className = 'message message--error';
        messageBlock.textContent = error.message;
    }
}

async function loadTasks() {
    if (!topicId) {
        tasksList.innerHTML = '<p>Тема не выбрана</p>';
        return;
    }

    try {
        const tasks = await apiRequest(`/tasks/topic/${topicId}`);
        window.tasks = tasks;

        if (!tasks.length) {
            tasksList.innerHTML = '<p>Задания не найдены</p>';
            return;
        }

        tasksList.innerHTML = tasks.map(task => `
            <div class="card" id="task-card-${task.task_id}">
                <h2 class="card__title">Задание №${task.task_id}</h2>

                <p class="card__text">${task.task_text}</p>

                <div style="margin-bottom: 14px;">
                    <span class="badge">${task.task_type}</span>
                    <span class="badge">${task.difficulty_level}</span>
                    <span class="badge">${task.points} баллов</span>
                </div>

                <div class="form__group" style="margin-bottom: 14px;">
                    <label class="form__label">Ваш ответ</label>
                    ${renderOptions(task)}
                </div>

                <button class="btn" onclick="submitAnswer(${task.task_id})">
                    Проверить
                </button>

                <div id="task-message-${task.task_id}"></div>
            </div>
        `).join('');
    } catch (error) {
        tasksList.innerHTML = `<p>${error.message}</p>`;
    }
}

logoutBtn.addEventListener('click', () => {
    removeToken();
    window.location.href = './auth.html';
});

loadTasks();