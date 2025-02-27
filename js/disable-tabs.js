// Função para verificar se o usuário está logado
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Função para desativar as abas para usuários não logados
function disableTabsForNonLoggedInUsers() {
    const tabs = document.querySelectorAll('.details-tabs .tab');
    if (!isUserLoggedIn()) {
        tabs.forEach(tab => {
            const tabName = tab.dataset.tab;
            // Desativa todas as abas exceto "Descrição"
            if (tabName !== 'descricao') {
                tab.classList.add('disabled'); // Adiciona a classe 'disabled'
                tab.setAttribute('aria-disabled', 'true'); // Acessibilidade
            }
        });

        // Adiciona evento de clique para exibir mensagem de alerta
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (tab.classList.contains('disabled')) {
                    alert('Você precisa estar logado para acessar esta seção.');
                }
            });
        });
    } else {
        // Remove a classe 'disabled' se o usuário estiver logado
        tabs.forEach(tab => {
            tab.classList.remove('disabled');
            tab.removeAttribute('aria-disabled');
        });
    }
}

// Inicializa a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    disableTabsForNonLoggedInUsers();
});