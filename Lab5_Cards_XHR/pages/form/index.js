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
                // В ЛР5 сохранения нет, только выводим в консоль
                console.log('Данные для сохранения (только демонстрация):', data);
                alert('Сохранение не реализовано в этой лабораторной работе.');
            },
            () => {
                const mainPage = new MainPage(this.parent);
                mainPage.render();
            }
        );
    }
}
