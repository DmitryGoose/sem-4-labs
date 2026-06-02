const express = require('express');
const path = require('path');
const cors = require('cors');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = 3000;

// Путь к файлу данных (остаётся внутри src/data)
const DATA_PATH = path.join(__dirname, 'data', 'stocks.json');
stocksService.init(DATA_PATH);

// --- Middleware ---
app.use(cors());                        // разрешаем кросс-доменные запросы
app.use(express.json());                // парсинг JSON-тел запросов

// Логирование каждого запроса
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- Раздача статических файлов фронтенда (public) ---
// Папка public лежит на одном уровне с src, поэтому поднимаемся на уровень выше
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- API routes ---
app.use('/stocks', stocksRouter);

// --- Обработка 404 для несуществующих API-маршрутов /stocks/... ---
app.use('/stocks', (req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// --- Все остальные GET-запросы (не /stocks) отдаём index.html (SPA) ---
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// --- Глобальный обработчик ошибок ---
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// --- Запуск сервера ---
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
