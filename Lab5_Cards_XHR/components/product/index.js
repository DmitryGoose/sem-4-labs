export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
    // Превращаем переносы строк в <br> и добавляем стилизацию
    const description = data.text.replace(/\n/g, '<br>');
    return `
        <div class="card detail-card mx-auto" style="max-width: 600px;">
            <img src="${data.src}" class="card-img-top" alt="${data.title}" style="height: 300px; object-fit: cover;">
            <div class="card-body">
                <h3 class="card-title" style="font-family: 'Playfair Display', serif; color: #d4af37;">${data.title}</h3>
                <p class="card-text mt-3" style="line-height: 1.8;">${description}</p>
            </div>
        </div>
    `;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
