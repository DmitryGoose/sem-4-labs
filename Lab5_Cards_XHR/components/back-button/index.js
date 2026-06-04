export class BackButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <button id="back-button" class="btn btn-secondary mb-3">← Назад к списку</button>
        `;
    }

    addListeners(listener) {
        document.getElementById('back-button').addEventListener('click', listener);
    }

    render(listener) {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(listener);
    }
}
