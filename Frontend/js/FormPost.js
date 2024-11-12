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

    // Sanitizando o conteúdo do post
    const conteudoSanitizado = DOMPurify.sanitize(conteudo);

    fetch('/feed', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            conteudo: conteudoSanitizado, // Usando o conteúdo sanitizado
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

// quando o DOM carregar..
addEventListener('DOMContentLoaded', () => {
    const nome = document.getElementById('name_user');
    const imgUser = document.querySelector('.imgUser img');
    const user_profile = document.getElementById('User_profile');
    const link_perfil_me = document.querySelectorAll('.me_user_perfil');

    fetch('user/me')
        .then((response) => response.json())
        .then((data) => {
            nome.textContent = data.nome;
            imgUser.src = `../assets/profile-pictures/${data.profilePicture}`;
            user_profile.src = `../assets/profile-pictures/${data.profilePicture}`;
            // Adiciona em todos os links com a classe tal
            link_perfil_me.forEach((link) => {
                link.href = `/perfil/${data.usernick}`;
            });

            if(data.isadmin === true) {
                const modal_adm = document.getElementById('modal_admin');
                modal_adm.style.border = '1px solid black';

                const txt_adm_on_modal = document.getElementById('text_adm_on');
                txt_adm_on_modal.style.display = 'block';
            }
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

// ===================== ===================== =====================
// =====================   Modal Hamburguer   =====================
// ===================== ===================== =====================

// Função para abrir e fechar o modal
const modal = document.getElementById('modalHamburguer');
const hamburguerIcon = document.getElementById('hamburguerIcon');
const closeModal = document.querySelector('.close-modal');
const sairBtn = document.getElementById('sairBtn');

// Elementos do modal para atualizar com dados do usuário
const profilePictureModal = document.getElementById('profilePictureModal');
const userNameModal = document.getElementById('userNameModal');
const userNickModal = document.getElementById('userNickModal');

// Abre o modal quando o ícone é clicado
hamburguerIcon.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Fecha o modal quando o botão "Sair" é clicado

// ?

// Exclui a sessão do usuario quando clica em 'sair'.
sairBtn.addEventListener('click', () => {
    fetch('/logout', {
        method: 'DELETE',
    }).then((response) => {
        if (response.ok) {
            alert('Sessão encerrada!');
            window.location.href = '/';
        } else {
            alert('Erro ao sair');
            console.error(response.error);
        }
    });
});

// Puxa dados do usuário e exibe no modal
fetch('user/me')
    .then((response) => response.json())
    .then((data) => {
        profilePictureModal.src = `../assets/profile-pictures/${data.profilePicture}`;
        userNameModal.textContent = data.nome;
        userNickModal.textContent = `@${data.usernick}`;
    })
    .catch((error) => console.error('Erro ao carregar dados do usuário:', error));

// Fecha o modal ao clicar no botão de fechar
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fecha o modal ao clicar fora do conteúdo
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// ===================== ===================== =====================
// =====================   Modal Novo Post   =====================
// ===================== ===================== =====================

// Abrir e fechar modal
const modalNovoPost = document.getElementById('modalNovoPost');
const btnNovoPost = document.getElementById('btnNovoPost');
const fecharModal = document.getElementById('fecharModal');

// Abrir modal ao clicar no botão flutuante
btnNovoPost.addEventListener('click', () => {
    modalNovoPost.style.display = 'flex';
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
document.getElementById('formNovoPost').addEventListener('submit', async function (event) {
    // Obter dados do formulário
    let conteudo = document.getElementById('conteudoPost').value;

    const conteudovalido = DOMPurify.sanitize(conteudo);

    // Montar objeto com os dados do post
    const novoPost = {
        conteudo: conteudovalido,
    };

    try {
        // Fazer requisição para a rota existente
        const resposta = await fetch('/feed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoPost),
        });

        if (resposta.ok) {
            const postCriado = await resposta.json();

            // Exibir o novo post no feed
            adicionarPostAoFeed(postCriado);

            // Fechar o modal e limpar o formulário
            modalNovoPost.style.display = 'none';
            document.getElementById('formNovoPost').reset();
        } else {
            console.error('Erro ao criar o post');
        }
    } catch (erro) {
        console.error('Erro na requisição:', erro);
    }
});

// Função para adicionar o post ao feed
function adicionarPostAoFeed(post) {
    const feed = document.getElementById('feed');
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    const titulo = document.createElement('h3');
    titulo.textContent = post.titulo;

    const conteudo = document.createElement('p');
    conteudo.textContent = post.conteudo;

    postDiv.appendChild(titulo);
    postDiv.appendChild(conteudo);

    feed.appendChild(postDiv);
}
