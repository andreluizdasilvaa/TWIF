const form = document.getElementById('formPost');

// Cadastrar um post quando enviarem o form.
form.addEventListener('submit', (event) => {
    event.preventDefault(); // impede o envio do formulário
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
                // Você pode adicionar aqui lógica para atualizar a UI
            } else {
                // Tratar erro, se necessário
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
            .then(response => response.json())
            .then(posts => {
                const postsList = document.getElementById('posts');
                postsList.innerHTML = '';

                posts.forEach(post => {
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
                        
                    <div class="actionBtnPost"><!-- ignorar por enquanto -->
                        <div class="content_metric">
                            <p id="number_like">${post.likes.length}</p>
                            <button type="button" class="filesPost like"><i class="ph-bold ph-heart"></i></button>
                        </div>
                        
                        <div class="content_metric">
                            <p id="number_coments">${post.comments.length}</p>
                            <button type="button" class="filesPost comment"><i class="ph-bold ph-chat-circle"></i></button>
                        </div>
                    </div>
                    `;
                    postsList.appendChild(postElement);

                    // Curtir Visualmente --! Não acabado ( Não Pronto )
                    const btn_likes = document.querySelectorAll('.like');
                    btn_likes.forEach(btn_like => {
                        const number_likes = document.getElementById('number_like').value;
                        btn_like.addEventListener("click", () => {
                            
                            number_likes.innerText = parseInt(number_likes) + 1;
                        })
                    })

                });


            })
            .catch(err => console.error('Erro ao carregar posts:', err));


            

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