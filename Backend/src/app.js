const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
var cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// importação do middleware para verificar a autenticação do token
const { auth_user, generate_token_user, remove_session } = require('./middlewares/auth');
const relatorios = require('./relatorios');

dotenv.config(); // mostra ao dotenv onde está o arq .env no
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Permite que o Express entenda dados de formulários HTML ( url ex: /html/tal.html)

// Middleware para servir arquivos estáticos (CSS, imagens, etc.)
app.use(express.static(path.join(__dirname, '..', '..', 'Frontend'))); // Define a pasta onde estão os arquivos estáticos
app.use(cookieParser()); // Para lidar com cookies

// | =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-| ROTAS GET |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= |

// Rota para carregar a página inicial
app.get('/', (req, res) => {
    // Se o usuário estiver autenticado, redireciona para /feed
    const sessionCookie = req.cookies['your-session'];
    if (sessionCookie) {
        return res.redirect('/feed');
    } 
    
    // Envia o arquivo index.html quando a rota raiz ("/") é acessada
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'index.html'));
});

// Rota para relatórios (apenas para Admins)
app.use('/relatorios', relatorios)

// Rota para carregar o formulário de cadastro
app.get('/register', (req, res) => {
    // Envia o arquivo cadastro-TESTE.html quando a rota "/register" é acessada
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'cadastre-se.html'));
});

// Rota para carregar o formulario de suporte
app.get('/suporte', (req, res) => {
    // Envia o arquivo suporte.html quando a rota "/suporte" é acessada
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'suporte.html'));
});

// Rota para carregar a pagina sobre nós.
app.get('/sobrenos', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'sobrenos.html'));
});

// Rota para carregar o feed
app.get('/feed', auth_user, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'feed.html'));
});

// Rota para carregar o feed
app.get('/comments', auth_user, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'comments.html'));
});

// Rota para carregar a pagina de perfil do user
app.get('/perfil/:usernick', auth_user, (req, res) => {
    // ..
    // Envia o arquivo perfil.html quando a rota "/suporte" é acessada
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'perfil.html'));
});

app.get('/user/me', auth_user, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }, // Usa o userId do token
            select: { id: true, nome: true, profilePicture: true, usernick: true, isadmin: true },
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar o usuário');
    }
});

// Rota para retornar todos os posts do DB
app.get('/feed/posts', auth_user, async (req, res) => {
    try {
        const userId = req.user.id; // ID do usuário autenticado

        const posts = await prisma.post.findMany({
            include: {
                user: {
                    select: {
                        nome: true,
                        profilePicture: true,
                        usernick: true,
                    },
                },
                comments: true,
                likes: {
                    select: {
                        userId: true,
                    },
                },
            },
            orderBy: [
                {
                    likes: {
                        _count: 'desc',
                    },
                },
                {
                    createdAt: 'desc', // Ordem decrescente pela data de criação
                },
            ],
        });

        // Adiciona o campo 'likedByCurrentUser' em cada post usando um loop for
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            let likedByCurrentUser = false;

            // Itera sobre cada curtida do post para verificar se o usuário curtiu
            for (let j = 0; j < post.likes.length; j++) {
                if (post.likes[j].userId === userId) {
                    likedByCurrentUser = true;
                    break; // Interrompe a busca após encontrar a curtida do usuário
                }
            }

            post.likedByCurrentUser = likedByCurrentUser;
        }

        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Erro interno ao enviar posts p/Feed, entre em contato com o suporte',
        });
    }
});

// Rota para acessar o perfil pelo usernick
app.get('/api/perfil/:usernick', auth_user, async (req, res) => {
    const { usernick } = req.params;
    const userId = req.user.id; // ID do usuário autenticado
    const isAdmin = req.user.isadmin;

    try {
        // Busca o usernick do usuário autenticado
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { usernick: true },
        });

        if (!currentUser) {
            return res.status(404).json({ message: 'Usuário autenticado não encontrado' });
        }

        // Define a flag `isCurrentUser` comparando o usernick da URL com o usernick do usuário logado
        const isCurrentUser = currentUser.usernick === usernick;

        // Busca o perfil do usuário acessado
        const user = await prisma.user.findUnique({
            where: { usernick: usernick },
            select: {
                nome: true,
                profilePicture: true,
                usernick: true,
                isadmin: true,
                posts: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        comments: true,
                        likes: {
                            select: {
                                userId: true,
                            },
                        },
                    },
                },
            },
        });


        if (user) {
            user.isCurrentUser = isCurrentUser; // Adiciona a flag `isCurrentUser`
            user.my_user_admin = isAdmin; // Adiciona a flag 'isadmin' para permissão de adm
            

            // Adiciona o campo `likedByCurrentUser` em cada post
            for (let post of user.posts) {
                post.likedByCurrentUser = post.likes.some(like => like.userId === userId);
            }

            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar o usuário' });
    }
});

