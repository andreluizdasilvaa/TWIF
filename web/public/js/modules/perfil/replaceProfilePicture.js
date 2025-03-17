import CONFIG from "../config.js";

export default function replaceProfilePicture() {
    document.getElementById('troca_perfil').addEventListener('click',  () => {
        // Obtém o modal
        var modal = document.getElementById('avatarModal');
        modal.style.display = 'flex'
        document.getElementById('overlay').style.display = 'block'
        document.body.style.overflow = 'hidden';

        // Obtém o elemento <span> que fecha o modal
        var span = document.getElementsByClassName('close')[0];

        // Quando o usuário clica em <span> (x), fecha o modal
        span.onclick = function () {
            modal.style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        // Quando o usuário clica em qualquer lugar fora do modal, fecha-o
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };

        // Obtém todos os botões de avatar
        var avatarButtons = document.querySelectorAll('.avatar-button');

        // Trata a seleção de avatar
        avatarButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                // Obtém o src da imagem dentro do botão clicado
                var avatarSrc = this.querySelector('img').src;

                // Extrai apenas o nome do arquivo do avatar
                var avatarFileName = avatarSrc.split('/').pop();

                // Define o valor do campo escondido com o nome do arquivo do avatar escolhido
                document.getElementById('avatar-escolhido').value = avatarFileName;

                // Remove a classe 'selected' de todos os botões
                avatarButtons.forEach((b) => b.classList.remove('selected'));

                // Adiciona a classe 'selected' ao avatar escolhido
                this.classList.add('selected');
            });
        });

        document.getElementById('salvar-avatar').addEventListener('click', (event) => {
            event.preventDefault();

            const img_escolhida = document.getElementById('avatar-escolhido').value
            
            // Obtém o usernick da URL
            const pathSegments = window.location.pathname.split('/');
            const usernick = pathSegments[pathSegments.length - 1];
            
            fetch(`${CONFIG.URL_API}/api/troca/avatar/${img_escolhida}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                     usernick
                }),
                credentials: 'include'
            })
            .then((resp) => {
                if (resp.ok) {
                    return resp.json().then((data) => {
                        alert(data.msg);
                        window.location.reload();
                    });
                } else {
                    return resp.json().then((data) => {
                        alert(data.message || "Erro ao atualizar a foto de perfil");
                    });
                }
            })
            .catch((error) => {
                console.error("Erro na requisição:", error);
                alert("Erro na requisição");
            });
        })
    });
}