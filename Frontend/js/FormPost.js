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

    fetch('/feed', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            conteudo: conteudo,
        }),
    }).then((response) => {
            if (response.ok) {
                window.location.reload();
            } else {
                console.error('Erro ao criar post:', response.statusText);
            }
        }).catch((error) => {
            console.error('Erro na requisição:', error);
        });
});

// quando o DOM carregar..
addEventListener('DOMContentLoaded', () => {

    const nome = document.getElementById('name_user');
    const imgUser = document.querySelector('.imgUser img');
    const user_profile = document.getElementById('User_profile');

    fetch('/user/me')
    .then((response) => response.json())
    .then((data) => {
        nome.textContent = data.nome;
        imgUser.src = `../assets/profile-pictures/${data.profilePicture}`;
        user_profile.src = `../assets/profile-pictures/${data.profilePicture}`;
    });

    // lista todos os posts
    fetch('/feed/posts')
        .then((response) => response.json())
        .then((posts) => {
            const postsList = document.getElementById('posts');
            postsList.innerHTML = '';

            posts.forEach((post) => {
                const postElement = document.createElement('li');
                postElement.classList.add('post');

                postElement.innerHTML = `
                <div class="infoUserPost">
                    <div class="imgUserPost">
                        <img src="../assets/profile-pictures/${post.user.profilePicture}" alt="">
                    </div>
                    <div class="nameAndHour">
                        <strong>${post.user.nome} <span id="userNick">@${post.user.usernick}</span></strong>
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
                </div>
            `;
                postsList.appendChild(postElement);

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

                    fetch(`/posts/${postId}/like`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.message === 'Post curtido') {
                                likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
                                likeFalse.style.display = 'none';
                                likeTrue.style.display = 'block';
                            } else if (data.message === 'Curtida removida') {
                                likeCountElement.textContent = parseInt(likeCountElement.textContent) - 1;
                                likeTrue.style.display = 'none';
                                likeFalse.style.display = 'block';
                            }
                        })
                        .catch((error) => console.error('Erro ao curtir/descurtir:', error));
                });
            });
        })
        .catch((err) => console.error('Erro ao carregar posts:', err));


    // se algum problema de usuario acontecer..
    function checkUrlAndAlertFeed() {
        const urlParams = new URLSearchParams(window.location.search);

        const success = urlParams.get('success');
        const error = urlParams.get('error');

        switch (true) {
            case error === '1':
                alert('Escreva alguma coisa antes!');
                window.location.href = '/';
                break;

            default:
                break;
        }
    }
    checkUrlAndAlertFeed();
});