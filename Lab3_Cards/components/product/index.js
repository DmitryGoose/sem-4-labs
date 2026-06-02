export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="card mx-auto" style="max-width: 600px;">
                <div class="card-body">
                    <h3 class="card-title mb-3">${data.title}</h3>
                    <p class="card-text">${data.description}</p>
                    <hr>
                    <ul class="list-unstyled">
                        <li><strong>Ставка:</strong> ${data.rate}</li>
                        <li><strong>Минимальная сумма:</strong> ${data.minSum}</li>
                        <li><strong>Срок:</strong> ${data.term}</li>
                    </ul>
                    <p class="mt-3 fst-italic">${data.details}</p>
                </div>
            </div>
        `;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
