import { StartupManager } from './startup-manager.js';
import { Auth } from './auth.js';
import { openPopup } from './auth-popup.js';

// Inicialização dos gerenciadores
const startupManager = new StartupManager();
const auth = new Auth();

// State management
let selectedStartup = null;
let activeTab = 'descricao';
const likedStartups = new Set();

// DOM Elements
const startupsList = document.getElementById('startupsList');
const startupDetails = document.getElementById('startupDetails');
const categoryButtonsContainer = document.querySelector('.categories-main');
const expandButton = document.querySelector('.expand-btn');
const expandedCategories = document.querySelector('.categories-expanded');
const startupModal = document.getElementById('startupModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

// Toggle expanded categories
expandButton.addEventListener('click', () => {
    expandedCategories.classList.toggle('show');
    expandButton.classList.toggle('active');
});

// Modifica a função showStartupDetails
async function showStartupDetails(id) {
    try {
        const startup = await startupManager.getStartupById(id);
        if (!startup) return;

        selectedStartup = startup;
        const isSmallScreen = window.innerWidth <= 768;

        // Preserva a posição atual do scroll
        const currentScrollPos = window.scrollY;

        // Fecha o popup anterior se existir
        const existingModal = document.getElementById('startupModal');
        if (existingModal && existingModal.classList.contains('show')) {
            existingModal.classList.remove('show');
            document.body.classList.remove('modal-open');
        }

        // HTML para o conteúdo do popup/modal
        const modalContentHTML = `
            <div class="details-header">
                <div class="startup-logo">
                    <img src="${startup.media?.logo || 'https://picsum.photos/60'}" alt="${startup.name}">
                </div>
                <div class="details-info">
                    <span class="startup-category">${startup.category}</span>
                </div>
            </div>
            <div class="startup-metrics">
                <div class="metric">
                    <div class="metric-value">${startup.metrics.investment}</div>
                    <div class="metric-label">Investimento</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${startup.metrics.equity}</div>
                    <div class="metric-label">Equity</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${startup.metrics.investors}</div>
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
            <div class="description" data-content="descricao">
                ${startup.description}
            </div>
            <div class="team-photos" data-content="equipe" style="display: none;">
                ${startup.team ? startup.team.map(member => `
                    <div class="team-photo">
                        <img src="${member.photo}" alt="${member.name}">
                        <div class="info">
                            <h4>${member.name}</h4>
                            <p class="role">${member.role}</p>
                        </div>
                    </div>
                `).join('') : ''}
            </div>
            <div class="data-section" data-content="dados" style="display: none;">
                <h3>Documentos</h3>
                <div class="documents-grid">
                    ${startup.documents ? startup.documents.map(doc => `
                        <a href="${doc.url}" target="_blank" class="document-card">
                            <i class="fas fa-file-pdf"></i>
                            <span>${doc.name}</span>
                        </a>
                    `).join('') : ''}
                </div>
            </div>
            <div class="roadmap-section" data-content="roadmap" style="display: none;">
                <h3>Roadmap</h3>
                ${startup.roadmap ? startup.roadmap.map(item => `
                    <div class="roadmap-item">
                        <span class="date">${item.date}</span>
                        <p class="milestone">${item.milestone}</p>
                    </div>
                `).join('') : ''}
            </div>
            <div class="video-section" data-content="video" style="display: none;">
                ${startup.media?.video ? `
                    <div class="video-wrapper">
                        <iframe 
                            src="${startup.media.video}" 
                            frameborder="0"
                            allowfullscreen>
                        </iframe>
                    </div>
                ` : '<p>Nenhum vídeo disponível</p>'}
            </div>
        `;

        if (isSmallScreen) {
            modalTitle.textContent = startup.name;
            modalContent.innerHTML = modalContentHTML;
            startupModal.classList.add('show');
            document.body.classList.add('modal-open');
            
            // Mantém a posição do scroll
            document.body.style.top = `-${currentScrollPos}px`;
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            
            setupTabs(startupModal);
        } else {
            startupDetails.classList.remove('hidden');
            startupDetails.innerHTML = modalContentHTML;
            setupTabs(startupDetails);
        }

        // Mostra a primeira tab por padrão
        const firstTab = document.querySelector('.tab[data-tab="descricao"]');
        if (firstTab) {
            firstTab.click();
        }

        // Aplica as restrições de login após configurar as tabs
        disableTabsForNonLoggedInUsers();
        
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
    }
}

// Nova função para configurar as tabs
function setupTabs(container) {
    const tabs = container.querySelectorAll('.tab');
    const contents = container.querySelectorAll('[data-content]');
    
    // Esconde todos os conteúdos primeiro
    contents.forEach(content => {
        content.style.display = 'none';
    });

    // Mostra o primeiro conteúdo por padrão
    const firstContent = container.querySelector('[data-content="descricao"]');
    if (firstContent) {
        firstContent.style.display = 'block';
    }

    // Adiciona evento de clique em cada tab
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active de todas as tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Adiciona active na tab clicada
            tab.classList.add('active');
            
            // Esconde todos os conteúdos
            contents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Mostra o conteúdo correspondente
            const contentId = tab.getAttribute('data-tab');
            const content = container.querySelector(`[data-content="${contentId}"]`);
            if (content) {
                content.style.display = 'block';
            }
        });
    });

    // Ativa a primeira tab
    const firstTab = container.querySelector('.tab');
    if (firstTab) {
        firstTab.click();
    }
}

