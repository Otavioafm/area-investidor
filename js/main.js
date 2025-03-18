// Sample startup data
const startups = [
    {
        id: 1,
        name: "Startup Lorem Ipsum",
        category: "tecnologia",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        location: "São Paulo, SP",
        metrics: {
            investment: "5 K",
            equity: "10%",
            investors: 120
        },
        team: [
            { name: "Alice", role: "CEO", photo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c" },
            { name: "Bob", role: "CTO", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e" },
            { name: "Charlie", role: "COO", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7" }
        ],
        documents: [
            { name: "Documento 1", url: "./docs/documento1.pdf" },
            { name: "Documento 2", url: "./docs/documento2.pdf" }
        ],
        roadmap: [
            { date: "Q4 2023", milestone: "Lançamento do MVP" },
            { date: "Q1 2024", milestone: "Expansão Regional" },
            { date: "Q2 2024", milestone: "Série A" },
            { date: "Q4 2024", milestone: "Expansão Nacional" }
        ],
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 2,
        name: "AgroTech Brasil",
        category: "agtech",
        description: "Desenvolvemos tecnologias para otimização da produção agrícola usando IoT e análise de dados.",
        location: "Ribeirão Preto, SP",
        metrics: {
            investment: "10K",
            equity: "15%",
            investors: 85
        }
    },
    {
        id: 3,
        name: "HealthCare AI",
        category: "healthtech",
        description: "Utilizamos IA para auxiliar médicos em diagnósticos precisos e tratamentos personalizados.",
        location: "Rio de Janeiro, RJ",
        metrics: {
            investment: "15K",
            equity: "8%",
            investors: 200
        }
    }
];

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

modalClose.addEventListener('click', () => {
    startupModal.classList.remove('show');
    document.body.classList.remove('modal-open');
});

// Render startup cards
function renderStartups(filteredStartups = startups) {
    startupsList.innerHTML = filteredStartups.map(startup => `
        <div class="startup-card" data-id="${startup.id}">
            <div class="startup-header">
                <div class="startup-logo">
                    <img src="https://via.placeholder.com/60">
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
                <button class="like-button" onclick="toggleLike(${startup.id})">
                    <i class="fas fa-heart"></i> Curtir
                </button>
                <button class="invest-button" data-id="${startup.id}">Investir</button>
            </div>
        </div>
    `).join('');
        
    // Add event listeners
    document.querySelectorAll('.startup-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.like-button')) {
                const id = parseInt(card.dataset.id);
                showStartupDetails(id);
            }
        });
    });

    // Adicionar evento de clique ao botão "Investir"
    ddocument.querySelectorAll('.invest-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const startupId = button.dataset.id;
            redirectToPage(`pagamento.html?startupId=${startupId}`);
        });
    });
}


function redirectToPage(url) {
    if (!isUserLoggedIn()) {
        openPopup(); // Abre o popup de login
        return; // Impede o redirecionamento
    }
    window.location.href = url; // Redireciona apenas se o usuário estiver logado
}


// Show startup details
function showStartupDetails(id) {
    const startup = startups.find(s => s.id === id);
    if (!startup) return;

    selectedStartup = startup;
    const isSmallScreen = window.innerWidth <= 768;

    const teamPhotosHtml = startup.team ? startup.team.map(member => `
        <div class="team-photo">
            <img src="${member.photo}" alt="${member.name}">
            <div class="info">
                <h4>${member.name}</h4>
                <p class="role">${member.role}</p>
            </div>
        </div>
    `).join('') : '';

    const documentsHtml = startup.documents ? startup.documents.map(doc => `
        <a href="${doc.url}" target="_blank" class="document-card">
            <i class="fas fa-file-pdf"></i>
            <span>${doc.name}</span>
        </a>
    `).join('') : '';

    const roadmapHtml = startup.roadmap ? startup.roadmap.map(item => `
        <div class="roadmap-item">
            <span class="date">${item.date}</span>
            <p class="milestone">${item.milestone}</p>
        </div>
    `).join('') : '';

    const videoHtml = startup.video ? `
        <div class="video-section">
            <iframe width="560" height="315" src="${startup.video}" frameborder="0" allowfullscreen></iframe>
        </div>
    ` : '';

    if (isSmallScreen) {
        modalTitle.textContent = startup.name;
        modalContent.innerHTML = `
            <div class="details-header">
                <div class="startup-logo"></div>
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
                ${teamPhotosHtml}
            </div>
            <div class="data-section" data-content="dados" style="display: none;">
                <h3>Documentos</h3>
                <div class="documents-grid">
                    ${documentsHtml}
                </div>
            </div>
            <div class="roadmap-section" data-content="roadmap" style="display: none;">
                <h3>Roadmap</h3>
                ${roadmapHtml}
            </div>
            <div class="video-section" data-content="video" style="display: none;">
                <h3>Vídeo</h3>
                ${videoHtml}
            </div>
        `;
        startupModal.classList.add('show');
        document.body.classList.add('modal-open');
    } else {
        startupDetails.classList.remove('hidden');
        startupDetails.innerHTML = `
            <div class="details-header">
                <div class="startup-logo"></div>
                <div class="details-info">
                    <h2>${startup.name}</h2>
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
                ${teamPhotosHtml}
            </div>
            <div class="data-section" data-content="dados" style="display: none;">
                <h3>Documentos</h3>
                <div class="documents-grid">
                    ${documentsHtml}
                </div>
            </div>
            <div class="roadmap-section" data-content="roadmap" style="display: none;">
                <h3>Roadmap</h3>
                ${roadmapHtml}
            </div>
            <div class="video-section" data-content="video" style="display: none;">
                <h3>Vídeo</h3>
                ${videoHtml}
            </div>
        `;
    }

    // Add tab event listeners
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeTab = tab.dataset.tab;

            // Toggle content visibility
            document.querySelectorAll('[data-content]').forEach(content => {
                content.style.display = content.dataset.content === activeTab ? 'block' : 'none';
            });
        });
    });

    // Ensure the correct tab content is displayed initially
    document.querySelectorAll('[data-content]').forEach(content => {
        content.style.display = content.dataset.content === activeTab ? 'block' : 'none';
    });
    disableTabsForNonLoggedInUsers();
}

modalClose.addEventListener('click', () => {
    startupModal.classList.remove('show');
    document.body.classList.remove('modal-open');
});

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
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Toggle like
function toggleLike(id) {
    if (likedStartups.has(id)) {
        likedStartups.delete(id);
    } else {
        likedStartups.add(id);
    }
    renderStartups();
}

// Generate category filters dynamically
function generateCategoryFilters() {
    const categories = new Set(startups.map(startup => startup.category));
    categoryButtonsContainer.innerHTML = `
        <button class="category-btn active" data-category="todas">Todas as categorias</button>
        ${Array.from(categories).map(category => `
            <button class="category-btn" data-category="${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</button>
        `).join('')}
        <button class="expand-btn">Mais filtros</button>
    `;

    // Add event listeners to category buttons
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.category;
            const filteredStartups = category === 'todas'
                ? startups
                : startups.filter(startup => startup.category === category);
            renderStartups(filteredStartups);
        });
    });
}

// Initial render
generateCategoryFilters();
renderStartups();



