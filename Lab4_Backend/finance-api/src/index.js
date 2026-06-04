const express = require('express');
const path = require('path');
// const cors = require('cors');//////////////////////////////////////////////////////////////////////////////
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = 3000;

const DATA_PATH = path.join(__dirname, 'data', 'stocks.json');
stocksService.init(DATA_PATH);

// app.use(cors());//////////////////////////////////////////////////////////////////////////////
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// app.use(express.static(path.join(__dirname, '..', 'public')));////////////////////////////////////////////////////////////////

app.use('/stocks', stocksRouter);

app.use('/stocks', (req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});
////////////////////////////////////////////////////////////
// app.use((req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });
////////////////////////////////////////////////////////////
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
