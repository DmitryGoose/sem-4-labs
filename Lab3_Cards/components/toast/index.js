/**
 * Показывает всплывающее уведомление (Bootstrap Toast)
 * @param {string} title - Заголовок
 * @param {string} message - Текст сообщения
 * @param {string} type - Тип (info, success, danger, warning) - влияет на цвет рамки
 */
export function showToast(title, message, type = 'info') {
    // Создаём контейнер для тостов, если его ещё нет
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }

    const toastId = 'toast-' + Date.now();

    // Определяем цвет рамки в зависимости от типа
    const borderColors = {
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#0d6efd'
    };
    const borderColor = borderColors[type] || borderColors.info;

    const toastHTML = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" style="border-left-color: ${borderColor};">
            <div class="toast-header">
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 4000 });
    toast.show();

    // Удаляем из DOM после скрытия
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}
