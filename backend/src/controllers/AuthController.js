const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const { generateToken } = require('../utils/jwt');

async function register(req, res) {
    try {
        const {
            full_name,
            email,
            password,
            school_class
        } = req.body;

        if (!full_name || !email || !password || !school_class) {
            return res.status(400).json({
                message: 'Заполните все обязательные поля'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Пароль должен содержать минимум 6 символов'
            });
        }

        if (school_class < 1 || school_class > 11) {
            return res.status(400).json({
                message: 'Класс должен быть от 1 до 11'
            });
        }

        const existingUser = await UserModel.findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                message: 'Пользователь с таким email уже существует'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const userId = await UserModel.createUser({
            full_name,
            email,
            password_hash: passwordHash,
            school_class
        });

        const user = await UserModel.findUserById(userId);

        const token = generateToken(user);

        res.status(201).json({
            message: 'Регистрация успешна',
            token,
            user
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при регистрации'
        });
    }
}

async function login(req, res) {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Введите email и пароль'
            });
        }

        const user = await UserModel.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: 'Неверный email или пароль'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Неверный email или пароль'
            });
        }

        const token = generateToken(user);

        res.json({
            message: 'Вход выполнен успешно',
            token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                school_class: user.school_class,
                experience_points: user.experience_points,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при входе'
        });
    }
}

async function me(req, res) {
    try {
        const user = await UserModel.findUserById(req.user.user_id);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        res.json(user);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка при получении пользователя'
        });
    }
}

module.exports = {
    register,
    login,
    me
};