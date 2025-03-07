import CONFIG from "../config.js";
import deletePost from "./deletePost.js";
import likedPost from "../feed/likedPostOrNot.js";
import commentPost from "../feed/commentPost.js";

export default function loaduserPosts() {
    // Obtém o usernick da URL
    const pathSegments = window.location.pathname.split('/');
    const usernick = pathSegments[pathSegments.length - 1]; // Último segmento da URL

    fetch(`${CONFIG.URL_API}/api/perfil/${usernick}`, {
        credentials: 'include'
    })
        .then((response) => response.json())
        .then((data) => {
            const postsList = document.getElementById('posts');
            postsList.innerHTML = '';

            if (data.isadmin == true) {
                document.getElementById('adm_icon').style.display = 'block';
            }

            // verifica se existem postagens e, se sim, as ordena por data de criação, colocando as mais recentes primeiro.
            if (data.posts && Array.isArray(data.posts)) {
                const sortedPosts = data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                sortedPosts.forEach((post) => {
                    const postElement = document.createElement('li');
                    postElement.classList.add('post');

                    // Renderiza o botão "Excluir Post" e troca de avatar apenas se `isCurrentUser` for `true`
                    let deleteButtonHtml = '';
                    // botão de troca de avatar
                    const btn_troca_avatar = document.getElementById('troca_perfil');
                    if (data.isCurrentUser || data.my_user_admin) {
                        deleteButtonHtml = `<button class="btn_delete_post" data-post-id="${post.id}">Deletar Post</button>`;
                        btn_troca_avatar.style.display = 'flex';
                    } else {
                        deleteButtonHtml = '';
                        btn_troca_avatar.style.display = 'none';
                    }

                    postElement.innerHTML = `
                        <div class="infoUserPost">
                            <div class="imgUserPost">
                                <img src="../assets/profile-pictures/${data.profilePicture}" alt="">
                            </div>
                            <div class="nameAndHour">
                                <strong>
                                    <a href="/perfil/${data.usernick}" class="user-profile-link">
                                        ${data.nome} <span id="userNick">@${data.usernick}</span>
                                    </a>
                                </strong>
                                <p>${new Date(post.createdAt).toLocaleTimeString()}</p>
                            </div>
                        </div>
                        <p>${post.content}</p>
                        <div class="actionBtnPost">
                            <div>
                                ${deleteButtonHtml}
                            </div>
                            <div class="content_interations_post">
                                <div class="content_metric">
                                    <p class="number_like">${post.likes ? post.likes.length : 0}</p>
                                    <button type="button" class="filesPost like" data-post-id="${post.id}">
                                        <i class="ph-bold ph-heart likeFalse"></i>
                                        <i style="display: none;" class="ph-fill ph-heart likeTrue"></i>
                                    </button>
                                </div>
                                <div class="content_metric">
                                    <p class="number_coments">${post.comments ? post.comments.length : 0}</p>
                                    <button type="button" class="filesPost comment"><i class="ph-bold ph-chat-circle"></i></button>
                                </div>
                            </div>
                        </div>
                    `;

                    postsList.appendChild(postElement);
                    deletePost(postElement);
                    likedPost(post, postElement);
                    commentPost(postElement)
                });
            };
        });
};