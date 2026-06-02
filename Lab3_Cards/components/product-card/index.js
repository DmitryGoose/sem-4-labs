import { showToast } from '../toast/index.js';

export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="card" style="width: 300px;">
                <div class="card-body">
                    <h5 class="card-title">${data.title}</h5>
                    <p class="card-text">${data.description}</p>
                    <ul class="list-unstyled">
                        <li><strong>Ставка:</strong> ${data.rate}</li>
                        <li><strong>Мин. сумма:</strong> ${data.minSum}</li>
                    </ul>
                    <!-- Кнопка для показа тоста -->
                    <button class="btn btn-primary w-100 mb-2" id="toast-btn-${data.id}" data-id="${data.id}">
                        Показать предложение
                    </button>
                    <!-- Кнопка перехода на страницу деталей -->
                    <button class="btn btn-outline-light w-100" id="detail-btn-${data.id}" data-id="${data.id}">
                        Подробнее
                    </button>
                </div>
            </div>
        `;
    }

    addListeners(data, onDetailClick) {
        // Кнопка "Показать предложение" → вызов toast
        document.getElementById(`toast-btn-${data.id}`).addEventListener('click', () => {
            showToast(
                `📊 ${data.title}`,
                `Ваше персональное предложение: ставка ${data.rate}, минимальная сумма ${data.minSum}.`,
                'info'
            );
        });

        // Кнопка "Подробнее" → переход на страницу продукта
        document.getElementById(`detail-btn-${data.id}`).addEventListener('click', onDetailClick);
    }

    render(data, onDetailClick) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, onDetailClick);
    }
}
