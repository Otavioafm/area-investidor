document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('paymentForm');
    const creditDebitForm = document.getElementById('creditDebitForm');
    const pixForm = document.getElementById('pixForm');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    const installmentsGroup = document.getElementById('installmentsGroup');
    const investmentAmountInput = document.getElementById('investmentAmount');

    const TOTAL_INVESTMENT = 10000; // R$ 10.000,00
    const MIN_INVESTMENT = 500; // R$ 500,00
    const TOTAL_PERCENTAGE = 14; // 14%
    const SERVICE_FEE_PERCENTAGE = 3; // 5%

    // Format currency input
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // Calculate investment percentage
    function calculateInvestmentPercentage(amount) {
        return (amount / TOTAL_INVESTMENT) * TOTAL_PERCENTAGE;
    }

    // Update investment details
    function updateInvestmentDetails(amount) {
        // Remove any existing error message
        const existingError = investmentAmountInput.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Validate minimum investment
        if (amount < MIN_INVESTMENT) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = `O valor mínimo de investimento é ${formatCurrency(MIN_INVESTMENT)}`;
            investmentAmountInput.parentElement.appendChild(errorMessage);
            return;
        }

        const percentage = calculateInvestmentPercentage(amount);
        const serviceFee = amount * (SERVICE_FEE_PERCENTAGE / 100);
        const total = amount + serviceFee;

        document.getElementById('percentageResult').textContent = percentage.toFixed(2) + '%';
        document.getElementById('investmentValue').textContent = formatCurrency(amount);
        document.getElementById('serviceFee').textContent = formatCurrency(serviceFee);
        document.getElementById('totalValue').textContent = formatCurrency(total);

        // Update installments for credit card
        const installmentsSelect = document.getElementById('installments');
        if (installmentsSelect) {
            installmentsSelect.innerHTML = '';
            for (let i = 1; i <= 6; i++) {
                const installmentValue = total / i;
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `${i}x de ${formatCurrency(installmentValue)} sem juros`;
                installmentsSelect.appendChild(option);
            }
        }
    }

    // Investment amount input handler
    investmentAmountInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        value = parseInt(value) || MIN_INVESTMENT; // Define o valor mínimo se for inválido ou vazio

        // Limitar ao valor máximo permitido
        if (value > TOTAL_INVESTMENT) {
            value = TOTAL_INVESTMENT;
        }

        // Atualizar o valor no campo
        e.target.value = value;

        // Atualizar os detalhes do investimento
        updateInvestmentDetails(value);
    });

    // Format card number
    cardNumberInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = value.match(/.{1,4}/g).join(' ');
        }
        e.target.value = value.substr(0, 19);
    });

    // Format expiry date
    expiryDateInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substr(0, 2) + '/' + value.substr(2);
        }
        e.target.value = value.substr(0, 5);
    });

    // Format CVV
    cvvInput.addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/\D/g, '').substr(0, 3);
    });

    // Toggle payment methods
    const paymentMethods = document.getElementsByName('paymentMethod');

    paymentMethods.forEach(method => {
     method.addEventListener('change', function () {
        console.log('Método selecionado:', this.value); // Debug
        if (this.value === 'pix') {
            creditDebitForm.classList.add('hidden');
            pixForm.classList.remove('hidden');
        } else {
            creditDebitForm.classList.remove('hidden');
            pixForm.classList.add('hidden');

            if (this.value === 'debit') {
                installmentsGroup.classList.add('hidden'); // Oculta parcelas para débito
            } else {
                installmentsGroup.classList.remove('hidden'); // Mostra parcelas para crédito
            }
        }
    });
});

// Garantir estado inicial correto
document.addEventListener('DOMContentLoaded', function () {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    if (selectedMethod === 'debit') {
        installmentsGroup.classList.add('hidden'); // Oculta parcelas para débito
    } else {
        installmentsGroup.classList.remove('hidden'); // Mostra parcelas para crédito
    }
});

    // Copy PIX code
    window.copyPixCode = function () {
        const code = document.querySelector('code').innerText;
        navigator.clipboard.writeText(code).then(() => {
            const button = document.querySelector('.copy-button');
            const originalText = button.innerText;
            button.innerText = 'Copiado!';
            setTimeout(() => {
                button.innerText = originalText;
            }, 2000);
        });
    };

    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        let isValid = true;

        // Validate minimum investment
        const currentAmount = parseInt(investmentAmountInput.value) || 0;
        if (currentAmount < MIN_INVESTMENT) {
            isValid = false;
            return;
        }

        // Validate card fields only for credit/debit methods
        if (selectedMethod !== 'pix') {
            const requiredFields = ['cardNumber', 'expiryDate', 'cvv']; // Removido 'cardName'
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            // Validate installments only for credit card
            if (selectedMethod === 'credit') {
                const installmentsSelect = document.getElementById('installments');
                if (!installmentsSelect.value) {
                    isValid = false;
                    installmentsSelect.classList.add('error');
                } else {
                    installmentsSelect.classList.remove('error');
                }
            }
        }

        if (isValid) {
            window.location.href = 'payment-success.html';
        }
    });

    // Initialize with default values
    updateInvestmentDetails(TOTAL_INVESTMENT);
});