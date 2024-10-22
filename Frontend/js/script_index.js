// ACORDION
const accordions = document.querySelectorAll('.accordion');

accordions.forEach((accordion) => {
    accordion.addEventListener('click', () => {
        const body = accordion.querySelector('.accordion-body');
        body.classList.toggle('active');
    });
});

// ANIMATION - PULSE
window.addEventListener('load', function () {
    const ids = ['pulse-1', 'pulse-2', 'pulse-3'];
    let index = 0;

    function animatePulse() {
        const currentSpan = document.getElementById(ids[index]);

        // Adiciona a classe de animação
        currentSpan.classList.add('pulse');

        // Remove a classe de animação após um tempo e passa para o próximo span
        setTimeout(function () {
            currentSpan.classList.remove('pulse');
            index = (index + 1) % ids.length; // Avança para o próximo ou reinicia
            animatePulse(); // Chama a função novamente para o próximo span
        }, 1500); // Duração da animação em milissegundos
    }

    animatePulse(); // Inicia a animação
});

// Função para verificar a URL e exibir o alerta de sucesso
function checkUrlAndAlert() {
    // Obtém os parâmetros da query string da URL
    const urlParams = new URLSearchParams(window.location.search);
    // grada a URL com as queryes
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    switch (true) {
        case success === 'true':
            alert('Cadastrado com SUCESSO!');
            window.location.href = '/';
            break;

        case error === '1':
            alert('Email ou Senha Incorreto!');
            window.location.href = '/';
            break;

        case error === '2':
            alert('Senha Incorreta');
            window.location.href = '/';
            break;

        case error === '3':
            alert('Faça Login para acessar!');
            window.location.href = '/';
            break;

        case error === '4':
            alert('Sessão invalida!');
            window.location.href = '/';
            break;

        default:
            break;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    checkUrlAndAlert();
});
