# Find Invest - Plataforma de Investimento em Startups

## Sumário
1. [Visão Geral](#visão-geral)
2. [Estrutura Atual do Projeto](#estrutura-atual-do-projeto)
3. [Funcionalidades Implementadas](#funcionalidades-implementadas)
4. [Sugestões para Backend](#sugestões-para-backend)
5. [Próximos Passos](#próximos-passos)

## Visão Geral
Find Invest é uma plataforma que conecta startups e investidores, permitindo o cadastro de startups, visualização de oportunidades e realização de investimentos.

## Estrutura Atual do Projeto

```plaintext
area-investidor/
├── css/
│   ├── style.css              # Estilos globais
│   ├── cadastro-login.css     # Estilos para autenticação
│   ├── formulario.css         # Estilos para formulários
│   └── pagamento.css          # Estilos para páginas de pagamento
├── js/
│   ├── main.js                # Lógica principal e renderização
│   ├── auth.js                # Autenticação e gerenciamento de usuários
│   ├── menu.js                # Controle do menu responsivo
│   ├── startup-manager.js     # Gerenciamento de dados das startups
│   ├── auth-popup.js          # Controle de popups de autenticação
│   ├── counter.js             # Contador para elementos
│   ├── disable-tabs.js        # Gerenciamento de tabs
│   └── pagamento.js           # Lógica de pagamentos
├── doc/
│   ├── CSS.md                 # Documentação detalhada do CSS
│   └── STYLES.md              # Guia de estilos e padrões
├── package.json              # Configurações e dependências do projeto
├── package-lock.json         # Versões fixas das dependências
├── *.html                    # Páginas HTML na raiz
└── README.md                 # Documentação principal
```

### Arquivos de Configuração

#### package.json
```json
{
  "name": "find-invest",
  "version": "1.0.0",
  "description": "Plataforma de investimento em startups",
  "private": true,
  "scripts": {
    "start": "Projeto atual roda via index.html"
  },
  "author": "",
  "license": "ISC"
}
```

#### package-lock.json
Este arquivo é gerado automaticamente e mantém as versões exatas das dependências instaladas. Atualmente o projeto não possui dependências externas, mas o arquivo está configurado para quando necessário.

### Dependências Futuras Planejadas
Para a próxima fase do projeto, serão necessárias as seguintes dependências:

```json
{
  "dependencies": {
    "axios": "Para requisições HTTP",
    "jwt-decode": "Para decodificação de tokens JWT",
    "moment": "Para manipulação de datas"
  },
  "devDependencies": {
    "eslint": "Para linting",
    "prettier": "Para formatação",
    "jest": "Para testes"
  }
}
```

## Funcionalidades Implementadas

### 1. Autenticação
- Sistema de login/cadastro com múltiplos perfis
- Gerenciamento de sessão via localStorage
- Popups de autenticação para ações restritas

### 2. Listagem de Startups
- Renderização dinâmica de cards
- Filtros por categoria
- Sistema de busca
- Layout responsivo
- Métricas alinhadas (Investimento/Equity/Investidores)

### 3. Modal/Bottom Sheet
- Desktop: Modal lateral fixo
- Mobile: Bottom sheet com gestos
- Tabs para diferentes seções
- Performance otimizada
- Suporte a iOS safe areas

### 4. UI/UX
- Menu responsivo com hamburger
- Feedback visual em interações
- Animações suaves
- Scroll otimizado

## Sugestões para Backend

### Endpoints Necessários

#### Autenticação
```plaintext
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/validate
```

#### Startups
```plaintext
GET    /api/startups
GET    /api/startups/:id
POST   /api/startups
PUT    /api/startups/:id
DELETE /api/startups/:id
```

#### Investimentos
```plaintext
POST   /api/investments
GET    /api/investments/user/:userId
GET    /api/investments/startup/:startupId
```

### Estrutura de Resposta da API

#### Startup
```typescript
{
    id: number;
    name: string;
    category: string;
    description: string;
    metrics: {
        investment: string;
        equity: string;
        investors: number;
    };
    media?: {
        logo: string;
        video?: string;
        images?: string[];
    };
}
```

#### Investimento
```typescript
{
    startupId: number;
    userId: number;
    amount: number;
    equity: number;
    timestamp: string;
    status: 'pending' | 'completed' | 'failed';
}
```

## Próximos Passos

### 1. Reorganização da Estrutura
- Criar pasta `pages/` e mover arquivos HTML
- Implementar sistema de rotas
- Organizar assets em pasta específica

### 2. Melhorias Frontend
- Implementar lazy loading de imagens
- Adicionar testes unitários
- Otimizar performance
- Adicionar features PWA

### 3. Desenvolvimento Backend
- Implementar API REST
- Configurar banco de dados
- Sistema de autenticação JWT
- Upload de arquivos

### 4. DevOps
- Configurar ambiente de desenvolvimento
- Setup de CI/CD
- Monitoramento e logs

## Contribuição
1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Convenções de Código

### JavaScript
- ES6+ features
- Módulos
- Async/await
- Documentação JSDoc

### CSS
- BEM Methodology
- Mobile First
- Variáveis CSS
- Prefixos funcionais

### HTML
- Semântico
- Acessível
- Validado W3C
