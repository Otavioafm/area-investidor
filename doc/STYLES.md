# Documentação de Estilos - Find Invest

## Variáveis CSS (root)
```css
:root {
  --primary-color: #0066cc;
  --dark-blue: #0B1B2B;
  --white: #ffffff;
  // ...outras variáveis
}
```

## Organização do Código

### 1. Estrutura Base
- `.container`: Container principal (max-width: 1200px)
- `.header-container`: Flex container para cabeçalho
- `.content-wrapper`: Grid 2 colunas (desktop) / 1 coluna (mobile)

### 2. Features Recentes

#### Bottom Sheet Modal (Mobile)
- Implementação de modal deslizante
- Suporte a gestos de arrastar
- Alça de arraste visual
- Transições suaves
- Gerenciamento de scroll

#### Métricas Alinhadas
- Layout flexbox com justify-content
- Alinhamentos específicos por posição
- Responsividade mantida
- Suporte a quebra de texto

#### Otimizações de Performance
- Hardware acceleration
- Prevenção de reflows
- Gestão de memória
- Touch events otimizados

### 3. Breakpoints e Responsividade

#### Mobile (≤ 768px)
```css
/* Bottom Sheet */
.modal {
  position: fixed;
  bottom: 0;
  height: 90vh;
  transform: translateY(100%);
}

/* Métricas */
.startup-metrics {
  gap: 0.5rem;
  padding: 1rem;
}
```

#### Desktop (> 768px)
```css
/* Modal Lateral */
.modal {
  position: fixed;
  right: 2rem;
  width: 400px;
  transform: translateY(-50%);
}

/* Métricas */
.startup-metrics {
  gap: 1rem;
  margin: 1.5rem 0;
}
```

### 4. Gestos e Interações

#### Touch Events
```css
.modal-drag-handle {
  cursor: grab;
  touch-action: none;
}

.modal-content {
  -webkit-overflow-scrolling: touch;
}
```

#### Scroll Lock
```css
body.modal-open {
  overflow: hidden;
  position: fixed;
  width: 100%;
}
```

### 5. Hierarquia de Z-index
```css
.modal: 9999
.modal-header: 10000
.modal-close: 10002
.modal-drag-handle: 10003
```

## Estrutura do CSS

### 1. Layout Base
- `.container`: Container principal (max-width: 1200px)
- `.header-container`: Flex container para cabeçalho
- `.content-wrapper`: Grid 2 colunas (desktop) / 1 coluna (mobile)

### 2. Cards de Startup
```css
.startup-card {
  /* Card básico com sombra e hover */
}

.startup-header {
  /* Flex container para logo e info */
}

.startup-metrics {
  /* Grid 3 colunas para métricas */
}
```

### 3. Modal/Bottom Sheet (Mobile)
- Acionado em telas < 768px
- Slide up animation
- Sticky header
- Scroll interno
- Suporte a gestos

### 4. Responsividade

#### Desktop (> 768px)
- Grid layout 2 colunas
- Modal lateral fixo
- Scroll suave
- Hover effects

#### Mobile (≤ 768px)
- Layout single column
- Bottom sheet modal
- Touch gestures
- Área de toque ampliada

### 5. Componentes Principais

#### Botões
```css
.button {
  /* Estilo base */
}

.primary-button {
  /* Variação principal */
}

.secondary-button {
  /* Variação secundária */
}
```

#### Cards
```css
.startup-card {
  /* Card container */
}

.metric {
  /* Indicadores/métricas */
}
```

#### Modais
```css
.modal {
  /* Base modal/bottom sheet */
}

.modal-header {
  /* Cabeçalho fixo */
}

.modal-content {
  /* Conteúdo scrollável */
}
```

### 6. Animações
- Slide up (bottom sheet)
- Fade in/out
- Hover transitions
- Scroll smooth

### 7. Media Queries
```css
/* Mobile First */
@media (min-width: 768px) {
  /* Desktop styles */
}

/* Ajustes específicos */
@media (max-width: 344px) {
  /* Small phones */
}
```

### 8. Utilitários
- `.hidden`: Display none
- `.active`: Estado ativo
- `.disabled`: Estado desabilitado
- `.no-scroll`: Bloqueia scroll

### 9. Performance
- Transform GPU accelerated
- Will-change otimizado
- Throttled animations
- Touch-action manipulation

### 10. Acessibilidade
- Contraste adequado
- Touch targets >= 44px
- Focus states
- ARIA attributes

## Boas Práticas

### Organização
1. Variáveis globais
2. Reset/Normalize
3. Layout base
4. Componentes
5. Utilitários
6. Media queries

### Nomenclatura
- BEM methodology
- Prefixos funcionais
- Nomes semânticos

### Performance
- Minimize nesting
- Reutilize classes
- Evite !important
- Optimize reflows

### Mobile
- Touch targets adequados
- Gestos naturais
- Feedback visual
- Suporte a notch

## Manutenção

### Adicionando Novos Estilos
1. Seguir estrutura existente
2. Documentar alterações
3. Testar responsividade
4. Validar performance

### Debugging
- DevTools mobile preview
- Layout debugging
- Performance profiling
- Cross-browser testing
