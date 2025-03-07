import CONFIG from "../config.js";

export default function modalLogout() {
    // Modal de logout
    const icone_logout = document.getElementById('icone-logout');
    const modal_logout = document.getElementById('modal_logout');
    const model_button_cancelar = document.getElementById('button_logout_cancelar');
    const model_button_sair = document.getElementById('button_logout_sair');
    const overlay = document.getElementById('overlay');

    icone_logout.addEventListener('click', () => {
        modal_logout.style.display = 'flex';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    model_button_cancelar.addEventListener('click', () => {
        modal_logout.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Remover sessão
    model_button_sair.addEventListener('click', () => {
        fetch(`${CONFIG.URL_API}/auth/logout`, {
            method: 'DELETE',
            credentials: 'include'
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
}