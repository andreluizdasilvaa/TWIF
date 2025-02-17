const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
    // Lista de imagens de perfil disponíveis
    const profilePictures = [
        'defaultphoto.png',
        'profile1.png',
        'profile2.png',
        'profile3.png',
        'profile4.png',
        'profile5.png',
        'profile6.png',
        'profile7.png',
        'profile8.png',
        'profile9.png',
        'profile10.png',
        'profile11.png',
        'profile12.png',
        'profile13.png',
        'profile14.png',
        'profile15.png',
    ];

    // Gerar 10 usuários
    const users = [];
    for (let i = 0; i < 10; i++) {
        // Definir o domínio do e-mail
        const isAlunoEmail = Math.random() < 0.7; // 70% chance de gerar e-mail com @aluno.ifsp.edu.br
        const email = isAlunoEmail ? `${faker.internet.userName()}@aluno.ifsp.edu.br` : `${faker.internet.userName()}@ifsp.edu.br`;

        const user = await prisma.user.create({
            data: {
                email: email,
                senha: faker.internet.password(),
                usernick: faker.internet.username(), // Substituído para evitar depreciação
                nome: faker.person.fullName(),
                isadmin: faker.datatype.boolean(),
                profilePicture: profilePictures[Math.floor(Math.random() * profilePictures.length)],
            },
        });
        users.push(user);
    }

    console.log('Usuários criados:', users.length);

    // Gerar 20 postagens aleatórias associadas aos usuários
    const posts = [];
    for (let i = 0; i < 20; i++) {
        const post = await prisma.post.create({
            data: {
                content: faker.lorem.paragraph(1).slice(0, 255), // Limita o tamanho do texto a 255 caracteres
                userId: users[Math.floor(Math.random() * users.length)].id,
            },
        });
        posts.push(post);
    }

    console.log('Postagens criadas:', posts.length);

    // Gerar 50 comentários aleatórios associados aos usuários e postagens
    const comments = [];
    for (let i = 0; i < 50; i++) {
        const comment = await prisma.comment.create({
            data: {
                content: faker.lorem.sentence(10).slice(0, 255), // Limita o texto a 255 caracteres
                postId: posts[Math.floor(Math.random() * posts.length)].id,
                userId: users[Math.floor(Math.random() * users.length)].id,
            },
        });
        comments.push(comment);
    }

    console.log('Comentários criados:', comments.length);

    // Gerar 100 curtidas aleatórias associadas aos usuários e postagens
    const likes = [];
    for (let i = 0; i < 100; i++) {
        try {
            const like = await prisma.like.create({
                data: {
                    postId: posts[Math.floor(Math.random() * posts.length)].id,
                    userId: users[Math.floor(Math.random() * users.length)].id,
                },
            });
            likes.push(like);
        } catch (error) {
            // Ignorar duplicatas por causa da restrição @@unique([userId, postId])
            if (error.code === 'P2002') {
                console.log('Curtida duplicada ignorada');
            } else {
                throw error;
            }
        }
    }

    console.log('Curtidas criadas:', likes.length);
}

main()
    .catch((error) => {
        console.error('Erro durante o seeding:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// Pra rodar: npx prisma db seed