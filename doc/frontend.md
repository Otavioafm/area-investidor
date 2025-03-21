# Documentação Frontend

## Arquivos Principais

### HTML
- `index.html`: Página principal
- `hubLogin.html`: Página de login
- `hubCadastro.html`: Página de cadastro

### CSS
- `style.css`: Estilos globais e componentes

### JavaScript
1. `main.js`: 
   - Inicialização da aplicação
   - Gerenciamento de estado global

2. `modal.js`:
   - Controle do modal de detalhes
   - Sistema de scroll vertical
   - Animações suaves

3. `search.js`:
   - Sistema de busca
   - Filtros de categoria
   - Renderização de resultados

4. `tab-scroll.js`:
   - Scroll horizontal suave nas tabs
   - Navegação por touch e mouse
   - Observadores de mudança

5. `auth-popup.js`:
   - Controle de popups de autenticação
   - Verificação de login

## Componentes

### Modal
```javascript
// Exemplo de uso do modal
const modal = document.querySelector('.modal');
modal.classList.add('show'); // Abre o modal
modal.classList.remove('show'); // Fecha o modal
```

### Tabs
```javascript
// Exemplo de uso das tabs
const tab = document.querySelector('.tab');
tab.addEventListener('click', () => {
  // Ativa a tab
  tab.classList.add('active');
  // Scroll suave
  scrollToTab(tab);
});
```

### Search
```javascript
// Exemplo de busca
searchInput.addEventListener('input', (e) => {
  const results = searchStartups(e.target.value);
  displayStartups(results);
});
```

## Responsividade
- Mobile First
- Breakpoints principais:
  - 768px: Tablets/Mobile
  - 344px: Mobile pequeno
