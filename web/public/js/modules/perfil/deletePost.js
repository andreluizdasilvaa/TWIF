import CONFIG from "../config.js";

export default function deletePost(postElement) {
    const btn_excluir = postElement.querySelector('.btn_delete_post');
    if (btn_excluir) {
        btn_excluir.addEventListener('click', () => {
            const container_modal_ex_post = document.getElementById('modal_ex_post');
            const overlay = document.getElementById('overlay');
            overlay.style.display = 'block';
            container_modal_ex_post.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Define o ID do post a ser deletado no modal
            const postId = btn_excluir.getAttribute('data-post-id');

            // Remover o ouvinte anterior, se houver
            const confirmButton = document.getElementById('button_ex_post');
            confirmButton.onclick = null; // Remover o antigo antes de adicionar um novo

            // pressionar o botão excluir
            confirmButton.addEventListener('click', () => {
                console.log(postId);
                fetch(`${CONFIG.URL_API}/delete/post`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idPost: postId }),
                    credentials: 'include'
                })
                    .then((res) => res.json())
                    .then((result) => {
                        if (result.message === 'Post deletado com sucesso.' || result.ok) {
                            window.location.reload();
                        } else {
                            alert(result.message);
                        }
                    })
                    .catch((error) => console.error('Erro ao deletar o post:', error));
            });

            document.getElementById('button_ex_post_cancelar').onclick = () => {
                container_modal_ex_post.style.display = 'none';
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            };
        });
    };
};