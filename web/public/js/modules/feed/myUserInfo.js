import CONFIG from '../config.js'
import toggleModalBurguer from './feedModalBurguer.js';

export default function myUserInfo() {
    const nome = document.getElementById('name_user');
    const imgUser = document.querySelector('.imgUser img');
    const user_profile = document.getElementById('User_profile');
    const link_perfil_me = document.querySelectorAll('.me_user_perfil');

    fetch(`${CONFIG.URL_API}/user/me`, {
        credentials: 'include'
    })
        .then((response) => response.json())
        .then((data) => {
            nome.textContent = data.nome;
            imgUser.src = `../assets/profile-pictures/${data.profilePicture}`;
            user_profile.src = `../assets/profile-pictures/${data.profilePicture}`;
            // Adiciona em todos os links com a classe tal
            link_perfil_me.forEach((link) => {
                link.href = `/perfil/${data.usernick}`;
            });

            if(data.isadmin === true) {
                const modal_adm = document.getElementById('modal_admin');
                modal_adm.style.border = '1px solid black';

                const txt_adm_on_modal = document.getElementById('text_adm_on');
                txt_adm_on_modal.style.display = 'block';
            }

            toggleModalBurguer(data);
        });
}