// Rota GET para listar os comentários de um post específico a partir do perfil do usuário
app.get('/users/:userId/posts/:postId/comments', auth_user, async (req, res) => {
    const { userId, postId } = req.params;

    try {
        // Verifica se o usuário está acessando os comentários de um post que pertence a ele
        const userPosts = await prisma.post.findMany({
            where: {
                userId: parseInt(userId), // Verifica se o post pertence ao usuário
                id: parseInt(postId) // Verifica o ID do post
            }
        });

        // Se não houver posts correspondentes, retorna 404
        if (userPosts.length === 0) {
            return res.status(404).json({ msg: 'Post não encontrado ou não pertence ao usuário' });
        }

        // Busca os comentários do post específico
        const comments = await prisma.comment.findMany({
            where: { postId: parseInt(postId) },
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        usernick: true,
                        profilePicture: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' }, // Ordena os comentários pela data de criação
        });

        res.status(200).json(comments); // Retorna os comentários encontrados
    } catch (error) {
        console.error('Erro ao listar os comentários:', error);
        res.status(500).json({ msg: 'Erro ao listar os comentários' });
    }
});

// Rota para retornar todas as informações do usuario que está acessando a rota
app.get('/user/me', auth_user, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }, // Usa o userId do token
            select: {
                id: true,   
                nome: true,
                profilePicture: true,
                usernick: true,
                isadmin: true,
                posts: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true
                    }
                },
            },
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar o usuário');
    }
});

// Rota para se o usuario não for encontrado
app.get('/user404', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'user_page_404.html'));
})

app.get('/posts/:postId', auth_user, async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
            include: {
                user: {
                    select: {
                        nome: true,
                        usernick: true,
                        profilePicture: true,
                    },
                },
            },
        });

        if (!post) {
            return res.status(404).json({ msg: 'Post não encontrado' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Erro ao buscar o post:', error);
        res.status(500).json({ msg: 'Erro ao buscar o post' });
    }
});


  // Rota GET para listar os comentários
app.get('/posts/:postId/comments', auth_user, async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await prisma.comment.findMany({
            where: { postId: parseInt(postId) },
            include: {
                user: {
                    select: {
                        id: true,   
                        nome: true,
                        usernick: true,
                        profilePicture: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json(comments);
    } catch (error) {
        console.error('Erro ao listar os comentários:', error);
        res.status(500).json({ msg: 'Erro ao listar os comentários' });
    }
});

app.get('/notaccess', auth_user, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'Page_acesso_negado.html'));
})

// Rota para Erro 404 ( SEMPRE DEIXE ESSA ROTA POR ULTIMO, DE CIMA PARA BAIXO );
app.get('*', (req, res) => {
    // Envia o arquivo Page_404.html quando uma rota não declarada e feita
    res.status(404).sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'Page_404.html'));
});

// | =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=| ROTAS POST |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= |

// Rota para processar o cadastro de um novo usuário
app.post('/register', async (req, res) => {
    const { email, senha, usernick, nome, profilePicture } = req.body;

    // VALIDAÇÃO

    // Inicializa isAdmin como false
    let isadmin = false;

    // VALIDAÇÃO DE DOMÍNIO DO EMAIL
    if (/^[a-zA-Z0-9._%+-]+@aluno\.ifsp\.edu\.br$/.test(email)) {
        isadmin = false; // E-mail de aluno
    } else if (/^[a-zA-Z0-9._%+-]+@ifsp\.edu\.br$/.test(email)) {
        isadmin = true; // E-mail adm
    } else {
        return res.status(400).json({ msg: 'Email inválido. Use um e-mail do domínio ifsp.edu.br' });
    }

    try {
        // Verifica se um usuário com o mesmo e-mail já existe
        const existingMail = await prisma.user.findUnique({
            where: { email },
        });

        // Verifica se o @user já existe no banco de dados
        const existingUser = await prisma.user.findUnique({
            where: { usernick },
        });

        // Se o e-mail ou matrícula já estiverem cadastrados, retorna um erro
        if (existingMail || existingUser) {
            return res.status(400).json({ msg: 'Email ou @user já cadastrados!' });
        }

        // Criptografando a senha com proteção 8
        const senhaHash = await bcrypt.hash(senha, 8);

        // Cria um novo usuário no banco de dados com os dados fornecidos
        const user = await prisma.user.create({
            data: {
                nome,
                email,
                usernick,
                senha: senhaHash,
                profilePicture,
                isadmin: isadmin,
            },
            select: {
                nome: true,
                email: true,
            },
        });
        console.log(user);
        return res.redirect('/?success=true'); // Redireciona o usuário para a página inicial com um parâmetro de sucesso
    } catch (error) {
        // Se ocorrer um erro inesperado, retorna um erro 500 (Internal Server Error)
        console.error(error);
        res.status(500).json({ msg: 'Erro interno ao cadastrar usuario, entre em contato com o suporte' });
    }
});

// Rota para processar o login
app.post('/', async (req, res) => {
    const { email, senha } = req.body;
    try {
        let user;

        user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        // verifica se o usuario existe
        if (!user) {
            return res.redirect('/?error=1');
        }

        // compara a senha fornecida com a senha que está armazenada no DB( Criptografada ), e se for a mesma retorna um true
        const IspasswordValid = await bcrypt.compare(senha, user.senha);

        // Verifica se a senha é valida
        if (!IspasswordValid) {
            return res.redirect('/?error=1');
        }

        // Gere o token e configure o cookie
        generate_token_user(user, req, res, () => {
            res.status(201).redirect('/feed');
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Erro interno ao Fazer login, entre em contato com o suporte',
        });
    }
});

