export class StockFormComponent {
    constructor(parent, data = null) {
        this.parent = parent;
        this.data = data;
    }

    getHTML() {
        const title = this.data ? this.data.title : '';
        const src = this.data ? this.data.src : '';
        const text = this.data ? this.data.text : '';

        return `
            <div class="container py-4">
                <h2>${this.data ? 'Редактировать' : 'Добавить'} финансовый продукт</h2>
                <form id="stock-form" class="mt-3">
                    <div class="mb-3">
                        <label for="stock-title" class="form-label">Название</label>
                        <input type="text" class="form-control" id="stock-title" value="${title}" required>
                    </div>
                    <div class="mb-3">
                        <label for="stock-src" class="form-label">URL картинки</label>
                        <input type="url" class="form-control" id="stock-src" value="${src}" required>
                    </div>
                    <div class="mb-3">
                        <label for="stock-text" class="form-label">Описание</label>
                        <textarea class="form-control" id="stock-text" rows="3" required>${text}</textarea>
                    </div>
                    <button type="button" id="save-button" class="btn btn-primary">Сохранить</button>
                    <button type="button" id="back-button" class="btn btn-secondary ms-2">Назад</button>
                </form>
            </div>
        `;
    }

    addListeners(onSave, onBack) {
        document.getElementById('save-button').addEventListener('click', () => {
            const stockData = {
                title: document.getElementById('stock-title').value,
                src: document.getElementById('stock-src').value,
                text: document.getElementById('stock-text').value
            };
            onSave(stockData);
        });

        document.getElementById('back-button').addEventListener('click', () => {
            onBack();
        });
    }

    render(onSave, onBack) {
        const html = this.getHTML();
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(onSave, onBack);
    }
}
