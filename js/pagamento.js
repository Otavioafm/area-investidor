document.addEventListener('DOMContentLoaded', function () {
    // Obtém parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const startupData = {
        id: params.get('startupId'),
        name: decodeURIComponent(params.get('name')),
        logo: decodeURIComponent(params.get('logo')),
        category: decodeURIComponent(params.get('category')),
        investment: decodeURIComponent(params.get('investment')),
        equity: decodeURIComponent(params.get('equity'))
    };

    // Atualiza interface com dados da startup
    const startupInfo = document.querySelector('.startup-info');
    const calculatorInfo = document.querySelector('.calculator-info');
    
    if (startupInfo) {
        startupInfo.querySelector('h3').textContent = startupData.name;
        startupInfo.querySelector('img').src = startupData.logo;
        startupInfo.querySelector('.tag').textContent = startupData.category;
    }

    if (calculatorInfo) {
        calculatorInfo.querySelector('p').textContent = 
            `Valor total da oferta: ${startupData.investment} (${startupData.equity} da startup)`;
    }

    // Constantes
    const SERVICE_FEE = 5; // Taxa fixa de R$ 5,00
    const MIN_INVESTMENT = 500;

    // Formata valores monetários
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // Atualiza detalhes do investimento
    function updateInvestmentDetails(amount) {
        const investmentAmountInput = document.getElementById('investmentAmount');
        
        // Remove mensagens de erro anteriores
        const existingError = investmentAmountInput?.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Validação do valor mínimo
        if (amount < MIN_INVESTMENT) {
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = `Valor mínimo de investimento: ${formatCurrency(MIN_INVESTMENT)}`;
            investmentAmountInput?.parentElement.appendChild(error);
            return;
        }

        // Atualiza valores na interface
        document.getElementById('investmentValue').textContent = formatCurrency(amount);
        document.getElementById('serviceFee').textContent = formatCurrency(SERVICE_FEE);
        document.getElementById('totalValue').textContent = formatCurrency(amount + SERVICE_FEE);

        // Calcula porcentagem proporcional do equity
        const totalInvestment = parseFloat(startupData.investment.replace(/[^0-9.-]+/g, ''));
        const totalEquity = parseFloat(startupData.equity);
        const percentage = (amount / totalInvestment) * totalEquity;
        
        document.getElementById('percentageResult').textContent = percentage.toFixed(2) + '%';

        // Atualiza opções de parcelamento
        updateInstallments(amount + SERVICE_FEE);
    }

    // Atualiza opções de parcelamento
    function updateInstallments(total) {
        const installmentsSelect = document.getElementById('installments');
        if (!installmentsSelect) return;

        installmentsSelect.innerHTML = '';
        for (let i = 1; i <= 6; i++) {
            const value = total / i;
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}x de ${formatCurrency(value)} sem juros`;
            installmentsSelect.appendChild(option);
        }
    }

    // Event Listeners
    const investmentInput = document.getElementById('investmentAmount');
    if (investmentInput) {
        investmentInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value.replace(/\D/g, '')) || 0;
            updateInvestmentDetails(value);
        });
    }

    // Form submission
    const form = document.getElementById('paymentForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                startupId: startupData.id,
                amount: parseFloat(document.getElementById('investmentAmount').value),
                paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
                installments: document.getElementById('installments')?.value || 1
            };

            try {
                // Aqui você faria a chamada para sua API
                // const response = await fetch('/api/payments', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(formData)
                // });
                
                // Simulando sucesso
                window.location.href = 'payment-success.html';
            } catch (error) {
                console.error('Erro ao processar pagamento:', error);
                alert('Erro ao processar pagamento. Tente novamente.');
            }
        });
    }

    // Inicialização
    const initialAmount = document.getElementById('investmentAmount')?.value || MIN_INVESTMENT;
    updateInvestmentDetails(parseInt(initialAmount));
});