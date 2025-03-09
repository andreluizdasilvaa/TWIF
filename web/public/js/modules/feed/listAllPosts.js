import CONFIG from '../config.js';
import likedPost from './likedPostOrNot.js';
import commentPost from './commentPost.js';
import verifyErrorsApi from "../utils/verifyErrorsApi.js";

export default function listAllPost() {
    fetch(`${CONFIG.URL_API}/feed/posts`, {
        credentials: 'include'
    })
        .then((response) => {
            if (!response.ok) {
                verifyErrorsApi(response);
                console.error('Erro na requisição', response);
                return;
            }
            return response.json();
        })
        .then((posts) => {
            // apenas para poder ver a animação de load( remover dps )
            setTimeout(() => {
                const postsList = document.getElementById('posts');
                postsList.innerHTML = ''; // Limpa a lista após 2 segundos

                posts.forEach((post) => {
                    const postElement = createPostElement(post);
                    postsList.appendChild(postElement);
                    likedPost(post, postElement);
                    commentPost(postElement);
                });
            }, 1000);
        });
}

// Função auxiliar para criar o elemento do post
function createPostElement(post) {
    const postElement = document.createElement('li');
    postElement.dataset.postId = post.id;
    postElement.classList.add('post');

    postElement.innerHTML = `
        <div class="infoUserPost">
            <div class="imgUserPost">
                <img src="../assets/profile-pictures/${post.user.profilePicture}" alt="">
            </div>
            <div class="nameAndHour">
                <strong>
                    <a href="/perfil/${post.user.usernick}" class="user-profile-link">
                        ${post.user.nome} <span id="userNick">@${post.user.usernick}</span>
                    </a>
                </strong>
                <p>${new Date(post.createdAt).toLocaleTimeString()}</p>
            </div>
        </div>
        <p>${post.content}</p>
        <div class="actionBtnPost">
            <div class="content_metric">
                <p class="number_like">${post.likes.length}</p>
                <button type="button" class="filesPost like" data-post-id="${post.id}">
                    <i class="ph-bold ph-heart likeFalse"></i>
                    <i style="display: none;" class="ph-fill ph-heart likeTrue"></i>
                </button>
            </div>
            <div class="content_metric">
                <p class="number_coments">${post.comments.length}</p>
                <button type="button" class="filesPost comment"><i class="ph-bold ph-chat-circle"></i></button>
            </div>
        </div>
    `;

    // Remover animações
    const nameAndHour = postElement.querySelector('.nameAndHour');
    const imgUserPost = postElement.querySelector('.imgUserPost');
    const contentPostLoading = postElement.querySelector('.content_post_loading');
    if (nameAndHour) nameAndHour.style.animation = 'none';
    if (imgUserPost) imgUserPost.style.animation = 'none';
    if (contentPostLoading) contentPostLoading.style.animation = 'none';

    return postElement;
}