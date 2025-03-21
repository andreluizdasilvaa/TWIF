const form = document.getElementById('formPost');

// Cadastrar um post quando enviarem o form.
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const conteudo = document.getElementById('textarea').value;

    if (!conteudo) {
        alert('Tamanho mínimo de 1 caractere');
        return;
    }

    const conteudoSanitizado = DOMPurify.sanitize(conteudo);

    fetch('/feed', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conteudo: conteudoSanitizado }),
    })
        .then((response) => {
            if (response.ok) {
                window.location.reload();
            } else {
                console.error('Erro ao criar post:', response.statusText);
            }
        })
        .catch((error) => console.error('Erro na requisição:', error));
});

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
            link_perfil_me.forEach((link) => {
                link.href = `/perfil/${data.usernick}`;
            });

            if (data.isadmin === true) {
                const modal_adm = document.getElementById('modal_admin');
                modal_adm.style.border = '1px solid black';

                const txt_adm_on_modal = document.getElementById('text_adm_on');
                txt_adm_on_modal.style.display = 'block';
            }
        });

    let currentPage = 1;
    const postsPerPage = 10; // Exibir 10 posts por página
    let allPosts = [];

    const postsList = document.getElementById('posts');
    const loadMoreButton = document.getElementById('loadMoreButton');

    function formatDateTime(dateString) {
        const date = new Date(dateString);
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        return date.toLocaleTimeString(undefined, timeOptions);
    }

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
                    <p>${formatDateTime(post.createdAt)}</p>
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

        const likeButton = postElement.querySelector('.like');
        const likeCountElement = postElement.querySelector('.number_like');
        const commentBtn = postElement.querySelector('.comment');
        const likeTrue = likeButton.querySelector('.likeTrue');
        const likeFalse = likeButton.querySelector('.likeFalse');

        commentBtn.addEventListener('click', (event) => {
            const postId = event.target.closest('li.post').dataset.postId;
            window.location.href = `/comments?postId=${postId}`;
        });

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

        return postElement;
    }

    function displayPosts(posts) {
        posts.forEach(post => {
            const postElement = createPostElement(post);
            postsList.appendChild(postElement);
        });
    }

    async function fetchPosts(page) {
        try {
            const response = await fetch(`/feed/posts`); // Busca todos os posts do servidor
            if (!response.ok) {
                throw new Error(`Erro ao carregar posts: ${response.status}`);
            }
            const data = await response.json();
            allPosts = data;

            // Calcula os índices de início e fim para a paginação
            const startIndex = (page - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;

            // Seleciona os posts para a página atual
            const postsForPage = allPosts.slice(startIndex, endIndex);

            // Exibe os posts da página atual
            displayPosts(postsForPage);

            // Mostra ou oculta o botão "Ver Mais"
            if (endIndex >= allPosts.length) {
                loadMoreButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'block';
            }
        } catch (err) {
            console.error('Erro ao carregar posts:', err);
        }
    }

    // Carrega a primeira página de posts
    fetchPosts(currentPage);

    // Adiciona um event listener para o botão "Ver Mais"
    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        fetchPosts(currentPage);
    });

    function checkUrlAndAlertFeed() {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');

        if (error === '1') {
            alert('Escreva alguma coisa antes!');
            window.location.href = '/';
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
fetch('/user/me')
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
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
// =====================   Modal Novo Post   =======================
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

const body = document.body;
const logoHeader = document.getElementById('logo_header');
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeKey = 'darkMode';
const lampIcon = document.getElementById('lampIcon'); // Referência ao ícone da lâmpada
const toggleText = darkModeToggle.querySelector('span'); // Referência ao texto do toggle

// Função para alternar entre o modo claro e escuro
function toggleDarkMode() {
    const isDarkMode = body.classList.toggle('dark-mode');
    
    // Atualiza a logo com base no modo
    logoHeader.src = isDarkMode ? '../assets/img/logo-white.svg' : '../assets/img/logo-dark.svg'; // Muda a logo
    
    // Armazena a preferência
    localStorage.setItem(darkModeKey, isDarkMode); 

    // Atualiza a cor do ícone da lâmpada
    lampIcon.setAttribute("fill", isDarkMode ? "#011214" : "#7ec543"); // Lâmpada apagada no modo escuro e acesa no modo claro

    // Atualiza o texto do toggle
    toggleText.textContent = isDarkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"; // Troca o texto
}

// Função para aplicar o tema ao carregar a página
function applyStoredTheme() {
    const isDarkMode = localStorage.getItem(darkModeKey) === 'true';
    
    // Aplica o tema armazenado
    if (isDarkMode) {
        body.classList.add('dark-mode');
        logoHeader.src = '../assets/img/logo-white.svg'; // Logo branca
        lampIcon.setAttribute("fill", "#011214"); // Lâmpada apagada no modo escuro
        toggleText.textContent = "Ativar Modo Claro"; // Texto inicial para modo escuro
    } else {
        logoHeader.src = '../assets/img/logo-dark.svg'; // Logo colorida como padrão
        lampIcon.setAttribute("fill", "#7ec543"); // Lâmpada acesa no modo claro
        toggleText.textContent = "Ativar Modo Escuro"; // Texto inicial para modo claro
    }
}

// Chama a função para aplicar o tema ao carregar a página
applyStoredTheme();

// Adiciona um event listener para alternar o modo ao clicar na lâmpada
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
}

async function verificarUsuario() {
    try {
        const response = await fetch('/user/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Supondo que você armazena o token no localStorage
            }
        });

        if (response.ok) {
            const user = await response.json();
            if (user.isadmin) {
                // Se o usuário for admin, exibe o botão
                document.getElementById('acessoRelatorios').style.display = 'block';
            }
        } else {
            console.error('Erro ao buscar informações do usuário:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao verificar usuário:', error);
    }
}

// Chama a função ao carregar a página
window.onload = verificarUsuario;

function auth_admin(req, res, next) {
    // Verifica se o usuário está autenticado e se é um administrador
    if (req.user && req.user.isadmin) {
        next(); // O usuário é admin, continue para a próxima função
    } else {
        res.status(403).send('Acesso negado'); // Acesso negado
    }
}