// Rota para criar um post
app.post('/feed', auth_user, async (req, res) => {
    const { conteudo } = req.body;

    try {
        if (!conteudo) {
            res.redirect('/feed?error=1');
            return;
        }

        // cadastro no DB
        const post = await prisma.post.create({
            data: {
                content: conteudo,
                userId: req.user.id
            },
        });

        res.status(201).json({msg: "Post criado com sucesso!"});
    } catch (err) {
        console.error('Erro ao criar um Post, Erro: ',err);
        res.status(500).json({ msg: 'Erro interno ao criar um Post, entre em contato com o suporte'});
    };
});

// Rota para curtir/descurtir um post
app.post('/posts/:postId/like', auth_user, async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id; 

    try {
        // Verifica se o usuário já curtiu a postagem
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: userId,
                    postId: parseInt(postId),
                },
            },
        });

        if (existingLike) {
            // Se já curtiu, remove a curtida (descurtir)
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
            return res.json({ message: 'Curtida removida' });
        } else {
            // Caso contrário, adiciona uma nova curtida
            await prisma.like.create({
                data: {
                    userId: userId,
                    postId: parseInt(postId),
                },
            });
            return res.json({ message: 'Post curtido' });
        }
    } catch (error) {
        console.error('Erro ao curtir/descurtir post, Erro: ', error);
        res.status(500).json({ message: 'Erro interno ao curtir/descurtir post, entre em contato com o suporte'});
    }
});

// | =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=| ROTAS DELETE |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= |

// Ecerrar sessão do usuario = delete -> cookie
app.delete('/logout', auth_user, (req, res)=> {
    try {
        remove_session(req, res);
    } catch (error) {
        console.error('Erro ao encerrar sessão do user, Erro: ', error);
        res.status(500).json({ message: 'Erro interno ao encerrar sessão, entre em contato com o suporte'});
    }
});

// Deletar um post do DB com base no id dele
app.delete('/delete/post', auth_user, async (req, res) => {
    let { idPost } = req.body; // Supondo que o ID do post seja enviado no corpo da requisição

    idPost = parseInt(idPost, 10);

    if (isNaN(idPost)) {
        return res.status(400).json({ message: 'ID do post inválido.' });
    }

    try {
        // Verifica se o post existe
        const post = await prisma.post.findUnique({
            where: {
                id: idPost,
            },
        });

        // Se o post não existir, retorna erro
        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado.' });
        }

        // Verifica se o usuário é o autor do post ou um administrador
        if (post.userId !== req.user.id && !req.user.isadmin) {
            return res.status(403).json({ message: 'Você não tem permissão para deletar este post.' });
        }

        // Deleta comentários e likes associados ao post
        await prisma.comment.deleteMany({
            where: {
                postId: idPost,
            },
        });

        await prisma.like.deleteMany({
            where: {
                postId: idPost,
            },
        });

        // Deleta o post
        await prisma.post.delete({
            where: {
                id: idPost,
            },
        });

        // Retorna sucesso
        res.status(200).json({ message: 'Post deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao deletar o post." });
    }
});

// | =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=| ROTAS Patch |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= |

app.patch('/api/troca/avatar/:avatar', auth_user, async (req, res) => {
    try {
        const url_profile_picture = req.params.avatar;
        const userId = req.user.id;

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                profilePicture: url_profile_picture
            }
        })

        if(!user) {
            res.json({ msg: "Erro ao atualizar profile picture" })
        }

        res.status(201).json({ msg: "Sucesso ao atualizar profile picture" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar foto de perfil." });
    }
});


// Rota POST para criar um comentário
app.post('/posts/:postId/comments', auth_user, async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    try {
        if (!content || content.trim() === '') {
            return res.status(400).json({ msg: 'O comentário não pode estar vazio' });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: parseInt(postId),
                userId: req.user.id,
            },
            include: {
                user: {
                    select: {
                        nome: true,
                        usernick: true,
                        profilePicture: true,
                    },
                },
            },
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error('Erro ao criar comentário:', error);
        res.status(500).json({ msg: 'Erro ao criar o comentário' });
    }
});


  
  // Rota DELETE para excluir um comentário
  app.delete('/feed/posts/:postId/comments/:commentId', auth_user, async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.isadmin;
  
    try {
      const comment = await prisma.comment.findUnique({ where: { id: parseInt(commentId) } });
  
      if (!comment) return res.status(404).json({ msg: 'Comentário não encontrado' });
  
      if (comment.userId !== userId && !isAdmin) {
        return res.status(403).json({ msg: 'Você não tem permissão para excluir este comentário' });
      }
  
      await prisma.comment.delete({ where: { id: parseInt(commentId) } });
  
      res.status(200).json({ msg: 'Comentário deletado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Erro ao excluir o comentário' });
    }
  });
  

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});