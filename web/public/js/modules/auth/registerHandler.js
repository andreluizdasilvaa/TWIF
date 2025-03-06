import CONFIG from '../config.js';

export default function registerForm() {
    var modal = document.getElementById("avatarModal");

    // Verificar se os campos estão preenchidos antes de abrir o modal
    document.getElementById('botao-cadastrar').addEventListener('click', function(event) {
        event.preventDefault();

        var nome = document.getElementById('nome').value;
        var email = document.getElementById('email').value;
        var usernick = document.getElementById('user').value;
        var senha = document.getElementById('senha').value;

        if (!nome || !email || !usernick || !senha) {
            alert('Por favor, preencha todos os campos obrigatórios antes de prosseguir.');
        } else {
            modal.style.display = 'block';

            document.getElementById('salvar-avatar').addEventListener('click', (event) => {
                event.preventDefault();
                const profilePicture = document.getElementById('avatar-escolhido').value;

                fetch(`${CONFIG.URL_API}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        senha: senha,
                        usernick: usernick,
                        nome: nome,
                        profilePicture: profilePicture,
                    }),
                    credentials: 'include'
                })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw new Error(err.msg || 'Erro ao registrar');
                        });
                    };
                    return response.json();
                })
                .then(data => {
                    // fazer um melhor tratamento!
                    alert('Cadastro realizado com sucesso! Bem-vindo(a), ' + nome + '!');
                    data.redirect ? window.location.href = data.redirect : null
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alert('Erro ao enviar formulário: ' + error.message);
                });
            });
        };
    });
};