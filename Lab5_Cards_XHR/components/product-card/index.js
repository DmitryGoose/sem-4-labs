import { showToast } from '../toast/index.js';

export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        const shortText = data.text ? data.text.split('\n')[0] : 'Описание отсутствует';
        return `
            <div class="card" style="width: 300px;">
                <img src="${data.src}" class="card-img-top" alt="${data.title}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${data.title}</h5>
                    <p class="card-text">${shortText}</p>
                    <button class="btn btn-outline-light w-100" id="detail-btn-${data.id}" data-id="${data.id}">
                        Подробнее
                    </button>
                </div>
            </div>
        `;
    }

    addListeners(data, onDetailClick) {
        const detailBtn = document.getElementById(`detail-btn-${data.id}`);
        detailBtn.addEventListener('click', () => {
            showToast(
                `📜 ${data.title}`,
                `Открываем описание артефакта...`,
                'info'
            );
            onDetailClick({ target: { dataset: { id: data.id } } });
        });
    }

    render(data, onDetailClick) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, onDetailClick);
    }
}
