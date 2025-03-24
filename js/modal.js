document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal');
    const modalClose = document.querySelector('.modal-close');
    let scrollPosition = 0;

    window.openStartupModal = function(startup) {
        if (window.innerWidth > 768) return;

        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');

        if (!startup || !modal || !modalTitle || !modalContent) return;

        modalTitle.textContent = startup.nome;
        modalContent.innerHTML = `
            <div class="startup-header">
                <div class="startup-logo">
                    <img src="${startup.logo}" alt="${startup.nome}">
                </div>
                <div class="startup-info">
                    <h3>${startup.nome}</h3>
                    <span class="startup-category">${startup.categoria}</span>
                </div>
            </div>

            <div class="startup-metrics">
                <div class="metric">
                    <div class="metric-value">${startup.investimento}</div>
                    <div class="metric-label">Investimento</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${startup.equity}</div>
                    <div class="metric-label">Equity</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${startup.investidores}</div>
                    <div class="metric-label">Investidores</div>
                </div>
            </div>

            <div class="details-tabs">
                <div class="tab active" data-tab="descricao">Descrição</div>
                <div class="tab" data-tab="equipe">Equipe</div>
                <div class="tab" data-tab="dados">Dados</div>
                <div class="tab" data-tab="roadmap">Roadmap</div>
                <div class="tab" data-tab="video">Vídeo</div>
            </div>

            <div class="tab-content">
                <div data-content="descricao" class="description">
                    <p>${startup.descricao}</p>
                </div>

                <div data-content="equipe" class="team-photos" style="display: none;">
                    ${startup.team ? startup.team.map(member => `
                        <div class="team-photo">
                            <img src="${member.photo}" alt="${member.name}">
                            <div class="info">
                                <h4>${member.name}</h4>
                                <p class="role">${member.role}</p>
                                <p class="bio">${member.bio}</p>
                            </div>
                        </div>
                    `).join('') : 'Equipe não disponível'}
                </div>

                <div data-content="dados" class="data-section" style="display: none;">
                    ${startup.documents ? `
                        <div class="documents-grid">
                            ${startup.documents.map(doc => `
                                <a href="${doc.url}" target="_blank" class="document-card">
                                    <i class="fas fa-file-pdf"></i>
                                    <span>${doc.name}</span>
                                </a>
                            `).join('')}
                        </div>
                    ` : 'Documentos não disponíveis'}
                </div>

                <div data-content="roadmap" class="roadmap-section" style="display: none;">
                    ${startup.roadmap ? startup.roadmap.map(item => `
                        <div class="roadmap-item">
                            <span class="date">${item.date}</span>
                            <p class="milestone">${item.milestone}</p>
                        </div>
                    `).join('') : 'Roadmap não disponível'}
                </div>

                <div data-content="video" class="video-section" style="display: none;">
                    ${startup.media?.video ? `
                        <div class="video-wrapper">
                            <iframe src="${startup.media.video}" 
                                    frameborder="0" 
                                    allowfullscreen>
                            </iframe>
                        </div>
                    ` : 'Vídeo não disponível'}
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="invest-button" onclick="window.location.href='pagamento.html?${new URLSearchParams({
                    id: startup.id,
                    nome: startup.nome,
                    logo: startup.logo,
                    categoria: startup.categoria,
                    investimento: startup.investimento,
                    equity: startup.equity
                }).toString()}'">
                    Investir
                </button>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => modal.classList.add('show'), 10);

        setupModalTabs();
        setTimeout(initDrag, 100);
    };

    // Adiciona função global para redirecionamento
    window.redirectToPayment = function(event) {
        event.preventDefault();
        event.stopPropagation();

        const startup = {
            id: document.querySelector('.startup-card')?.dataset.id,
            nome: document.querySelector('.startup-info h3')?.textContent,
            logo: document.querySelector('.startup-logo img')?.src,
            categoria: document.querySelector('.startup-category')?.textContent,
            investimento: document.querySelector('.metric-value')?.textContent,
            equity: document.querySelectorAll('.metric-value')[1]?.textContent,
        };

        const params = new URLSearchParams({
            id: startup.id || '',
            nome: encodeURIComponent(startup.nome || ''),
            logo: encodeURIComponent(startup.logo || ''),
            categoria: encodeURIComponent(startup.categoria || ''),
            investimento: encodeURIComponent(startup.investimento || ''),
            equity: encodeURIComponent(startup.equity || '')
        });

        window.location.href = `pagamento.html?${params.toString()}`;
    };

    function setupModalTabs() {
        const tabs = modal.querySelectorAll('.tab');
        const contents = modal.querySelectorAll('[data-content]');
        
        // Esconde todos os conteúdos
        contents.forEach(content => content.style.display = 'none');
        
        // Mostra o conteúdo da primeira tab
        const firstContent = modal.querySelector('[data-content="descricao"]');
        if (firstContent) firstContent.style.display = 'block';

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active de todas as tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Adiciona active na tab clicada
                tab.classList.add('active');
                
                // Esconde todos os conteúdos
                contents.forEach(content => content.style.display = 'none');
                
                // Mostra o conteúdo correspondente
                const contentId = tab.getAttribute('data-tab');
                const content = modal.querySelector(`[data-content="${contentId}"]`);
                if (content) content.style.display = 'block';
            });
        });
    }

    modalClose.addEventListener('click', () => {
        // Armazena posição do scroll antes de fechar
        scrollPosition = window.pageYOffset;
        
        modal.classList.remove('show');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        
        // Restaura a posição do scroll
        window.scrollTo(0, scrollPosition);
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });

    // Adicionar lógica de drag
    let startY;
    let currentY;
    let isDragging = false;

    function initDrag() {
        const dragIndicator = document.querySelector('.modal-drag-indicator');
        if (!dragIndicator) return;

        dragIndicator.addEventListener('touchstart', handleDragStart);
        document.addEventListener('touchmove', handleDrag);
        document.addEventListener('touchend', handleDragEnd);
    }

    function handleDragStart(e) {
        isDragging = true;
        startY = e.touches[0].clientY;
        const modal = document.querySelector('.modal');
        modal.style.transition = 'none';
    }

    function handleDrag(e) {
        if (!isDragging) return;

        currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;
        const modal = document.querySelector('.modal');

        // Permite apenas arrasto para cima (deltaY positivo)
        if (deltaY > 0 && !modal.classList.contains('expanded')) {
            e.preventDefault();
            modal.style.transform = `translateY(-${deltaY}px)`;
        }
    }

    function handleDragEnd() {
        if (!isDragging) return;
        
        const modal = document.querySelector('.modal');
        isDragging = false;

        modal.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        const transform = modal.style.transform;
        const currentDrag = parseInt(transform.replace(/[^0-9-]/g, '')) || 0;

        if (currentDrag > 50) { // Se arrastou mais que 50px para cima
            modal.style.transform = '';
            modal.classList.add('expanded');
        } else {
            modal.style.transform = '';
            modal.classList.remove('expanded');
        }

        startY = null;
        currentY = null;
    }

    // Esta função estava faltando no seu arquivo
    function updateModalPosition() {
        if (!modal) return;
        
        const viewportHeight = window.innerHeight;
        const modalHeight = modal.offsetHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        let topPosition = Math.max(0, (viewportHeight - modalHeight) / 2 + scrollTop);
        modal.style.top = `${topPosition}px`;
    }

    // Adiciona evento de clique para o botão investir
    document.addEventListener('click', function(e) {
        const investButton = e.target.closest('.invest-button');
        if (investButton) {
            e.preventDefault();
            e.stopPropagation();

            const startupId = investButton.dataset.id;
            const startupCard = investButton.closest('.startup-card');
            
            if (startupCard) {
                const startup = {
                    id: startupId,
                    nome: startupCard.querySelector('.startup-info h3').textContent,
                    logo: startupCard.querySelector('.startup-logo img').src,
                    categoria: startupCard.querySelector('.startup-category').textContent,
                    investimento: startupCard.querySelector('.metric-value').textContent,
                    equity: startupCard.querySelectorAll('.metric-value')[1].textContent
                };

                const params = new URLSearchParams({
                    id: startup.id,
                    nome: encodeURIComponent(startup.nome),
                    logo: encodeURIComponent(startup.logo),
                    categoria: encodeURIComponent(startup.categoria),
                    investimento: encodeURIComponent(startup.investimento),
                    equity: encodeURIComponent(startup.equity)
                });

                window.location.href = `pagamento.html?${params.toString()}`;
            }
        }
    });
});
