// ACORDION
const accordions = document.querySelectorAll(".accordion");

accordions.forEach((accordion) => {
  accordion.addEventListener("click", () => {
    const body = accordion.querySelector(".accordion-body");
    body.classList.toggle("active");
  });
});

// ANIMATION - PULSE
window.addEventListener("load", function () {
  const ids = ["pulse-1", "pulse-2", "pulse-3"];
  let index = 0;

  function animatePulse() {
    const currentSpan = document.getElementById(ids[index]);

    // Adiciona a classe de animação
    currentSpan.classList.add("pulse");

    // Remove a classe de animação após um tempo e passa para o próximo span
    setTimeout(function () {
      currentSpan.classList.remove("pulse");
      index = (index + 1) % ids.length; // Avança para o próximo ou reinicia
      animatePulse(); // Chama a função novamente para o próximo span
    }, 1500); // Duração da animação em milissegundos
  }

  animatePulse(); // Inicia a animação
});

// Verifica se o parametro de sucesso está presente na URL e exibe um alerta
function checkUrlAndAlert() {
  // Obtém a URL atual da página
  const currentUrl = window.location.href;

  // Define a URL para comparar
  const targetUrl = "/?success=true";

  // Verifica se a URL atual é igual à URL alvo
  if (currentUrl === window.location.origin + targetUrl) {
    // Exibe um alerta
    alert("Cadastrado com SUCESSO!");
  }
}

// Chama a função para verificar a URL e exibir o alerta, se necessário
checkUrlAndAlert();