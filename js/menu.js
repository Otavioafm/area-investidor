const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Função para abrir o menu
function openMenu() {
    navMenu.classList.add('active'); 
    hamburger.classList.add('active'); 
    document.body.classList.add('no-scroll'); 
}

// Função para fechar o menu
function closeMenu() {
    navMenu.classList.remove('active'); 
    hamburger.classList.remove('active'); 
    document.body.classList.remove('no-scroll'); 
}

// Adiciona o evento de clique no hamburger
hamburger.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        closeMenu(); 
    } else {
        openMenu(); 
    }
});

// Fecha o menu quando um botão dentro do menu é clicado
document.querySelectorAll('.nav-menu button').forEach(button => {
    button.addEventListener('click', () => {
        closeMenu(); 
    });
});

// Fecha o menu quando o usuário clica fora do escopo do menu
document.addEventListener('click', (event) => {
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('active')) {
        closeMenu(); 
    }
});

