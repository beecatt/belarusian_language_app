const authLink = document.getElementById('auth-link');
const startLearningLink = document.getElementById('start-learning-link');

const token = getToken();
const user = getUser();

if (token && user) {
    authLink.textContent = 'Выйти';
    authLink.href = '#';

    startLearningLink.href = './topics.html';

    authLink.addEventListener('click', (event) => {
        event.preventDefault();

        removeToken();

        window.location.href = './auth.html';
    });
} else {
    authLink.textContent = 'Вход';
    authLink.href = './auth.html';

    startLearningLink.href = './auth.html';
}