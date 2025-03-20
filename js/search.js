// Dados mockados para teste
const mockStartups = [
    {
        id: 1,
        nome: "TechPay",
        categoria: "Finanças",
        descricao: "Soluções de pagamento digital",
        logo: "img/startup1.jpg",
        investimento: "R$ 500.000",
        equity: "10%",
        investidores: 23
    },
    {
        id: 2,
        nome: "EduTech",
        categoria: "Educação",
        descricao: "Plataforma de ensino online",
        logo: "img/startup2.jpg",
        investimento: "R$ 300.000", 
        equity: "15%",
        investidores: 45
    },
    {
        id: 3,
        nome: "AgroSmart",
        categoria: "Agronegócio",
        descricao: "Tecnologia para agricultura",
        logo: "img/startup3.jpg",
        investimento: "R$ 750.000",
        equity: "8%",
        investidores: 12
    },
    {
        id: 4,
        nome: "TechFlow Solutions",
        categoria: "Tecnologia",
        descricao: "Automação de processos empresariais com IA",
        logo: "img/startup4.jpg",
        investimento: "R$ 850.000",
        equity: "12%",
        investidores: 34
    },
    {
        id: 5,
        nome: "HealthTech AI",
        categoria: "Saúde",
        descricao: "Diagnóstico médico assistido por inteligência artificial",
        logo: "img/startup5.jpg",
        investimento: "R$ 1.200.000",
        equity: "15%",
        investidores: 56
    },
    {
        id: 6,
        nome: "EduTech Pro",
        categoria: "Educação",
        descricao: "Plataforma adaptativa de aprendizagem profissional",
        logo: "img/startup6.jpg",
        investimento: "R$ 600.000",
        equity: "9%",
        investidores: 28
    },
    {
        id: 7,
        nome: "FinanceFlow",
        categoria: "Finanças",
        descricao: "Gestão financeira automatizada para PMEs",
        logo: "img/startup7.jpg",
        investimento: "R$ 450.000",
        equity: "11%",
        investidores: 19
    }
];

// Seleciona elementos do DOM
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-button');
const startupsList = document.getElementById('startupsList');

// Função para buscar startups
function searchStartups(query) {
    if (!query) return mockStartups;

    query = query.toLowerCase();
    return mockStartups.filter(startup => 
        startup.nome.toLowerCase().includes(query) ||
        startup.categoria.toLowerCase().includes(query) ||
        startup.descricao.toLowerCase().includes(query)
    );
}

// Função para exibir os resultados
function displayStartups(results) {
    startupsList.innerHTML = '';
    
    results.forEach(startup => {
        const card = document.createElement('div');
        card.className = 'startup-card';
        card.innerHTML = `
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
        `;
        startupsList.appendChild(card);
    });
}

// Event listeners
searchInput.addEventListener('input', (e) => {
    const results = searchStartups(e.target.value);
    displayStartups(results);
});

searchButton.addEventListener('click', () => {
    const results = searchStartups(searchInput.value);
    displayStartups(results);
});

// Mostrar todas as startups ao carregar
displayStartups(mockStartups);
