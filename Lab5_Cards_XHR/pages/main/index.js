import { ProductCardComponent } from '../../components/product-card/index.js';
import { ProductPage } from '../product/index.js';
import { FormPage } from '../form/index.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `
            <div class="container">
                <h1 class="text-center mb-4">🏺 Артефакты Кубани</h1>
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <input type="text" id="search-input" class="form-control w-25" placeholder="Название артефакта...">
                    <button id="add-button" class="btn btn-success">➕ Добавить артефакт</button>
                </div>
                <div id="main-page" class="d-flex flex-wrap gap-4 justify-content-center"></div>
            </div>
        `;
    }

    loadStocks(title = '') {
        const xhr = new XMLHttpRequest();
        let url = 'http://localhost:3000/stocks';
        if (title) {
            url += `?title=${encodeURIComponent(title)}`;
        }
        xhr.open('GET', url);
        xhr.onload = () => {
            if (xhr.status === 200) {
                const stocks = JSON.parse(xhr.responseText);
                this.renderCards(stocks);
            } else {
                console.error('Ошибка загрузки:', xhr.status);
            }
        };
        xhr.onerror = () => console.error('Сетевая ошибка');
        xhr.send();
    }

    renderCards(stocks) {
        this.pageRoot.innerHTML = '';
        stocks.forEach(item => {
            const card = new ProductCardComponent(this.pageRoot);
            card.render(item, this.clickCard.bind(this));
        });
    }

    clickCard(e) {
        const cardId = e.target.dataset.id;
        const productPage = new ProductPage(this.parent, cardId);
        productPage.render();
    }

    onAddClick() {
        const formPage = new FormPage(this.parent);
        formPage.render();
    }

    onSearchInput(e) {
        this.loadStocks(e.target.value);
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        document.getElementById('add-button').addEventListener('click', this.onAddClick.bind(this));
        document.getElementById('search-input').addEventListener('input', this.onSearchInput.bind(this));

        this.loadStocks();
    }
}
