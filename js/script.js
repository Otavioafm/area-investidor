document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('investmentForm');
    const cnpjSection = document.getElementById('cnpjSection');
    const previousInvestmentSection = document.getElementById('previousInvestmentSection');
    const multipleCnpjSection = document.getElementById('multipleCnpjSection');
    const internationalCnpjSection = document.getElementById('internationalCnpjSection');
    const previousActivitySection = document.getElementById('previousActivitySection');

    // Format currency inputs
    const currencyInputs = ['monthlyRevenue', 'annualRevenue', 'previousInvestmentAmount', 'desiredInvestment'];
    currencyInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = (Number(value) / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });
                e.target.value = value;
            });
        }
    });

    // Format CNPJ inputs
    const formatCNPJ = (input) => {
        let value = input.value.replace(/\D/g, '');
        if (value.length <= 14) {
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }
        input.value = value;
    };

    const cnpjInputs = document.querySelectorAll('.cnpj-input');
    cnpjInputs.forEach(input => {
        input.addEventListener('input', () => formatCNPJ(input));
    });

    // Helper function to safely toggle sections
    const toggleSection = (section, show, enableRequired = true) => {
        if (section) {
            if (show) {
                section.classList.remove('hidden');
                if (enableRequired) {
                    enableRequiredFields(section, true);
                }
            } else {
                section.classList.add('hidden');
                if (enableRequired) {
                    enableRequiredFields(section, false);
                }
            }
        }
    };

    // Toggle CNPJ section
    const cnpjRadios = document.getElementsByName('hasCNPJ');
    cnpjRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleSection(cnpjSection, this.value === 'yes');
        });
    });

    // Toggle Multiple CNPJ section
    const multipleCnpjRadios = document.getElementsByName('multipleCNPJ');
    multipleCnpjRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleSection(multipleCnpjSection, this.value === 'yes');
        });
    });

    // Toggle International CNPJ section
    const internationalCnpjRadios = document.getElementsByName('internationalCNPJ');
    internationalCnpjRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleSection(internationalCnpjSection, this.value === 'yes');
        });
    });

    // Toggle Previous Activity section
    const previousActivityRadios = document.getElementsByName('cnpjPreviousUse');
    previousActivityRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleSection(previousActivitySection, this.value === 'yes');
        });
    });

    // Toggle previous investment section
    const investmentRadios = document.getElementsByName('hasInvestment');
    investmentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleSection(previousInvestmentSection, this.value === 'yes');
        });
    });

    // Helper function to toggle required fields
    function enableRequiredFields(section, required) {
        if (section) {
            const inputs = section.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.required = required;
            });
        }
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value) {
                    isValid = false;
                    field.classList.add('error');
                    
                    const existingError = field.parentElement.querySelector('.error-message');
                    if (existingError) {
                        existingError.remove();
                    }
                    
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Este campo é obrigatório';
                    field.parentElement.appendChild(errorMessage);
                } else {
                    field.classList.remove('error');
                    const existingError = field.parentElement.querySelector('.error-message');
                    if (existingError) {
                        existingError.remove();
                    }
                }
            });

            if (isValid) {
                window.location.href = 'success.html';
            }
        });
    }
});