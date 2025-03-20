document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal');
    const modalClose = document.querySelector('.modal-close');
    const startupCards = document.querySelectorAll('.startup-card');

    // Cria overlay dinamicamente
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);

    let isExpanded = false;
    let initialTouchY;
    let currentHeight;
    const minHeight = '50vh';
    const maxHeight = '90vh';

    function openModal() {
        modal.classList.add('show');
        overlay.classList.add('show');
        document.body.classList.add('modal-open');
        modal.style.height = minHeight; // Altura inicial
        isExpanded = false;
    }

    function closeModal() {
        modal.classList.remove('show');
        overlay.classList.remove('show');
        document.body.classList.remove('modal-open');
        modal.style.height = minHeight;
        isExpanded = false;
    }

    // Event listeners
    startupCards.forEach(card => {
        card.addEventListener('click', openModal);
    });

    modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Fecha modal com gesto de swipe para baixo
    let startY;
    modal.addEventListener('touchstart', e => {
        startY = e.touches[0].pageY;
    });

    modal.addEventListener('touchmove', e => {
        const currentY = e.touches[0].pageY;
        const diff = currentY - startY;
        
        if (diff > 50) { // Se arrastar mais que 50px para baixo
            closeModal();
        }
    });

    modal.addEventListener('touchstart', e => {
        initialTouchY = e.touches[0].clientY;
        currentHeight = modal.offsetHeight;
        modal.style.transition = 'none';
    }, { passive: true });

    modal.addEventListener('touchmove', e => {
        if (!initialTouchY) return;

        const currentTouchY = e.touches[0].clientY;
        const diff = initialTouchY - currentTouchY;
        
        // Puxando para cima
        if (diff > 0 && !isExpanded) {
            modal.style.height = `${Math.min(window.innerHeight * 0.9, currentHeight + diff)}px`;
        }
        // Puxando para baixo
        else if (diff < 0 && isExpanded) {
            modal.style.height = `${Math.max(window.innerHeight * 0.5, currentHeight - Math.abs(diff))}px`;
        }
    }, { passive: true });

    modal.addEventListener('touchend', () => {
        initialTouchY = null;
        modal.style.transition = 'height 0.3s ease';

        const currentHeightPercent = (modal.offsetHeight / window.innerHeight) * 100;

        // Define quando expandir ou recolher baseado na posição atual
        if (currentHeightPercent > 70) {
            modal.style.height = maxHeight;
            isExpanded = true;
        } else {
            modal.style.height = minHeight;
            isExpanded = false;
        }
    });

    // Adicione o event listener no indicador de arrasto
    const dragIndicator = modal.querySelector('.modal-drag-indicator');
    dragIndicator.addEventListener('touchstart', handleTouchStart);
    dragIndicator.addEventListener('touchmove', handleTouchMove);
    dragIndicator.addEventListener('touchend', handleTouchEnd);

    function handleTouchStart(e) {
        initialTouchY = e.touches[0].clientY;
        currentHeight = modal.offsetHeight;
        modal.style.transition = 'none';
    }

    function handleTouchMove(e) {
        if (!initialTouchY) return;
        
        const currentTouchY = e.touches[0].clientY;
        const diff = initialTouchY - currentTouchY;
        
        if (diff > 0) { // Puxando para cima
            modal.style.height = `${Math.min(window.innerHeight * 0.9, currentHeight + diff)}px`;
        } else if (diff < 0) { // Puxando para baixo
            modal.style.height = `${Math.max(window.innerHeight * 0.5, currentHeight - Math.abs(diff))}px`;
        }
    }

    function handleTouchEnd() {
        initialTouchY = null;
        modal.style.transition = 'height 0.3s ease';

        const currentHeightPercent = (modal.offsetHeight / window.innerHeight) * 100;

        // Define quando expandir ou recolher baseado na posição atual
        if (currentHeightPercent > 70) {
            modal.style.height = maxHeight;
            isExpanded = true;
        } else {
            modal.style.height = minHeight;
            isExpanded = false;
        }
    }

    // Adiciona suporte para mouse
    let isDragging = false;
    let startMouseY;

    dragIndicator.addEventListener('mousedown', (e) => {
        isDragging = true;
        startMouseY = e.clientY;
        currentHeight = modal.offsetHeight;
        modal.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const diff = startMouseY - e.clientY;
        if (diff > 0) { // Arrastando para cima
            modal.style.height = `${Math.min(window.innerHeight * 0.9, currentHeight + diff)}px`;
        } else { // Arrastando para baixo
            modal.style.height = `${Math.max(window.innerHeight * 0.5, currentHeight - Math.abs(diff))}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        
        modal.style.transition = 'height 0.3s ease';
        const currentHeightPercent = (modal.offsetHeight / window.innerHeight) * 100;

        if (currentHeightPercent > 70) {
            modal.style.height = maxHeight;
            isExpanded = true;
        } else {
            modal.style.height = minHeight;
            isExpanded = false;
        }
    });
});
