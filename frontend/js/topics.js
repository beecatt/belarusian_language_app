const topicsList = document.getElementById('topics-list');
const logoutBtn = document.getElementById('logout-btn');

async function loadTopics() {
    try {
        const topics = await apiRequest('/topics');

        if (!topics.length) {
            topicsList.innerHTML = '<p>Темы не найдены</p>';
            return;
        }

        topicsList.innerHTML = topics.map(topic => `
            <div class="card">
                <h2 class="card__title">${topic.topic_name}</h2>
                <p class="card__text">${topic.description || ''}</p>

                <div style="margin-bottom: 10px;">
                    <span class="badge">${topic.school_class} класс</span>
                    <span class="badge">${topic.difficulty_level}</span>
                </div>

                <button class="btn" onclick="openTopic(${topic.topic_id})">
                    Открыть
                </button>
            </div>
        `).join('');
    } catch (error) {
        topicsList.innerHTML = `<p>${error.message}</p>`;
    }
}

function openTopic(topicId) {
    window.location.href = `./tasks.html?topic_id=${topicId}`;
}

logoutBtn.addEventListener('click', () => {
    removeToken();
    window.location.href = './auth.html';
});

loadTopics();