// Disable tabs for non-logged-in users
function disableTabsForNonLoggedInUsers() {
    const tabs = document.querySelectorAll('.details-tabs .tab');
    if (!isUserLoggedIn()) {
        tabs.forEach(tab => {
            const tabName = tab.dataset.tab;
            if (tabName !== 'descricao') {
                tab.classList.add('disabled');
                tab.setAttribute('aria-disabled', 'true');
            }
        });

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (tab.classList.contains('disabled')) {
                    alert('Você precisa estar logado para acessar esta seção.');
                }
            });
        });
    } else {
        tabs.forEach(tab => {
            tab.classList.remove('disabled');
            tab.removeAttribute('aria-disabled');
        });
    }
}

// Check if user is logged in
function isUserLoggedIn() {
    return auth.isLoggedIn();
}

// Modifique a função generateCategoryFilters
async function generateCategoryFilters() {
    try {
        const mainCategories = startupManager.mainCategories;
        const expandedCategories = startupManager.expandedCategories;
        
        if (!categoryButtonsContainer) return;

        // Renderiza categorias principais
        categoryButtonsContainer.innerHTML = mainCategories.map(category => `
            <button class="category-btn ${category === 'todas' ? 'active' : ''}" 
                    data-category="${category}">
                ${category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
        `).join('');

        // Adiciona o botão "Mais filtros"
        categoryButtonsContainer.innerHTML += '<button class="expand-btn">Mais filtros</button>';

        // Renderiza categorias expandidas
        const expandedContainer = document.querySelector('.categories-expanded');
        if (expandedContainer) {
            expandedContainer.innerHTML = expandedCategories.map(category => `
                <button class="category-btn" data-category="${category}">
                    ${category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
            `).join('');
        }

        // Adiciona eventos aos botões
        addFilterEventListeners();
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

// Adicione a função de filtro
async function filterStartups(category) {
    try {
        // Obtém as startups filtradas
        const filteredStartups = await startupManager.getStartupsByCategory(category);
        
        // Atualiza a lista de startups
        if (startupsList) {
            startupsList.innerHTML = filteredStartups.map(startup => `
                <div class="startup-card" data-id="${startup.id}">
                    <div class="startup-header">
                        <div class="startup-logo">
                            <img src="${startup.media?.logo || 'https://picsum.photos/60'}">
                        </div>
                        <div class="startup-info">
                            <h3>${startup.name}</h3>
                            <span class="startup-category">${startup.category}</span>
                        </div>
                    </div>
                    <p class="startup-description">${startup.description}</p>
                    <div class="startup-metrics">
                        <div class="metric">
                            <span class="metric-value">${startup.metrics.investment}</span>
                            <span class="metric-label">Investimento</span>
                        </div>
                        <div class="metric">
                            <span class="metric-value">${startup.metrics.equity}</span>
                            <span class="metric-label">Equity</span>
                        </div>
                        <div class="metric">
                            <span class="metric-value">${startup.metrics.investors}</span>
                            <span class="metric-label">Investidores</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="share-button">
                             <i class="fas fa-share"></i> Compartilhar
                        </button>
                        <button class="invest-button" data-id="${startup.id}">Investir</button>
                    </div>
                </div>
            `).join('');

            // Mostra automaticamente os detalhes da primeira startup filtrada
            if (filteredStartups.length > 0) {
                showStartupDetails(filteredStartups[0].id);
            }
        }

        // Atualiza os botões ativos
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Reaplica os event listeners nos novos elementos
        addEventListeners();
    } catch (error) {
        console.error('Erro ao filtrar startups:', error);
    }
}

// Modifique a função addFilterEventListeners
function addFilterEventListeners() {
    // Eventos para os botões de categoria
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterStartups(category);
        });
    });

    // Evento para o botão de expandir
    const expandBtn = document.querySelector('.expand-btn');
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            const expandedSection = document.querySelector('.categories-expanded');
            expandedSection?.classList.toggle('show');
            expandBtn.classList.toggle('active');
        });
    }
}

