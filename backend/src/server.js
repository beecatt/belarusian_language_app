require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Belarussian Language App API is running'
    });
});

app.get('/api/users-test', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT user_id, full_name, email, role FROM users');

        res.json({
            message: 'Users loaded from database',
            users: rows
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Database query error'
        });
    }
});
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});