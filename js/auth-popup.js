// Função para verificar se o usuário está logado
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Função para abrir o popup
function openPopup() {
    document.getElementById('popupOverlay').classList.add('active');
    document.getElementById('loginPopup').classList.add('active');
}







// Função para lidar com o clique no botão "Investir"
function handleInvestButtonClick(event) {
    const startupId = event.currentTarget.dataset.id; // Obtém o ID da startup

    if (!isUserLoggedIn()) {
        event.preventDefault(); // Impede o comportamento padrão
        openPopup(); // Abre o popup
    } else {
        // Redireciona para pagamento.html apenas se o usuário estiver logado
        window.location.href = `pagamento.html?startupId=${startupId}`;
    }
}

// Adicionar evento de clique ao botão "Investir"
document.querySelectorAll('.invest-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault(); // Impede o comportamento padrão
        handleInvestButtonClick(e); // Chama a função para lidar com o clique
    });
});

// Função para verificar se o usuário está logado
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

document.querySelectorAll('.invest-button').forEach(button => {
    if (!isUserLoggedIn()) {
        button.classList.add('disabled');
    } else {
        button.classList.remove('disabled');
    }
});





// Função para fechar o popup
function closePopup() {
    document.getElementById('popupOverlay').classList.remove('active');
    document.getElementById('loginPopup').classList.remove('active');
}



// Função para lidar com o clique no botão "Like"
function handleLikeClick(event) {
    const startupId = parseInt(event.currentTarget.dataset.id); // Obtém o ID da startup
    if (!isUserLoggedIn()) {
        event.stopPropagation(); // Impede a propagação do evento
        openPopup();
    } else {
        toggleLike(startupId); // Executa a lógica de curtir
    }
}

// Função para alternar o estado de "like"
function toggleLike(id) {
    if (likedStartups.has(id)) {
        likedStartups.delete(id);
    } else {
        likedStartups.add(id);
    }
    renderStartups(); // Atualiza a lista de startups
}

// Função para lidar com o clique no botão "Cadastrar Startup"
function handleStartupClick(event) {
    if (!isUserLoggedIn()) {
        event.preventDefault(); // Impede o comportamento padrão
        openPopup();
    } else {
        window.location.href = 'formulario.html'; // Redireciona para o formulário
    }
}

// Função para bloquear as abas para usuários não logados
function blockTabsForNonLoggedInUsers() {
    const tabs = document.querySelectorAll('.details-tabs .tab');
    if (!isUserLoggedIn()) {
        tabs.forEach(tab => {
            if (tab.dataset.tab !== 'descricao') { // Mantém apenas a aba "Descrição" ativa
                tab.classList.add('disabled'); // Adiciona a classe 'disabled'
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
        tabs.forEach(tab => tab.classList.remove('disabled')); // Remove a classe 'disabled' se o usuário estiver logado
    }
}

// Função para lidar com a troca de abas
function setupTabSwitching() {
    const tabs = document.querySelectorAll('.details-tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('disabled')) return; // Impede a troca de aba se estiver desativada

            // Remove a classe 'active' de todas as abas
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Exibe o conteúdo correspondente à aba selecionada
            const activeTab = tab.dataset.tab;
            document.querySelectorAll('[data-content]').forEach(content => {
                content.style.display = content.dataset.content === activeTab ? 'block' : 'none';
            });
        });
    });
}

// Eventos para o Popup
document.addEventListener('DOMContentLoaded', () => {
    // Fechar o popup ao clicar no botão de fechar ou no overlay
    document.getElementById('closePopup')?.addEventListener('click', closePopup);
    document.getElementById('popupOverlay')?.addEventListener('click', (event) => {
        if (event.target === document.getElementById('popupOverlay')) {
            closePopup();
        }
    });

    // Adiciona eventos aos botões "Cadastrar Startup"
    const startupBtn = document.querySelector('.startup-btn');
    if (startupBtn) {
        startupBtn.addEventListener('click', (e) => {
            handleStartupClick(e); // Passa o evento para a função
        });
    }

    // Adiciona eventos aos botões "Investir"
    const investButtons = document.querySelectorAll('.invest-button');
    if (investButtons) {
        investButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                if (!isUserLoggedIn()) {
                    e.preventDefault();
                    openPopup();
                }
            });
        });
    }

    // Adiciona eventos aos botões "Like"
    const likeButtons = document.querySelectorAll('.like-button');
    if (likeButtons) {
        likeButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                handleLikeClick(e); // Passa o evento para a função
            });
        });
    }

    // Redirecionar para hubLogin.html ao clicar no botão "Login" do popup
    const popupLoginButton = document.getElementById('popupLoginButton');
    if (popupLoginButton) {
        popupLoginButton.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o comportamento padrão do link
            window.location.href = 'hubLogin.html'; // Redireciona para a página de login
        });
    }

    // Redirecionar para hubCadastro.html ao clicar no botão "Cadastro" do popup
    const popupCadastroButton = document.getElementById('popupCadastroButton');
    if (popupCadastroButton) {
        popupCadastroButton.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o comportamento padrão do link
            window.location.href = 'hubCadastro.html'; // Redireciona para a página de cadastro
        });
    }

    // Bloqueia as abas para usuários não logados
    blockTabsForNonLoggedInUsers();

    // Configura a troca de abas
    setupTabSwitching();
});