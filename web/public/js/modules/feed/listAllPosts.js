import CONFIG from '../config.js'
import likedPost from './likedPostOrNot.js';
import commentPost from './commentPost.js';

export default function listAllPost() {
    // lista todos os posts
    fetch(`${CONFIG.URL_API}/feed/posts`, {
        credentials: 'include'
    })
        .then((response) => response.json())
        .then((posts) => {
            const postsList = document.getElementById('posts');
            postsList.innerHTML = '';

            posts.forEach((post) => {
                const postElement = document.createElement('li');
                postElement.dataset.postId = post.id;
                postElement.classList.add('post');

                postElement.innerHTML = 
                    `<div class="infoUserPost">
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
                                <!-- Icon Não curtido -->
                                <i class="ph-bold ph-heart likeFalse"></i>
                                <!-- Icon curtido -->
                                <i style="display: none;" class="ph-fill ph-heart likeTrue"></i>
                            </button>
                        </div>
                        <div class="content_metric">
                            <p class="number_coments">${post.comments.length}</p>
                            <button type="button" class="filesPost comment"><i class="ph-bold ph-chat-circle"></i></button>
                        </div>
                    </div>`
                    ;

                postsList.appendChild(postElement);

                likedPost(post, postElement);
                commentPost(postElement);
            })
        })
};