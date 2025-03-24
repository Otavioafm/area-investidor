document.addEventListener('DOMContentLoaded', () => {
    // Recupera parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const valor = params.get('valor');
    const startup = params.get('startup');

    // Atualiza informações na página
    document.title = `Pagamento PIX - ${startup}`;
    
    // Configura o timer
    let timeLeft = 5 * 60;
    const timerElement = document.getElementById('timer');
    
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            location.reload(); // Recarrega a página quando o timer acabar
        } else {
            timeLeft--;
        }
    }

    // Inicia o timer
    setInterval(updateTimer, 1000);
    
    // Configurar botão de cópia
    const copyButton = document.getElementById('copyButton');
    const pixCode = document.getElementById('pixCode');
    
    copyButton?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(pixCode.textContent);
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy"></i> Copiar código';
            }, 2000);
        } catch (err) {
            console.error('Erro ao copiar:', err);
        }
    });

    // Gera QR Code usando uma API pública (apenas para demonstração)
    const qrCode = document.getElementById('qrCode');
    if (qrCode) {
        const qrData = `PIX:${valor}:${startup}:${Date.now()}`;
        qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
    }
});
