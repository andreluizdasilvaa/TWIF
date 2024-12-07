addEventListener('DOMContentLoaded', async () => {
    document.getElementById('quant_posts').innerText = await getTotalPosts()
    document.getElementById('quant_usuarios').innerText = await getTotalUsuarios()
    document.getElementById('media_curtidas').innerText = await mediaCurtidasPorPost()
    document.getElementById('media_comentarios').innerText = await mediaCurtidasPorPost()
})

//Pegando total de comentarios
async function getTotalComentarios() {
    let result = await fetch('/relatorios/comentarios')
    .then(response => response.json())
    .then(data => {
        return data.quantidade
    })
    .then(r => {
        return r
    })
    .catch(r => {
        return 0
    })
    return result
}

//Pegando total de curtidas
async function getTotalCurtidas() {
    let result = await fetch('/relatorios/curtidas')
    .then(response => response.json())
    .then(data => {
        document.getElementById('').innerText = data.quantidade
        return data.quantidade
    })
    .then(r => {
        return r
    })
    .catch(r => {
        return 0
    })
    return result
}

//Pegando total de usuarios
async function getTotalUsuarios() {
    let result = await fetch('/relatorios/usuarios')
    .then(response => response.json())
    .then(data => {
        document.getElementById('quant_usuarios').innerText = data.quantidade
        return data.quantidade
    })
    .then(r => {
        return r
    })
    .catch(r => {
        return 0
    })
    return result
}  

//Pegando total de posts
async function getTotalPosts() {
    let result = await fetch('/relatorios/posts')
    .then(response => response.json())
    .then(data => {
        return data.quantidade
    })
    .then(r => {
        return r
    })
    .catch(r => {
        return 0
    })
    return result
}

//Media de comentarios por Post
const mediaComentarioPorPost = async () => {
    let resultPost = await getTotalPosts()
    let resultComentarios =  await getTotalComentarios()
    let resultado =  Math.floor(!Number.isNaN(resultComentarios / resultPost) ? (resultComentarios / resultPost) : 0)
    return resultado
}

//Media de comentarios por Post
const mediaCurtidasPorPost = async () => {
    let resultPost = await getTotalPosts()
    let resultCurtidas =  await getTotalCurtidas()
    let resultado =  Math.floor(!Number.isNaN(resultCurtidas / resultPost) ? (resultCurtidas / resultPost) : 0)
    return resultado
}

async function buscarNomeUsuario() {
    try {
        const resposta = await fetch('/user/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Inclua o token se necessário
            }
        });
        const data = await resposta.json();

        if (data.nome) {
            localStorage.setItem('nomeUsuario', data.nome);
            document.getElementById('nome-usuario').textContent = data.nome;
        }
    } catch (error) {
        console.error('Erro ao buscar nome do usuário:', error);
    }
}

buscarNomeUsuario();

// Adicione isso após as suas funções existentes

document.addEventListener('DOMContentLoaded', async () => {
    // Chama a função para renderizar o gráfico de usuários
    await renderUserChart();
});

// Função para buscar e renderizar o gráfico de usuários
async function renderUserChart() {
    const totalUsuarios = await getTotalUsuarios();
    const totalAdmins = await getTotalAdmins(); // Função que você precisará criar

    const ctx = document.getElementById('userChart').getContext('2d');
    const userChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Alunos', 'Administradores'],
            datasets: [{
                label: 'Quantidade de Usuários',
                data: [totalUsuarios - totalAdmins, totalAdmins], // Total de usuários normais e administradores
                backgroundColor: ['#011214', '#7EC543'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Distribuição de Usuários'
                }
            }
        }
    });
}

// Função para obter a quantidade de administradores
async function getTotalAdmins() {
    let result = await fetch('/relatorios/usuarios/admins') // Endpoint que você precisa implementar
        .then(response => response.json())
        .then(data => {
            return data.quantidade;
        })
        .catch(error => {
            console.error('Erro ao obter total de administradores:', error);
            return 0;
        });
    return result;
}


