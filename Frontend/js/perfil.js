addEventListener('DOMContentLoaded', () => {
    // Adiciona as informações do usuário na página
    const user_profile = document.getElementById('User_profile'); // Elemento do perfil
    const user_name = document.getElementById('User_name'); // Elemento do nome
    const user_nick = document.querySelector('.p-perfil'); // Elemento do nick

    // Obtém o usernick da URL
    const pathSegments = window.location.pathname.split('/');
    const usernick = pathSegments[pathSegments.length - 1]; // Último segmento da URL

    // Faz a requisição para buscar as informações do usuário
    fetch(`http://localhost:3000/api/perfil/${usernick}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Usuário não encontrado');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data); // Para verificar o retorno no console
            user_name.innerHTML = data.nome; // Exibe o nome do usuário
            user_profile.src = `../assets/profile-pictures/${data.profilePicture}`; // Define a imagem de perfil
            user_nick.innerHTML = `@${data.usernick}`; // Exibe o nickname
        })
        .catch((error) => {
            console.error('Erro ao buscar informações do usuário:', error);
            alert('Erro ao buscar informações do usuário');
        });

    // Exibir apenas o post do user que entrou no

    // Modal de logout
    document.addEventListener('DOMContentLoaded', () => {
        const icone_logout = document.getElementById('icone-logout');
        const modal_logout = document.getElementById('modal_logout');
        const model_button_cancelar = document.getElementById('button_logout_cancelar');
        const model_button_sair = document.getElementById('button_logout_sair');
        const overlay = document.getElementById('overlay');

        icone_logout.addEventListener('click', () => {
            modal_logout.style.display = 'flex';
            overlay.style.display = 'block';
        });
        model_button_cancelar.addEventListener('click', () => {
            modal_logout.style.display = 'none';
            overlay.style.display = 'none';
        });

        model_button_sair.addEventListener('click', () => {
            // toda logica para remover o cookie com token jwt
        });
    });

    // Remover sessão
    document.getElementById('button_logout_sair').addEventListener('click', () => {
        fetch('http://localhost:3000/logout', {
            method: 'DELETE',
        })
            .then((resp) => {
                if (resp.ok) {
                    alert('Sessão encerrada!');
                    window.location.href = '/';
                }
            })
            .catch((err) => {
                console.error(`Erro ao encerrar sessão, Erro: ${err}`);
            });
    });

    // Cadastrar um post quando enviarem o form.
    const form = document.getElementById('formPost');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Formulário enviado');

        const conteudo = document.getElementById('textarea').value;

        if (!conteudo) {
            alert('Tamanho mínimo de 1 caractere');
            return; // Não prossegue se não houver conteúdo
        }

        fetch('/feed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conteudo: conteudo,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error('Erro ao criar post:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Erro na requisição:', error);
            });
    });
})
