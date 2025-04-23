import CONFIG from '../config.js'

export default function likedPost(post, postElement) {
    // Adiciona evento de clique no botão de curtir
    const likeButton = postElement.querySelector('.like');
    const likeCountElement = postElement.querySelector('.number_like');

    // Icons de coração para se alterarem
    const likeTrue = likeButton.querySelector('.ph-fill.ph-heart.likeTrue');
    const likeFalse = likeButton.querySelector('.ph-bold.ph-heart.likeFalse');

    // Verifica se o usuário já curtiu o post
    if (post.likedByCurrentUser) {
        likeTrue.style.display = 'block';
        likeFalse.style.display = 'none';
    }

    likeButton.addEventListener('click', () => {
        const postId = likeButton.getAttribute('data-post-id');

        fetch(`${CONFIG.URL_API}/feed/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === 'Post curtido com sucesso' || data.ok) {
                    likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
                    likeFalse.style.display = 'none';
                    likeTrue.style.display = 'block';
                } else  {
                    likeCountElement.textContent = parseInt(likeCountElement.textContent) - 1;
                    likeTrue.style.display = 'none';
                    likeFalse.style.display = 'block';
                }
            })
            .catch((error) => console.error('Erro ao curtir/descurtir:', error));
    })
}