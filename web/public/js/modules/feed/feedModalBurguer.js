import CONFIG from "../config.js";

export default function toggleModalBurguer(data) {
    const modal = document.getElementById('modalHamburguer');
    const hamburguerIcon = document.getElementById('hamburguerIcon');
    const closeModal = document.querySelector('.close-modal');
    const sairBtn = document.getElementById('sairBtn');

    // Elementos do modal para atualizar com dados do usuário
    const profilePictureModal = document.getElementById('profilePictureModal');
    const userNameModal = document.getElementById('userNameModal');
    const userNickModal = document.getElementById('userNickModal');

    // Abre o modal quando o ícone é clicado
    hamburguerIcon.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    if(data) {
        profilePictureModal.src = `../assets/profile-pictures/${data.profilePicture}`;
        userNameModal.textContent = data.nome;
        userNickModal.textContent = `@${data.usernick}`;
        data.isadmin ? document.getElementById('acessoRelatorios').style.display = 'block' : null
    };

    // Fecha o modal ao clicar no botão de fechar
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Exclui a sessão do usuario quando clica em 'sair'.
    sairBtn.addEventListener('click', () => {
        fetch(`${CONFIG.URL_API}/auth/logout`, {
            method: 'DELETE',
            credentials: 'include'
        }).then((response) => {
            if (response.ok) {
                alert('Sessão encerrada!');
                window.location.href = '/';
            } else {
                console.error(response.error);
            };
        });
    });

    // Fecha o modal ao clicar fora do conteúdo
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        };
    });
};