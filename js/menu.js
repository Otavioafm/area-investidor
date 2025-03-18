const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const menuButtons = document.querySelectorAll('.nav-menu button');

// Função para verificar se o usuário está logado
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Função para sair
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.reload();
}

// Função para atualizar o menu baseado no estado de login
function updateMenu() {
    const isLogged = isUserLoggedIn();
    const loginBtn = document.querySelector('.login-btn');
    const cadastroBtn = document.querySelector('.cadastro-btn');
    const logoutBtn = document.querySelector('.logout-btn');

    if (isLogged) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (cadastroBtn) cadastroBtn.style.display = 'none';
        if (!logoutBtn) {
            const newLogoutBtn = document.createElement('button');
            newLogoutBtn.className = 'logout-btn';
            newLogoutBtn.textContent = 'Sair';
            newLogoutBtn.onclick = logout;
            navMenu.appendChild(newLogoutBtn);
        }
    } else {
        if (loginBtn) loginBtn.style.display = '';
        if (cadastroBtn) loginBtn.style.display = '';
        if (logoutBtn) logoutBtn.remove();
    }
}

// Função para abrir o menu
function openMenu() {
    hamburger.classList.add('active');
    navMenu.classList.add('active');
    document.body.classList.add('no-scroll');
}

// Função para fechar o menu
function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

// Event listeners
hamburger.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Fecha o menu quando um botão é clicado
menuButtons.forEach(button => {
    button.addEventListener('click', closeMenu);
});

// Fecha o menu quando clicar fora
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
    }
});

// Inicializa o menu quando o DOM carrega
document.addEventListener('DOMContentLoaded', updateMenu);

