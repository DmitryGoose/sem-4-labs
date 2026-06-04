import { StockFormComponent } from '../../components/stock-form/index.js';
import { MainPage } from '../main/index.js';

export class FormPage {
    constructor(parent, stockData = null) {
        this.parent = parent;
        this.stockData = stockData;
    }

    render() {
        const form = new StockFormComponent(this.parent, this.stockData);
        form.render(
            (data) => {
                const url = this.stockData
                    ? `http://localhost:3000/stocks/${this.stockData.id}`
                    : 'http://localhost:3000/stocks';
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
                    const mainPage = new MainPage(this.parent);
                    mainPage.render();
                })
                .catch(err => {
                    console.error(err);
                    alert('Не удалось сохранить');
                });
            },
            () => {
                const mainPage = new MainPage(this.parent);
                mainPage.render();
            }
        );
    }
}
