export default function commentPost(postElement) {
    // Adiciona evento de clique no botão de comentario
    const comeentBtn = postElement.querySelector('.comment')

    comeentBtn.addEventListener('click', (event) => {
        const postId = event.target.closest('li.post').dataset.postId;
        window.location.href = `/comments?postId=${postId}`;
    });
}