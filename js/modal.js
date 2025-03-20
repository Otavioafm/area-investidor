document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal');
    const modalClose = document.querySelector('.modal-close');
    const startupCards = document.querySelectorAll('.startup-card');

    // Função simplificada para abrir o modal
    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Previne scroll do body
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    // Função simplificada para fechar o modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restaura scroll do body
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Event listeners
    startupCards.forEach(card => {
        card.addEventListener('click', openModal);
    });

    modalClose.addEventListener('click', closeModal);
});
