import CONFIG from "../config.js";

export default function infoPerfil() {
    // Adiciona as informações do usuário na página
    const user_profile = document.getElementById('User_profile'); // Elemento do perfil
    const user_name = document.getElementById('User_name'); // Elemento do nome
    const user_nick = document.querySelector('.p-perfil'); // Elemento do nick

    // Obtém o usernick da URL
    const pathSegments = window.location.pathname.split('/');
    const usernick = pathSegments[pathSegments.length - 1]; // Último segmento da URL

    // Faz a requisição para buscar as informações do usuário
    fetch(`${CONFIG.URL_API}/api/perfil/${usernick}`, {
        credentials: 'include'
    })
        .then((response) => {
            if (!response.ok) {
                console.log(response)
                // window.location.href = '/user404';
                throw new Error('Usuário não encontrado');
            }
            return response.json();
        })
        .then((data) => {
            user_name.innerHTML = data.nome; // Exibe o nome do usuário
            user_profile.src = `../assets/profile-pictures/${data.profilePicture}`; // Define a imagem de perfil
            user_nick.innerHTML = `@${data.usernick}`; // Exibe o nickname
        })
        .catch((error) => {
            console.error('Erro ao buscar informações do usuário:', error);
            // alert('Erro ao buscar informações do usuário');
        });
}