import modalAvatarSelection from "./modules/ui/modalAvatarSelection.js";
import registerForm from "./modules/auth/registerHandler.js";
import darkModeRegister from "./modules/ui/darkModeRegister.js";

document.addEventListener('DOMContentLoaded', () => {
    modalAvatarSelection();
    registerForm();
    darkModeRegister();
});

function mostrarAlerta(mensagem) {
    const alerta = document.getElementById('alerta');
    alerta.textContent = mensagem;
    alerta.style.display = 'block';

    // Esconde o alerta após 5 segundos (opcional)
    setTimeout(() => {
        alerta.style.display = 'none';
    }, 5000);
}

document.querySelector('form').addEventListener('submit', function (e) {
    const email = document.getElementById('email').value;

    if (!email.endsWith('@aluno.ifsp.edu.br')) {
        e.preventDefault(); // Impede envio
        mostrarAlerta('Por favor, utilize um e-mail institucional válido (@aluno.ifsp.edu.br).');
    }
});
