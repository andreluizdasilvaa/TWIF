export default function voltarTopoFeed() {
    const btnVoltarTopo = document.querySelector('.container_btn_vTopo');

    if (!btnVoltarTopo) return;

    btnVoltarTopo.style.opacity = '0';
    // btnVoltarTopo.style.transition = 'opacity 0.5s ease-in-out';

    // Função para mostrar ou esconder o botão com efeito suave
    function toggleButtonVisibility() {
        if (window.scrollY > 300) { // Ajuste o valor conforme necessário
            btnVoltarTopo.style.opacity = '1';
        } else {
            btnVoltarTopo.style.opacity = '0';
        }
    }

    // Função para rolar para o topo suavemente
    function scrollToTop() {
        let scrollStep = -window.scrollY / 10; // Ajuste para controlar a velocidade
        let scrollInterval = setInterval(() => {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15); // Intervalo para suavizar a rolagem
    }

    // Adiciona os eventos
    window.addEventListener('scroll', toggleButtonVisibility);
    btnVoltarTopo.addEventListener('click', scrollToTop);

    // Inicializa o estado do botão
    toggleButtonVisibility();
}