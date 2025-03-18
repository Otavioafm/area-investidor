# Documentação CSS - Find Invest

## Estrutura de Variáveis
```css
:root {
  --primary-color: #0066cc;
  --dark-blue: #0B1B2B;
  // ...outras variáveis
}
```

## Breakpoints
- Mobile: <= 768px
- Desktop: > 768px

## Componentes Principais

### Header
```css
.header-container {
  /* Desktop: Layout horizontal */
  /* Mobile: Layout compacto com menu hamburger */
}
```
Localização: Início do CSS, após variáveis globais

### Cards
```css
.startup-card {
  /* Estrutura base do card */
}
```
Localização: Seção de componentes principais

### Métricas
```css
.startup-metrics {
  /* Desktop: Grid de 3 colunas */
  /* Mobile: Layout flexbox responsivo */
}
```
Localização: Dentro da estrutura do card

## Componentes Atualizados

### Métricas no Card
```css
.startup-metrics {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.metric {
  text-align: center;
  flex: 1;
}

.metric:first-child { text-align: left; }    /* Investimento */
.metric:nth-child(2) { text-align: center; } /* Equity */
.metric:last-child { text-align: right; }    /* Investidores */
```

### Modal/Bottom Sheet

### Desktop
```css
.modal {
  /* Posicionamento fixo lateral */
  /* Scroll independente */
}
```

### Mobile
```css
@media (max-width: 768px) {
  .modal {
    /* Bottom sheet com gestos */
    /* Header fixo */
  }
}
```

### Modal Mobile (Bottom Sheet)
```css
@media (max-width: 768px) {
  .modal {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 90vh;
    border-radius: 20px 20px 0 0;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  .modal.show {
    transform: translateY(0);
  }

  .modal-drag-handle {
    position: absolute;
    top: 0;
    left: 50%;
    width: 40px;
    height: 4px;
    background-color: #e0e0e0;
  }
}
```

## Sistemas de Grid

### Desktop
- Grid de duas colunas para layout principal
- Flexbox para alinhamentos internos

### Mobile 
- Layout em coluna única
- Bottom sheet para detalhes

## Animações
```css
/* Transições Padrão */
.transition-base {
  transition: all 0.3s ease;
}

/* Animações de Entrada */
@keyframes slideIn {
  /* Definições de keyframes */
}
```

## Estrutura de Media Queries

### Mobile First
```css
/* Base styles (mobile) */
.component { }

/* Desktop styles */
@media (min-width: 769px) { }
```

## Elementos Críticos

### Overflow
- `.startup-logo`: Controle de aspect ratio
- `.modal-content`: Scroll interno
- `.startup-details`: Sticky positioning

### Z-index Hierarchy
1. Modal overlay: 9999
2. Modal header: 10000
3. Close button: 10002
4. Drag handle: 10003

## Best Practices

### Desktop
- Uso de grid para layouts complexos
- Scroll behavior suave
- Hover states

### Mobile
- Touch targets mínimos de 44px
- Safe area insets
- Gestos nativos
- Bottom sheet behavior

## Performance
- Hardware acceleration via transform
- Will-change para animações
- Throttle em eventos de scroll
- Contain property para isolamento

### Performance e Otimizações
```css
.modal {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
  -webkit-overflow-scrolling: touch;
}

body.modal-open {
  overflow: hidden;
  position: fixed;
  width: 100%;
}
```

### iOS Safe Areas
```css
.modal-content {
  padding-bottom: env(safe-area-inset-bottom);
}
```

## Namespace Classes

### Prefixos
- `.startup-`: Componentes relacionados a startups
- `.modal-`: Componentes do modal
- `.metric-`: Componentes de métricas

## Troubleshooting

### Mobile Scroll Issues
```css
body.modal-open {
  overflow: hidden;
  position: fixed;
  width: 100%;
}
```

### iOS Safari Fixes
```css
.modal-content {
  -webkit-overflow-scrolling: touch;
}
```

## CSS Custom Properties
```css
--scroll-offset
--safe-area-inset-bottom
```
Usados para cálculos dinâmicos em JavaScript

## Manutenção

### Ordem de Propriedades
1. Positioning
2. Box model
3. Typography
4. Visual
5. Animation
6. Mobile overrides
