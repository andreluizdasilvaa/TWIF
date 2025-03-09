import CONFIG from "../config.js";
import verifyErrorsApi from "../utils/verifyErrorsApi.js";

export default function submitPostInNewModal() {
    // Abrir e fechar modal
    const modalNovoPost = document.getElementById('modalNovoPost');
    const btnNovoPost = document.getElementById('btnNovoPost');
    const fecharModal = document.getElementById('fecharModal');

    // Abrir modal ao clicar no botão flutuante
    btnNovoPost.addEventListener('click', () => {
        modalNovoPost.style.display = 'flex';
    });

    // Fechar modal ao clicar no "X"
    fecharModal.addEventListener('click', () => {
        modalNovoPost.style.display = 'none';
    });

    // Fechar modal ao clicar fora da área de conteúdo
    window.addEventListener('click', (event) => {
        if (event.target === modalNovoPost) {
            modalNovoPost.style.display = 'none';
        }
    });

    // Função para publicar o post
    document.getElementById('formNovoPost').addEventListener('submit', async function (event) {
        // Obter dados do formulário
        let conteudo = document.getElementById('conteudoPost').value;

        const conteudovalido = DOMPurify.sanitize(conteudo);

        // Montar objeto com os dados do post
        const novoPost = {
            conteudo: conteudovalido,
        };

        try {
            // Fazer requisição para a rota existente
            const resposta = await fetch(`${CONFIG.URL_API}/feed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(novoPost),
            });

            if (resposta.ok) {
                const postCriado = await resposta.json();

                // Fechar o modal e limpar o formulário
                modalNovoPost.style.display = 'none';
                document.getElementById('formNovoPost').reset();
                window.location.reload();
            } else {
                verifyErrorsApi(resposta);
                console.error('Erro ao criar o post');
            };
        } catch (erro) {
            console.error('Erro na requisição:', erro);
        }
    });
}