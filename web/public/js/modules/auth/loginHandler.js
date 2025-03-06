// loginHandler.js
import CONFIG from '../config.js';

export default function loginForm() {
    const form = document.getElementById('formLogin');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const mail = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch(`${CONFIG.URL_API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mail, senha: password }),
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro no login');
            return response.json();
        })
        .then(data => {
            console.log('Sucesso:', data);
            // window.location.reload();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha no login');
        });
    });
}