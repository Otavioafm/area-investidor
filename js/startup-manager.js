export class StartupManager {
    constructor() {
        this.apiUrl = '/api';
        this.startups = [
            {
                id: 1,
                name: "TechFlow Solutions",
                category: "tecnologia",
                description: "Plataforma SaaS de automação de processos empresariais com IA integrada.",
                metrics: {
                    investment: "R$ 250K",
                    equity: "8%",
                    investors: 85
                },
                media: {
                    logo: "https://picsum.photos/60",
                    video: "https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1",
                    images: ["url1", "url2"]
                },
                team: [
                    {
                        name: "João Silva",
                        role: "CEO",
                        photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"
                    }
                ],
                documents: [
                    {
                        name: "Pitch Deck",
                        url: "/docs/pitch.pdf",
                        type: "pdf"
                    }
                ],
                roadmap: [
                    {
                        date: "2024 Q1",
                        milestone: "Lançamento do MVP"
                    }
                ]
            },
            {
                id: 2,
                name: "AgroSmart Brasil",
                category: "agtech",
                description: "Sistema IoT para monitoramento e otimização de produção agrícola, utilizando sensores inteligentes e análise preditiva.",
                location: "Ribeirão Preto, SP",
                metrics: {
                    investment: "R$ 500K",
                    equity: "12%",
                    investors: 143,
                    valuation: "R$ 4.5M",
                    monthlyRevenue: "R$ 180K"
                }
            },
            {
                id: 3,
                name: "HealthTech AI",
                category: "healthtech",
                description: "Plataforma de diagnóstico médico assistido por IA, com foco em análise de imagens e suporte à decisão clínica.",
                location: "Rio de Janeiro, RJ",
                metrics: {
                    investment: "R$ 350K",
                    equity: "15%",
                    investors: 92,
                    valuation: "R$ 2.8M",
                    monthlyRevenue: "R$ 95K"
                }
            },
            {
                id: 4,
                name: "EduTech Pro",
                category: "educação",
                description: "Plataforma adaptativa de ensino online que personaliza o aprendizado usando inteligência artificial.",
                location: "Florianópolis, SC",
                metrics: {
                    investment: "R$ 180K",
                    equity: "10%",
                    investors: 64,
                    valuation: "R$ 1.9M",
                    monthlyRevenue: "R$ 75K"
                }
            },
            {
                id: 5,
                name: "FinanceFlow",
                category: "fintech",
                description: "Sistema de gestão financeira empresarial com integração bancária automática e relatórios em tempo real.",
                location: "Belo Horizonte, MG",
                metrics: {
                    investment: "R$ 420K",
                    equity: "9%",
                    investors: 156,
                    valuation: "R$ 5.1M",
                    monthlyRevenue: "R$ 220K"
                }
            }
        ];

        // Lista fixa de categorias principais
        this.mainCategories = [
            "todas",
            "tecnologia",
            "agtech",
            "fintech"
        ];

        // Categorias expandidas
        this.expandedCategories = [
            "healthtech",
            "edtech",
            "blockchain",
            "ecommerce",
            "sustentabilidade"
        ];
    }

    // Método de fallback para dados locais
    getLocalStartups() {
        return this.startups;
    }

    getLocalStartupById(id) {
        return this.startups.find(s => s.id === id);
    }

    getLocalCategories() {
        return [...new Set(this.startups.map(startup => startup.category))];
    }

    // Métodos que serão usados com a API
    async getAllStartups() {
        return this.startups;
    }

    async getStartupById(id) {
        return this.startups.find(s => s.id === id);
    }

    async getCategories() {
        const categories = new Set(this.startups.map(startup => startup.category));
        return Array.from(categories);
    }

    async toggleLike(id) {
        try {
            const response = await fetch(`${this.apiUrl}/startups/${id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            return { success: false, error: error.message };
        }
    }

    // Método para obter categorias principais
    getMainCategories() {
        return this.mainCategories;
    }

    // Método para obter categorias expandidas
    getExpandedCategories() {
        return this.expandedCategories;
    }

    // Método para filtrar startups por categoria
    async getStartupsByCategory(category) {
        try {
            // Se a categoria for "todas", retorna todas as startups
            if (category === 'todas') {
                return this.startups;
            }
            
            // Filtra as startups pela categoria (case insensitive)
            const filteredStartups = this.startups.filter(startup => 
                startup.category.toLowerCase() === category.toLowerCase()
            );

            return filteredStartups;
        } catch (error) {
            console.error('Erro ao filtrar startups:', error);
            return [];
        }
    }
}
