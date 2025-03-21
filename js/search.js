import { StartupManager } from './startup-manager.js';

const startupManager = new StartupManager();
const startupsList = document.getElementById('startupsList');
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-button');

// Função única para renderizar startups
function renderStartups(startups) {
    if (!startupsList) return;
    
    startupsList.innerHTML = startups.map(startup => `
        <div class="startup-card" data-id="${startup.id}">
            <div class="startup-header">
                <div class="startup-logo">
                    <img src="${startup.logo}" alt="${startup.nome}">
                </div>
                <div class="startup-info">
                    <h3>${startup.nome}</h3>
                    <span class="startup-category">${startup.categoria}</span>
                </div>
            </div>
            <p>${startup.descricao}</p>
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
            <div class="card-actions">
                <button class="share-button">
                    <i class="fas fa-share"></i> Compartilhar
                </button>
                <button class="invest-button" data-id="${startup.id}">Investir</button>
            </div>
        </div>
    `).join('');

    addCardListeners();
}

// Função de busca atualizada para usar startupManager
async function searchStartups(query) {
    if (!query) {
        // Se a busca estiver vazia, mostra todas as startups
        const allStartups = await startupManager.getAllStartups();
        renderStartups(allStartups);
        return;
    }

    query = query.toLowerCase();
    const allStartups = await startupManager.getAllStartups();
    const filtered = allStartups.filter(startup => 
        startup.nome.toLowerCase().includes(query) ||
        startup.categoria.toLowerCase().includes(query) ||
        startup.descricao.toLowerCase().includes(query)
    );
    
    renderStartups(filtered);

    // Remove active de todos os botões de filtro
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Event listeners para busca - atualizados para async
searchInput.addEventListener('input', async (e) => await searchStartups(e.target.value));
searchButton.addEventListener('click', async () => await searchStartups(searchInput.value));

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Espera o StartupManager carregar os dados
        await startupManager.loadStartups();
        
        // 2. Obtém todas as startups
        const startups = await startupManager.getAllStartups();
        
        // 3. Renderiza as startups
        renderStartups(startups);
        
        // 4. Ativa o filtro "todas"
        const todasBtn = document.getElementById('btnTodas');
        if (todasBtn) {
            document.querySelectorAll('.category-btn').forEach(btn => 
                btn.classList.remove('active'));
            todasBtn.classList.add('active');
        }

        // 5. Configura os listeners dos filtros
        setupFilterListeners();

        // Adiciona listeners para busca
        searchInput.addEventListener('input', (e) => searchStartups(e.target.value));
        searchButton.addEventListener('click', () => searchStartups(searchInput.value));
    } catch (error) {
        console.error('Erro na inicialização:', error);
    }
});

// Configuração dos filtros
function setupFilterListeners() {
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const category = button.innerText.trim(); // Usa o texto do botão em vez de data-category
            
            // Atualiza classes active
            document.querySelectorAll('.category-btn')
                .forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filtra startups
            const filtered = await startupManager.getStartupsByCategory(category);
            renderStartups(filtered);
        });
    });
}

function addCardListeners() {
    document.querySelectorAll('.startup-card').forEach(card => {
        card.addEventListener('click', async (e) => {
            if (!e.target.closest('button')) {
                const startupId = parseInt(card.dataset.id);
                const startup = await startupManager.getStartupById(startupId);
                
                if (startup) {
                    const isMobile = window.innerWidth <= 768;
                    if (isMobile) {
                        // Abre o modal em telas móveis
                        window.openStartupModal(startup);
                    } else {
                        // Renderiza no startup-details em desktop
                        const detailsContainer = document.getElementById('startupDetails');
                        if (detailsContainer) {
                            detailsContainer.innerHTML = `
                                <div class="startup-details-content">
                                    <h2>${startup.nome}</h2>
                                    <div class="startup-header">
                                        <div class="startup-logo">
                                            <img src="${startup.logo}" alt="${startup.nome}">
                                        </div>
                                        <div class="startup-info">
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
                                </div>
                            `;
                            detailsContainer.classList.remove('hidden');
                            setupTabs(detailsContainer);
                        }
                    }
                }
            }
        });
    });
}
