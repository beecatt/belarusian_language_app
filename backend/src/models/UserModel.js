const db = require('../config/database');

async function findUserByEmail(email) {
    const [rows] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    return rows[0];
}

async function findUserById(userId) {
    const [rows] = await db.query(
        `SELECT 
            user_id,
            full_name,
            email,
            school_class,
            registration_date,
            experience_points,
            role
         FROM users
         WHERE user_id = ?`,
        [userId]
    );

    return rows[0];
}

async function createUser(userData) {
    const {
        full_name,
        email,
        password_hash,
        school_class
    } = userData;

    const [result] = await db.query(
        `INSERT INTO users 
            (full_name, email, password_hash, school_class)
         VALUES (?, ?, ?, ?)`,
        [full_name, email, password_hash, school_class]
    );

    return result.insertId;
}

async function addExperiencePoints(userId, points) {
    await db.query(
        `UPDATE users
         SET experience_points = experience_points + ?
         WHERE user_id = ?`,
        [points, userId]
    );
}

module.exports = {
    findUserByEmail,
    findUserById,
    createUser
};