// Add Event Listeners - Separado em função própria
function addEventListeners() {
    // Evento de clique no card
    document.querySelectorAll('.startup-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const clickedElement = e.target;
            const isButton = clickedElement.closest('.invest-button') || 
                           clickedElement.closest('.like-button');
            
            if (isButton) {
                e.stopPropagation();
                return;
            }

            const id = parseInt(card.dataset.id);
            showStartupDetails(id);
        });
    });

    // Evento do botão investir - Nova implementação
    document.querySelectorAll('.invest-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!isUserLoggedIn()) {
                openPopup();
                return;
            }

            const startupId = button.dataset.id;
            const startup = selectedStartup || getStartupById(startupId);
            
            if (startup) {
                const params = new URLSearchParams({
                    startupId: startup.id,
                    name: encodeURIComponent(startup.name),
                    logo: encodeURIComponent(startup.media?.logo || ''),
                    category: encodeURIComponent(startup.category),
                    investment: encodeURIComponent(startup.metrics.investment),
                    equity: encodeURIComponent(startup.metrics.equity)
                });
                window.location.href = `pagamento.html?${params.toString()}`;
            }
        });
    });

    // Evento do botão like
    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const card = button.closest('.startup-card');
            if (card) {
                const id = parseInt(card.dataset.id);
                toggleLike(id);
            }
        });
    });
}

// Initialize - Adaptado para async/await
async function initialize() {
    try {
        await generateCategoryFilters();
    } catch (error) {
        console.error('Erro na inicialização:', error);
        // Tratamento de erro adequado
    }
}

// Start the application
document.addEventListener('DOMContentLoaded', initialize);

function redirectToPage(url) {
    if (!isUserLoggedIn()) {
        openPopup();
        return;
    }
    
    // Recupera os dados da startup selecionada
    const startup = selectedStartup;
    if (startup) {
        const params = new URLSearchParams({
            startupId: startup.id,
            logo: startup.media.logo,
            category: startup.category,
            investment: startup.metrics.investment,
            equity: startup.metrics.equity
        });
        window.location.href = `${url}?${params.toString()}`;
    }
}

// Adiciona listener para scroll e resize
window.addEventListener('scroll', updateModalPosition, { passive: true });
window.addEventListener('resize', updateModalPosition, { passive: true });

// Atualiza a função handleScroll para uma animação mais suave
function handleScroll() {
    if (!selectedStartup) return;
    
    const details = document.getElementById('startupDetails');
    if (!details) return;

    // Usa requestAnimationFrame para melhor performance
    requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const contentHeight = document.querySelector('.content-wrapper').offsetHeight;
        const detailsHeight = details.offsetHeight;
        
        if (window.innerWidth > 768) {
            // Calcula o offset com easing
            const maxOffset = Math.max(0, contentHeight - windowHeight);
            const scrollProgress = Math.min(scrollY / maxOffset, 1);
            const easedProgress = easeInOutCubic(scrollProgress);
            
            // Aplica transformação suave
            details.style.setProperty('--scroll-offset', `${scrollY}px`);
            details.classList.add('scrolling');
            
            // Remove a classe após a animação
            clearTimeout(details.scrollTimeout);
            details.scrollTimeout = setTimeout(() => {
                details.classList.remove('scrolling');
            }, 100);
        }
    });
}

// Função de easing para movimento mais natural
function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Otimiza o evento de scroll com throttle
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Aplica throttle no evento de scroll
window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });

// Atualizar o event listener do botão de fechar
document.addEventListener('DOMContentLoaded', () => {
    const modalClose = document.getElementById('modalClose');
    const startupModal = document.getElementById('startupModal');
    
    if (modalClose) {
        modalClose.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede propagação do evento
            closeModal();
        });
    }
});



