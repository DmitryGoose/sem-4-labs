# Создание папок
$folders = @(
    "finance-api\src",
    "finance-api\src\routes",
    "finance-api\src\controllers",
    "finance-api\src\services",
    "finance-api\src\data"
)
foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder
}

# package.json
@"
{
  "name": "finance-api",
  "version": "1.0.0",
  "description": "",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
"@ | Out-File -FilePath "finance-api\package.json" -Encoding utf8

# src/index.js
@"
const express = require('express');
const path = require('path');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = 3000;

const DATA_PATH = path.join(__dirname, 'data', 'stocks.json');
stocksService.init(DATA_PATH);

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/stocks', stocksRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
"@ | Out-File -FilePath "finance-api\src\index.js" -Encoding utf8

# src/routes/stocks.js
@"
const express = require('express');
const router = express.Router();
const controller = require('../controllers/stocksController');

router.get('/', controller.getAllStocks);
router.get('/:id', controller.getStockById);
router.post('/', controller.createStock);
router.patch('/:id', controller.updateStock);
router.delete('/:id', controller.deleteStock);

module.exports = router;
"@ | Out-File -FilePath "finance-api\src\routes\stocks.js" -Encoding utf8

# src/controllers/stocksController.js
@"
const stocksService = require('../services/stocksService');

const getAllStocks = (req, res) => {
    const { title } = req.query;
    const stocks = stocksService.findAll(title);
    res.json(stocks);
};

const getStockById = (req, res) => {
    const id = parseInt(req.params.id);
    const stock = stocksService.findOne(id);
    if (!stock) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    res.json(stock);
};

const createStock = (req, res) => {
    const { src, title, text } = req.body;
    if (!src || !title || !text) {
        return res.status(400).json({ error: 'Поля src, title, text обязательны' });
    }
    const newStock = stocksService.create({ src, title, text });
    res.status(201).json(newStock);
};

const updateStock = (req, res) => {
    const id = parseInt(req.params.id);
    const updated = stocksService.update(id, req.body);
    if (!updated) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    res.json(updated);
};

const deleteStock = (req, res) => {
    const id = parseInt(req.params.id);
    const success = stocksService.remove(id);
    if (!success) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    res.status(204).send();
};

module.exports = {
    getAllStocks,
    getStockById,
    createStock,
    updateStock,
    deleteStock
};
"@ | Out-File -FilePath "finance-api\src\controllers\stocksController.js" -Encoding utf8

# src/services/fileService.js
@"
const fs = require('fs');

const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
        return [];
    }
};

const writeData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Ошибка записи файла:', err);
    }
};

module.exports = { readData, writeData };
"@ | Out-File -FilePath "finance-api\src\services\fileService.js" -Encoding utf8

# src/services/stocksService.js
@"
const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = (title) => {
    const stocks = fileService.readData(dataFilePath);
    if (title) {
        return stocks.filter(s => s.title.toLowerCase().includes(title.toLowerCase()));
    }
    return stocks;
};

const findOne = (id) => {
    const stocks = fileService.readData(dataFilePath);
    return stocks.find(s => s.id === id);
};

const create = (stockData) => {
    const stocks = fileService.readData(dataFilePath);
    const newId = stocks.length > 0
        ? Math.max(...stocks.map(s => s.id)) + 1
        : 1;
    const newStock = { id: newId, ...stockData };
    stocks.push(newStock);
    fileService.writeData(dataFilePath, stocks);
    return newStock;
};

const update = (id, stockData) => {
    const stocks = fileService.readData(dataFilePath);
    const index = stocks.findIndex(s => s.id === id);
    if (index === -1) return null;
    stocks[index] = { ...stocks[index], ...stockData };
    fileService.writeData(dataFilePath, stocks);
    return stocks[index];
};

const remove = (id) => {
    const stocks = fileService.readData(dataFilePath);
    const filtered = stocks.filter(s => s.id !== id);
    if (filtered.length === stocks.length) return false;
    fileService.writeData(dataFilePath, filtered);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };
"@ | Out-File -FilePath "finance-api\src\services\stocksService.js" -Encoding utf8

# src/data/stocks.json
@"
[
  {
    "id": 1,
    "src": "https://cdn-icons-png.flaticon.com/512/2830/2830284.png",
    "title": "Депозит «Стабильный»",
    "text": "Надёжный вклад с фиксированной ставкой 8% годовых"
  },
  {
    "id": 2,
    "src": "https://cdn-icons-png.flaticon.com/512/4228/4228763.png",
    "title": "Инвестиционный портфель",
    "text": "Сбалансированный портфель с доходностью 12-15%"
  },
  {
    "id": 3,
    "src": "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
    "title": "Кредитная карта «Travel»",
    "text": "Беспроцентный период до 100 дней, кэшбэк 5%"
  }
]
"@ | Out-File -FilePath "finance-api\src\data\stocks.json" -Encoding utf8

Write-Host "Структура проекта создана. Перейдите в папку finance-api и выполните:" -ForegroundColor Green
Write-Host "npm install express" -ForegroundColor Yellow
Write-Host "npm install --save-dev nodemon" -ForegroundColor Yellow
Write-Host "npm run dev" -ForegroundColor Yellow