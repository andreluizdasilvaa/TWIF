import CONFIG from "../config.js";
import verifyErrorsApi from "../utils/verifyErrorsApi.js";

export default async function submitPost() {
    const form = document.getElementById('formPost');

    // Cadastrar um post quando enviarem o form.
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Formulário enviado');

        const conteudo = document.getElementById('textarea').value;

        if (!conteudo) {
            alert('Tamanho mínimo de 1 caractere');
            return; // Não prossegue se não houver conteúdo
        }

        // Sanitizando o conteúdo do post
        const conteudoSanitizado = DOMPurify.sanitize(conteudo);

        fetch(`${CONFIG.URL_API}/create/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                conteudo: conteudoSanitizado, // Usando o conteúdo sanitizado
            }),
        })
            .then((response) => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    verifyErrorsApi(response)
                    console.error('Erro ao criar post:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Erro na requisição:', error);
            });
    });
}