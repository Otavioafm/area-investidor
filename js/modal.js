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
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => modal.classList.add('show'), 10);

        // Setup das tabs dentro do modal
        setupModalTabs();

        // Inicializar o drag após abrir o modal
        setTimeout(initDrag, 100);
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
    let initialHeight;
    let initialScroll;
    let isDragging = false;

    function initDrag() {
        const modal = document.querySelector('.modal');
        if (!modal) return;

        modal.addEventListener('touchstart', startDragging, { passive: true });
        modal.addEventListener('touchmove', drag, { passive: false });
        modal.addEventListener('touchend', endDragging);
    }

    function startDragging(e) {
        startY = e.touches[0].pageY;
        currentY = startY;
        modal.classList.add('dragging');
    }

    function drag(e) {
        if (!startY) return;
        currentY = e.touches[0].pageY;
        const diff = currentY - startY;

        // Se estiver no topo e tentar puxar para baixo
        if (modal.scrollTop === 0 && diff > 0) {
            e.preventDefault();
            modal.style.transform = `translateY(${diff}px)`;
            modal.style.transition = 'none';
        }
    }

    function endDragging() {
        if (!startY) return;
        
        modal.classList.remove('dragging');
        modal.style.transform = '';
        modal.style.transition = 'transform 0.3s ease';
        
        startY = null;
        currentY = null;
    }
});
