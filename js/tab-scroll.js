document.addEventListener('DOMContentLoaded', () => {
    function setupTabScroll(tabsContainerSelector) {
        const tabsContainer = document.querySelector(tabsContainerSelector);
        if (!tabsContainer) return;

        const tabs = tabsContainer.querySelectorAll('.tab');
        let activeTab = tabsContainer.querySelector('.tab.active');

        function scrollToTab(tab) {
            if (!tab || !tabsContainer) return;
            
            // Calcula as posições
            const containerWidth = tabsContainer.offsetWidth;
            const tabWidth = tab.offsetWidth;
            const tabLeft = tab.offsetLeft;
            
            // Centraliza a tab
            const targetScroll = tabLeft - (containerWidth - tabWidth) / 2;
            
            // Scroll suave
            tabsContainer.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }

        // Controle do scroll horizontal
        let isScrolling = false;
        tabsContainer.addEventListener('wheel', (e) => {
            if (!isScrolling) {
                isScrolling = true;
                requestAnimationFrame(() => {
                    tabsContainer.scrollLeft += e.deltaY;
                    isScrolling = false;
                });
            }
            e.preventDefault();
        }, { passive: false });

        // Click handler para tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (activeTab) {
                    activeTab.classList.remove('active');
                }
                tab.classList.add('active');
                activeTab = tab;

                // Scroll imediato para a tab
                requestAnimationFrame(() => {
                    scrollToTab(tab);
                });

                // Mostra conteúdo correspondente
                const contentId = tab.getAttribute('data-tab');
                const contents = document.querySelectorAll('[data-content]');
                contents.forEach(content => {
                    content.style.display = 
                        content.getAttribute('data-content') === contentId 
                            ? 'block' 
                            : 'none';
                });
            });
        });

        // Scroll inicial para tab ativa
        if (activeTab) {
            requestAnimationFrame(() => {
                scrollToTab(activeTab);
            });
        }

        // Observer para mudanças na visibilidade
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && activeTab) {
                        scrollToTab(activeTab);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(tabsContainer);
    }

    // Setup para todos os containers de tabs
    setupTabScroll('.details-tabs');
    
    // Observa mudanças no DOM para novos modais
    const observer = new MutationObserver(() => {
        document.querySelectorAll('.details-tabs').forEach(container => {
            if (!container.hasAttribute('data-scroll-initialized')) {
                setupTabScroll('.details-tabs');
                container.setAttribute('data-scroll-initialized', 'true');
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
