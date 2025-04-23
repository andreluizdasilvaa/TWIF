import CONFIG from "../config.js";
import verifyErrorsApi from "../utils/verifyErrorsApi.js";

export default function infoPerfil() {
    const user_profile = document.getElementById('User_profile');
    const user_name = document.getElementById('User_name');
    const user_nick = document.querySelector('.p-perfil');
    const user_birth = document.getElementById('User_birth');
    const user_course = document.getElementById('User_course');

    const pathSegments = window.location.pathname.split('/');
    const usernick = pathSegments[pathSegments.length - 1];

    function formatarData(dataISO) {
        if (!dataISO) return '';
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    fetch(`${CONFIG.URL_API}/api/perfil/${usernick}`, {
        credentials: 'include'
    })
        .then((response) => {
            if (!response.ok) {
                verifyErrorsApi(response);
                throw new Error('Usuário não encontrado');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Dados recebidos da API:', data);

            // Debugging nascimento and curso fields
            console.log('Nascimento:', data.nascimento);
            console.log('Curso:', data.course);

            user_name.innerHTML = data.nome || 'Nome não informado';
            if (user_profile && data.profilePicture) {
                user_profile.src = `../assets/profile-pictures/${data.profilePicture}`;
            }
            user_nick.innerHTML = `@${data.usernick || ''}`;

           // Exibe nascimento e curso, se existirem
user_birth.innerHTML = data.nascimento
    ? `<i class="fa-regular fa-calendar"></i> ${formatarData(data.nascimento)}`
    : `<i class="fa-regular fa-calendar"></i>Não informado`;

user_course.innerHTML = data.course
    ? `<i class="fa-regular fa-star"></i> ${data.course}`
    : `<i class="fa-regular fa-star"></i>Não informado`;
})
.catch((error) => {
    console.error('Erro ao buscar informações do usuário:', error);
});
}

// CHAME A FUNÇÃO!
infoPerfil();
