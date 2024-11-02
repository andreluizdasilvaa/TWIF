addEventListener('DOMContentLoaded', () => {
    // Adiciona as informações do usuário na página
    const user_profile = document.getElementById('User_profile'); // Elemento do perfil
    const user_name = document.getElementById('User_name'); // Elemento do nome
    const user_nick = document.querySelector('.p-perfil'); // Elemento do nick

    // Obtém o usernick da URL
    const pathSegments = window.location.pathname.split('/');
    const usernick = pathSegments[pathSegments.length - 1]; // Último segmento da URL

    // Faz a requisição para buscar as informações do usuário
    fetch(`http://localhost:3000/api/perfil/${usernick}`)
        .then((response) => {
            if (!response.ok) {
                window.location.href = '/user404';
                throw new Error('Usuário não encontrado');
            }
            return response.json();
        })
        .then((data) => {
            user_name.innerHTML = data.nome; // Exibe o nome do usuário
            user_profile.src = `../assets/profile-pictures/${data.profilePicture}`; // Define a imagem de perfil
            user_nick.innerHTML = `@${data.usernick}`; // Exibe o nickname
        })
        .catch((error) => {
            console.error('Erro ao buscar informações do usuário:', error);
            // alert('Erro ao buscar informações do usuário');
        });

    // Exibir apenas o post do user que entrou no perfil
    fetch(`/api/perfil/${usernick}`)
        .then((response) => response.json())
        .then((data) => {
            const postsList = document.getElementById('posts');
            postsList.innerHTML = '';

            // verifica se existem postagens e, se sim, as ordena por data de criação, colocando as mais recentes primeiro.
            if (data.posts && Array.isArray(data.posts)) {
                const sortedPosts = data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                sortedPosts.forEach((post) => {
                    const postElement = document.createElement('li');
                    postElement.classList.add('post');

                    // Renderiza o botão "Excluir Post" apenas se `isCurrentUser` for `true`
                    let deleteButtonHtml = '';
                    if (data.isCurrentUser) {
                        deleteButtonHtml = `<button class="btn_delete_post" data-post-id="${post.id}">Deletar Post</button>`;
                    } else {
                        deleteButtonHtml = '';
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

                    // excluir um post
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
                                fetch('/delete/post', {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ idPost: postId }),
                                })
                                    .then((res) => res.json())
                                    .then((result) => {
                                        if (result.message === 'Post deletado com sucesso.') {
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
                    }

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
            } else {
                console.error('Posts não encontrados no formato esperado.');
            }
        })
        .catch((error) => console.error('Erro ao carregar posts:', error));


    // Modal de excluir post


    // Modal de logout
    const icone_logout = document.getElementById('icone-logout');
    const modal_logout = document.getElementById('modal_logout');
    const model_button_cancelar = document.getElementById('button_logout_cancelar');
    const model_button_sair = document.getElementById('button_logout_sair');
    const overlay = document.getElementById('overlay');

    icone_logout.addEventListener('click', () => {
        modal_logout.style.display = 'flex';
        overlay.style.display = 'block';
    });
    model_button_cancelar.addEventListener('click', () => {
        modal_logout.style.display = 'none';
        overlay.style.display = 'none';
    });

    model_button_sair.addEventListener('click', () => {
        // toda logica para remover o cookie com token jwt
    });

    // Remover sessão
    document.getElementById('button_logout_sair').addEventListener('click', () => {
        fetch('http://localhost:3000/logout', {
            method: 'DELETE',
        })
            .then((resp) => {
                if (resp.ok) {
                    alert('Sessão encerrada!');
                    window.location.href = '/';
                }
            })
            .catch((err) => {
                console.error(`Erro ao encerrar sessão, Erro: ${err}`);
            });
    });

    // Cadastrar um post quando enviarem o form.
    const form = document.getElementById('formPost');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Formulário enviado');

        let conteudo = document.getElementById('textarea').value;

        if (!conteudo) {
            alert('Tamanho mínimo de 1 caractere');
            return; // Não prossegue se não houver conteúdo
        }

        const conteudovalido = DOMPurify.sanitize(conteudo);

        fetch('/feed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conteudo: conteudovalido,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error('Erro ao criar post:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Erro na requisição:', error);
            });
    });
});