// pages/product/index.js
import { ProductComponent } from '../../components/product/index.js';
import { BackButtonComponent } from '../../components/back-button/index.js';
import { MainPage } from '../main/index.js';
import { FormPage } from '../form/index.js';

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    getHTML() {
        return `<div id="product-page" class="container py-4"></div>`;
    }

    fetchProduct() {
        fetch(`http://localhost:3000/stocks/${this.id}`)
            .then(response => {
                if (!response.ok) throw new Error('Продукт не найден');
                return response.json();
            })
            .then(product => this.renderProduct(product))
            .catch(err => {
                console.error(err);
                this.pageRoot.innerHTML = '<div class="alert alert-danger">Ошибка загрузки</div>';
            });
    }

    renderProduct(product) {
        this.pageRoot.innerHTML = '';

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(() => {
            const mainPage = new MainPage(this.parent);
            mainPage.render();
        });

        const productComp = new ProductComponent(this.pageRoot);
        productComp.render(product);

        // Кнопка "Редактировать"
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-warning ms-2';
        editBtn.textContent = '✏️ Редактировать';
        editBtn.addEventListener('click', () => {
            const formPage = new FormPage(this.parent, product);
            formPage.render();
        });
        this.pageRoot.appendChild(editBtn);
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.fetchProduct();
    }
}
