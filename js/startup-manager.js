export class StartupManager {
    constructor() {
        this.startups = [];
        this.loadStartups();
    }

    async loadStartups() {
        try {
            const response = await fetch('data/startups.json');
            this.startups = await response.json();
        } catch (error) {
            console.error('Erro ao carregar startups:', error);
            this.startups = [];
        }
    }

    async getAllStartups() {
        return this.startups;
    }

    async getStartupById(id) {
        return this.startups.find(s => s.id === parseInt(id));
    }

    async getStartupsByCategory(category) {
        if (category.toLowerCase() === 'todas') {
            return this.startups;
        }
        return this.startups.filter(startup => 
            startup.categoria.toLowerCase() === category.toLowerCase()
        );
    }
}
