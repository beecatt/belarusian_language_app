const showLoginBtn = document.getElementById('show-login-btn');
const showRegisterBtn = document.getElementById('show-register-btn');

const loginBlock = document.getElementById('login-block');
const registerBlock = document.getElementById('register-block');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');

showLoginBtn.addEventListener('click', () => {
    loginBlock.classList.remove('hidden');
    registerBlock.classList.add('hidden');

    showLoginBtn.className = 'btn';
    showRegisterBtn.className = 'btn btn--secondary';
});

showRegisterBtn.addEventListener('click', () => {
    registerBlock.classList.remove('hidden');
    loginBlock.classList.add('hidden');

    showRegisterBtn.className = 'btn';
    showLoginBtn.className = 'btn btn--secondary';
});

function showMessage(element, text, type) {
    element.className = `message message--${type}`;
    element.textContent = text;
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    try {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        });

        saveToken(data.token);
        saveUser(data.user);

        showMessage(loginMessage, 'Вход выполнен успешно', 'success');

        setTimeout(() => {
            if (data.user.role === 'admin') {
                window.location.href = './admin.html';
            } else {
                window.location.href = './topics.html';
            }
        }, 600);
    } catch (error) {
        showMessage(loginMessage, error.message, 'error');
    }
});

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const full_name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const school_class = Number(document.getElementById('register-class').value);

    try {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                full_name,
                email,
                password,
                school_class
            })
        });

        saveToken(data.token);
        saveUser(data.user);

        showMessage(registerMessage, 'Регистрация выполнена успешно', 'success');

        setTimeout(() => {
            window.location.href = './topics.html';
        }, 600);
    } catch (error) {
        showMessage(registerMessage, error.message, 'error');
    }
});