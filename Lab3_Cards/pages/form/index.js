// pages/form/index.js
import { StockFormComponent } from '../../components/stock-form/index.js';
import { MainPage } from '../main/index.js';

export class FormPage {
    constructor(parent, stockData = null) {
        this.parent = parent;
        this.stockData = stockData;  // null – создание, объект – редактирование
    }

    render() {
        const form = new StockFormComponent(this.parent, this.stockData);
        form.render(
            (data) => { // onSave
                const url = this.stockData
                    ? `http://localhost:3000/stocks/${this.stockData.id}`  // PATCH
                    : 'http://localhost:3000/stocks';                     // POST
                const method = this.stockData ? 'PATCH' : 'POST';

                fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    if (!response.ok) throw new Error('Ошибка сохранения');
                    return response.json();
                })
                .then(() => {
                    // Успешно – возвращаемся на главную
                    const mainPage = new MainPage(this.parent);
                    mainPage.render();
                })
                .catch(err => {
                    console.error(err);
                    alert('Не удалось сохранить');
                });
            },
            () => { // onBack
                const mainPage = new MainPage(this.parent);
                mainPage.render();
            }
        );
    }
}
