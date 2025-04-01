import CONFIG from "../config.js";
import verifyErrorsApi from "../utils/verifyErrorsApi.js";

export default function submitPostInNewModal() {
    const modalNovoPost = document.getElementById('modalNovoPost');
    const btnNovoPost = document.getElementById('btnNovoPost');
    const fecharModal = document.getElementById('fecharModal');
    const formNovoPost = document.getElementById('formNovoPost');
    const conteudoPost = document.getElementById('conteudoPost');
    
    // Criar contador de caracteres
    const contador = document.createElement('p');
    contador.id = "contadorCaracteres";
    contador.style.fontSize = "12px";
    contador.style.color = "#666";
    conteudoPost.parentNode.appendChild(contador);

    const maxCaracteres = 184;

    // Atualizar contador de caracteres em tempo real
    function atualizarContador() {
        const caracteresDigitados = conteudoPost.value.length;
        contador.textContent = `${caracteresDigitados}/${maxCaracteres}`;

        // Impede que o usuário digite mais que o limite
        if (caracteresDigitados >= maxCaracteres) {
            conteudoPost.value = conteudoPost.value.substring(0, maxCaracteres);
            contador.textContent = `${maxCaracteres}/${maxCaracteres}`;
        }
    }

    // Chama a função ao digitar no campo
    conteudoPost.addEventListener("input", atualizarContador);

    // Abrir modal ao clicar no botão flutuante
    btnNovoPost.addEventListener('click', () => {
        modalNovoPost.style.display = 'flex';
        atualizarContador(); // Atualizar o contador ao abrir o modal
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
    formNovoPost.addEventListener('submit', async function (event) {
        event.preventDefault();

        let conteudo = conteudoPost.value.trim();
        const conteudovalido = DOMPurify.sanitize(conteudo);

        if (conteudovalido.length > maxCaracteres) {
            return;
        }

        const novoPost = {
            conteudo: conteudovalido,
        };

        try {
            const resposta = await fetch(`${CONFIG.URL_API}/feed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(novoPost),
            });

            if (resposta.ok) {
                modalNovoPost.style.display = 'none';
                formNovoPost.reset();
                window.location.reload();
            } else {
                verifyErrorsApi(resposta);
                console.error('Erro ao criar o post');
            }
        } catch (erro) {
            console.error('Erro na requisição:', erro);
        }
    });
}
