require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const ApiRouter = require('./routes/ApiRouter');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Belarussian Language App API is running'
    });
});

app.get('/api/db-test', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');

        res.json({
            message: 'Database connection successful',
            result: rows[0].result
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Database connection error'
        });
    }
});

app.use('/api', ApiRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});