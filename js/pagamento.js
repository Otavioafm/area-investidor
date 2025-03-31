document.addEventListener('DOMContentLoaded', () => {
    // Recupera dados da URL e decodifica
    const params = new URLSearchParams(window.location.search);
    const startupData = {
        id: params.get('id'),
        nome: decodeURIComponent(params.get('nome') || ''),
        logo: decodeURIComponent(params.get('logo') || ''),
        categoria: decodeURIComponent(params.get('categoria') || ''),
        investimento: decodeURIComponent(params.get('investimento') || ''),
        equity: decodeURIComponent(params.get('equity') || '')
    };

    // Verifica se os dados necessários estão presentes
    if (!startupData.nome || !startupData.investimento) {
        alert('Dados da startup não encontrados');
        window.location.href = 'index.html';
        return;
    }

    // Atualiza informações na página
    const startupInfo = document.querySelector('.startup-info');
    if (startupInfo) {
        startupInfo.querySelector('h3').textContent = startupData.nome;
        startupInfo.querySelector('img').src = startupData.logo;
        startupInfo.querySelector('.tag').textContent = startupData.categoria;
    }

    const calculatorInfo = document.querySelector('.calculator-info');
    if (calculatorInfo) {
        calculatorInfo.querySelector('p').textContent = 
            `Valor total da oferta: ${startupData.investimento} (${startupData.equity} da startup)`;
    }

    // Controle das formas de pagamento
    const paymentMethods = document.querySelectorAll('.payment-option input');
    const creditDebitForm = document.getElementById('creditDebitForm');
    const pixForm = document.getElementById('pixForm');

    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            const method = e.target.value;
            
            // Mostra/esconde formulários
            creditDebitForm.classList.toggle('hidden', method === 'pix');
            pixForm.classList.toggle('hidden', method !== 'pix');
            
            // Ajusta texto do botão
            const submitButton = document.getElementById('submitButton');
            if (submitButton) {
                submitButton.textContent = method === 'pix' ? 'Gerar QR Code PIX' : 'Finalizar Pagamento';
            }
        });
    });

    // Máscara para campos do cartão
    const cardNumber = document.getElementById('cardNumber');
    cardNumber?.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
    });

    const expiryDate = document.getElementById('expiryDate');
    expiryDate?.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0,2) + '/' + value.substring(2);
        }
        e.target.value = value;
    });

    // Calcula valor em tempo real
    const investmentAmount = document.getElementById('investmentAmount');
    investmentAmount?.addEventListener('input', (e) => {
        // Permite digitação livre
        const value = e.target.value;
        
        // Remove caracteres não numéricos, exceto ponto e vírgula
        const cleanValue = value.replace(/[^\d.,]/g, '');
        
        // Converte para número
        const numValue = parseFloat(cleanValue.replace(',', '.')) || 0;
        
        // Atualiza cálculos
        calculateInvestment();
    });

    function parseInvestmentValue(value) {
        // Remove 'R$', espaços, 'K' e 'k' e converte para número
        return parseFloat(value.replace(/[R$\s.k]/gi, '').replace(',', '.')) * 
               (value.toLowerCase().includes('k') ? 1000 : 1);
    }

    function calculateInvestment() {
        const inputValue = investmentAmount.value;
        const totalInvestment = parseInvestmentValue(startupData.investimento);
        const equityPercentage = parseFloat(startupData.equity);
        
        // Limita o número de dígitos baseado no valor máximo da captação
        const maxDigits = Math.floor(totalInvestment).toString().length;
        
        // Se o valor digitado tiver mais dígitos que o permitido, trunca
        if (inputValue.length > maxDigits) {
            investmentAmount.value = inputValue.slice(0, maxDigits);
        }

        const amount = parseFloat(investmentAmount.value) || 0;

        // Remove mensagem de erro anterior
        const oldError = document.querySelector('.error-message');
        if (oldError) oldError.remove();

        // Validação de valores
        if (amount < 500) {
            showError('O valor mínimo de investimento é R$ 500,00');
            updateValues(amount, totalInvestment, equityPercentage);
            return;
        }

        if (amount > totalInvestment) {
            showError(`O valor máximo de investimento é ${formatCurrency(totalInvestment)}`);
            updateValues(totalInvestment, totalInvestment, equityPercentage);
            return;
        }

        updateValues(amount, totalInvestment, equityPercentage);
    }

    function updateValues(amount, totalInvestment, equityPercentage) {
        // Calcula equity proporcional
        const proportion = amount / totalInvestment;
        const newEquity = (proportion * equityPercentage).toFixed(2);
        
        // Atualiza displays
        document.getElementById('percentageResult').textContent = `${newEquity}%`;
        document.getElementById('investmentValue').textContent = formatCurrency(amount);
        document.getElementById('totalValue').textContent = formatCurrency(amount);
        
        // Atualiza parcelas
        updateInstallments(amount);
    }

    function showError(message) {
        // Remove mensagem de erro anterior se existir
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    
        // Cria nova mensagem de erro
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        const container = investmentAmount.parentElement;
        container.appendChild(errorMessage);
    }

    // Atualiza o input para aceitar apenas números e limitar dígitos
    investmentAmount?.addEventListener('input', (e) => {
        let value = e.target.value;
        
        // Remove qualquer caractere que não seja número
        value = value.replace(/\D/g, '');
        
        const totalInvestment = parseInvestmentValue(startupData.investimento);
        const maxDigits = Math.floor(totalInvestment).toString().length;
        
        // Limita o número de dígitos
        if (value.length > maxDigits) {
            value = value.slice(0, maxDigits);
        }
        
        // Atualiza o valor do input
        e.target.value = value;
        
        if (value === '') {
            document.getElementById('percentageResult').textContent = '0%';
            document.getElementById('investmentValue').textContent = formatCurrency(0);
            document.getElementById('totalValue').textContent = formatCurrency(0);
            return;
        }

        calculateInvestment();
    });

    // Atualiza o event listener do input
    investmentAmount?.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value === '') return;

        // Converte para número e valida
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            e.target.value = 500; // Valor mínimo se inválido
        }
        
        calculateInvestment();
    });

    // Atualiza o event listener do input para melhor controle
    investmentAmount?.addEventListener('input', (e) => {
        const value = e.target.value;
        
        // Permite que o campo fique vazio temporariamente
        if (value === '') {
            document.getElementById('percentageResult').textContent = '0%';
            document.getElementById('investmentValue').textContent = formatCurrency(0);
            document.getElementById('totalValue').textContent = formatCurrency(0);
            
            // Remove mensagem de erro quando o campo estiver vazio
            const errorMsg = document.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
            return;
        }

        // Remove caracteres não numéricos
        const cleanValue = value.replace(/\D/g, '');
        const numValue = parseInt(cleanValue);

        // Validação do valor mínimo e máximo
        const totalInvestment = parseInvestmentValue(startupData.investimento);

        if (numValue < 500) {
            showError('O valor mínimo de investimento é R$ 500,00');
        } else if (numValue > totalInvestment) {
            showError(`O valor máximo de investimento é ${formatCurrency(totalInvestment)}`);
        } else {
            // Remove mensagem de erro se existir
            const errorMsg = document.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        }

        // Permite a digitação livre e atualiza os cálculos
        calculateInvestment();
    });

    function updateTotalValue(amount) {
        document.getElementById('investmentValue').textContent = formatCurrency(amount);
        document.getElementById('totalValue').textContent = formatCurrency(amount);
        
        // Atualiza parcelas
        updateInstallments(amount);
    }

    // Atualiza o HTML para remover a taxa de serviço
    const serviceFeeRow = document.querySelector('.detail-row:nth-child(2)');
    if (serviceFeeRow) {
        serviceFeeRow.remove();
    }

    function updateInstallments(total) {
        const installments = document.getElementById('installments');
        if (!installments) return;

        installments.innerHTML = '';
        for (let i = 1; i <= 12; i++) {
            const value = total / i;
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}x de ${formatCurrency(value)} ${i <= 6 ? 'sem juros' : 'com juros'}`;
            installments.appendChild(option);
        }
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // Processa pagamento
    document.getElementById('paymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        const amount = parseFloat(document.getElementById('investmentAmount').value);
        
        // Validações
        if (amount < 500) {
            showError('O valor mínimo de investimento é R$ 500,00');
            return;
        }

        const totalInvestment = parseInvestmentValue(startupData.investimento);
        if (amount > totalInvestment) {
            showError(`O valor máximo de investimento é ${formatCurrency(totalInvestment)}`);
            return;
        }

        // Tratamento específico para PIX
        if (paymentMethod === 'pix') {
            try {
                const params = new URLSearchParams({
                    valor: amount,
                    startup: startupData.nome,
                    investimento: formatCurrency(amount),
                    timestamp: Date.now()
                });
                
                // Redirecionamento direto para a página de PIX
                window.location.href = `pix-payment.html?${params.toString()}`;
            } catch (error) {
                console.error('Erro ao redirecionar:', error);
                alert('Erro ao processar pagamento. Tente novamente.');
            }
            return;
        }

        // Processamento para outros métodos de pagamento
        processCardPayment(amount);
    });

    // Inicialização
    calculateInvestment();
});

// Função global para submissão do pagamento
window.handlePaymentSubmit = function() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const amount = parseFloat(document.getElementById('investmentAmount').value) || 0;
    
    // Validações
    if (amount < 500) {
        showError('O valor mínimo de investimento é R$ 500,00');
        return;
    }

    const totalInvestment = parseInvestmentValue(startupData.investimento);
    if (amount > totalInvestment) {
        showError(`O valor máximo de investimento é ${formatCurrency(totalInvestment)}`);
        return;
    }

    // Tratamento específico para PIX
    if (paymentMethod === 'pix') {
        try {
            const params = new URLSearchParams({
                valor: amount,
                startup: startupData.nome,
                investimento: formatCurrency(amount),
                timestamp: Date.now()
            });
            
            // Redirecionamento direto para a página de PIX
            window.location.href = `pix-payment.html?${params.toString()}`;
        } catch (error) {
            console.error('Erro ao redirecionar:', error);
            alert('Erro ao processar pagamento. Tente novamente.');
        }
        return;
    }

    // Processamento para outros métodos de pagamento
    processCardPayment(amount);
}

// Remove o event listener antigo do form
const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
    paymentForm.onsubmit = function(e) {
        e.preventDefault();
    };
}

// Substitui todas as funções de processamento de pagamento por uma única função global
window.handlePayment = function() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const amount = parseFloat(document.getElementById('investmentAmount').value) || 0;
    const equity = document.getElementById('percentageResult').textContent;
    const startup = document.querySelector('.startup-info h3').textContent;
    
    // Validações antes do envio
    if (amount < 500) {
        showError('O valor mínimo de investimento é R$ 500,00');
        return;
    }

    const totalInvestment = parseInvestmentValue(startupData.investimento);
    if (amount > totalInvestment) {
        showError(`O valor máximo de investimento é ${formatCurrency(totalInvestment)}`);
        return;
    }

    // Cria parâmetros para a URL
    const params = new URLSearchParams({
        startup: encodeURIComponent(startup),
        valor: encodeURIComponent(formatCurrency(amount)),
        equity: encodeURIComponent(equity)
    });

    // Redirecionamento com base no método de pagamento
    if (paymentMethod === 'pix') {
        window.location.href = `pix-payment.html?${params.toString()}`;
    } else {
        window.location.href = `payment-success.html?${params.toString()}`;
    }
}

// Remove código duplicado de event listeners do form
if (paymentForm) {
    paymentForm.onsubmit = function(e) {
        e.preventDefault();
    };
}