const progressList = document.getElementById('progress-list');
const achievementsList = document.getElementById('achievements-list');
const logoutBtn = document.getElementById('logout-btn');

async function loadProgress() {
    try {
        const progress = await apiRequest('/progress/my');

        if (!progress.length) {
            progressList.innerHTML = '<p>Прогресс отсутствует</p>';
            return;
        }

        progressList.innerHTML = progress.map(item => `
            <div class="card">
                <h3 class="card__title">${item.topic_name}</h3>

                <p class="card__text">
                    Класс: ${item.school_class}<br>
                    Выполнено заданий: ${item.completed_tasks_count}
                </p>

                <div class="badge">
                    ${item.mastery_percent}%
                </div>
            </div>
        `).join('');
    } catch (error) {
        progressList.innerHTML = `<p>${error.message}</p>`;
    }
}

async function loadAchievements() {
    try {
        const achievements = await apiRequest('/progress/achievements');

        if (!achievements.length) {
            achievementsList.innerHTML = '<p>Достижений пока нет</p>';
            return;
        }

        achievementsList.innerHTML = achievements.map(a => `
            <div class="card">
                <h3 class="card__title">${a.achievement_name}</h3>
                <p class="card__text">${a.description}</p>

                <div class="badge">
                    +${a.bonus_points} XP
                </div>
            </div>
        `).join('');
    } catch (error) {
        achievementsList.innerHTML = `<p>${error.message}</p>`;
    }
}

logoutBtn.addEventListener('click', () => {
    removeToken();
    window.location.href = './auth.html';
});

loadProgress();
loadAchievements();