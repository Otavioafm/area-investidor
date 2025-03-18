Documentação do Projeto

2.1. CSS
style.css: Estilos globais para o layout principal.
cadastro-login.css: Estilos específicos para as páginas de login e cadastro.
formulario.css: Estilos para o formulário de cadastro de startups.
pagamento.css: Estilos relacionados à página de pagamento.

2.2. JavaScript
main.js: Lógica principal do aplicativo, incluindo renderização de startups, manipulação de eventos e gerenciamento de estado.
auth-popup.js: Gerencia o popup de login e cadastro.
disable-tabs.js: Desativa abas para usuários não logados.
menu.js: Controla o menu hamburguer para dispositivos móveis.
scripts.js: Lógica adicional para validação de formulários e interações específicas.

2.3. HTML
index.html: Página inicial com lista de startups e filtros.
hubLogin.html e hubCadastro.html: Páginas de login e cadastro.
pagamento.html: Página de pagamento com opções de cartão de crédito, débito e PIX.
success.html: Página de sucesso após o envio de formulários ou conclusão de pagamentos.
startup-registro.html e investidor-registro.html: Formulários de cadastro para startups e investidores.

2.4. Outros
package.json e package-lock.json: Configurações do ambiente Node.js para gerenciamento de dependências.
assets/: Diretório para imagens, ícones e outros recursos visuais.


3. Funcionalidades Principais
3.1. Autenticação
Login e Cadastro : Usuários podem acessar suas contas ou criar novas através das páginas hubLogin.html e hubCadastro.html.
Verificação de Login : A função isUserLoggedIn() verifica se o usuário está logado usando o localStorage. Se não estiver logado, certas funcionalidades (como investir ou acessar abas restritas) são bloqueadas.

Código Exemplo:
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

3.2. Listagem de Startups
As startups são exibidas dinamicamente na página inicial (index.html) com base nos dados fornecidos no array startups no arquivo main.js.
Os usuários podem filtrar startups por categoria e visualizar detalhes clicando em uma startup específica.

Código Exemplo:
function renderStartups(filteredStartups = startups) {
    startupsList.innerHTML = filteredStartups.map(startup => `
        <div class="startup-card" data-id="${startup.id}">
            <h3>${startup.name}</h3>
            <p>${startup.category}</p>
        </div>
    `).join('');
}

3.3. Detalhes de Startup
Ao clicar em uma startup, os detalhes são exibidos em uma aba lateral ou modal, dependendo do tamanho da tela.
As abas incluem: "Descrição", "Equipe", "Dados", "Roadmap" e "Vídeo".

Código Exemplo:
function showStartupDetails(id) {
    const startup = startups.find(s => s.id === id);
    if (!startup) return;

    // Renderiza os detalhes da startup
    startupDetails.innerHTML = `
        <h2>${startup.name}</h2>
        <p>${startup.description}</p>
    `;
}

3.4. Investimento
Usuários podem calcular o valor do investimento e escolher uma forma de pagamento (cartão de crédito, débito ou PIX).
O sistema valida o valor mínimo de investimento e exibe um resumo antes de finalizar o pagamento.

Código Exemplo:
function updateInvestmentDetails(amount) {
    const percentage = (amount / TOTAL_INVESTMENT) * TOTAL_PERCENTAGE;
    document.getElementById('percentageResult').textContent = `${percentage.toFixed(2)}%`;
}


3.5. Formulários
Formulários de cadastro de startups e investidores incluem validação de campos obrigatórios e formatação de valores monetários.
Após o envio, o usuário é redirecionado para uma página de sucesso.

Código Exemplo:
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value) {
            isValid = false;
            field.classList.add('error');
        }
    });

    if (isValid) {
        window.location.href = 'success.html';
    }
});

4. Estilos CSS
Os estilos seguem um design moderno e responsivo, com foco em usabilidade e acessibilidade. Algumas classes importantes incluem:
.tab.disabled: Desativa abas para usuários não logados.
.card-actions: Agrupa botões de ação (Curtir, Compartilhar, Investir).
.modal: Define o estilo para modais de detalhes ou popups.

5. Dependências
Vite : Ferramenta de build usada para desenvolvimento e produção.
Esbuild e Rollup : Dependências opcionais para otimização de pacotes.

