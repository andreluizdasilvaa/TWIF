window.addEventListener('load', function () {
            const ids = ["pulse-1", "pulse-2", "pulse-3"];
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