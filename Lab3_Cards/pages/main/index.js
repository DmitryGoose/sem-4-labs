// pages/main/index.js
import { Money3D } from '../../components/money3d/index.js';
import { ProductCardComponent } from '../../components/product-card/index.js';
import { ProductPage } from '../product/index.js';
import { FormPage } from '../form/index.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.money3D = null;
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `
            <div class="container">
                <h1 class="text-center mb-4">🏺 Артефакты Кубани</h1>

                <!-- 3D-модель -->
                <div id="money-container" style="width: 100%; height: 400px; margin-bottom: 30px;"></div>

                <div class="d-flex justify-content-between align-items-center mb-3">
                    <input type="text" id="search-input" class="form-control w-25" placeholder="Название артефакта...">
                    <button id="add-button" class="btn btn-success">Добавить артефакт</button>
                </div>
                <div id="main-page" class="d-flex flex-wrap gap-4 justify-content-center"></div>
            </div>
        `;
    }

    loadStocks(title = '') {
        let url = 'http://localhost:3000/stocks';
        if (title) {
            url += `?title=${encodeURIComponent(title)}`;
        }
        fetch(url)
            .then(res => res.json())
            .then(stocks => this.renderCards(stocks))
            .catch(err => console.error('Ошибка загрузки:', err));
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
        this.destroy();
        const productPage = new ProductPage(this.parent, cardId);
        productPage.render();
    }

    onAddClick() {
        this.destroy();
        const formPage = new FormPage(this.parent);
        formPage.render();
    }

    onSearchInput(e) {
        this.loadStocks(e.target.value);
    }

    destroy() {
        if (this.money3D) {
            this.money3D.dispose();
            this.money3D = null;
        }
    }

    render() {
        this.destroy();
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const container = document.getElementById('money-container');
        if (container) {
            this.money3D = new Money3D(container);
        }

        document.getElementById('add-button').addEventListener('click', this.onAddClick.bind(this));
        document.getElementById('search-input').addEventListener('input', this.onSearchInput.bind(this));

        this.loadStocks();
    }
}
