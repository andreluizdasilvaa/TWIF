import CONFIG from "../config.js";
import verifyErrorsApi from "../utils/verifyErrorsApi.js";

export default function allFunctionRelatorio() {
    // Função que é chamada quando o DOM é totalmente carregado
    addEventListener('DOMContentLoaded', async () => {
        document.getElementById('quant_posts').innerText = await getTotalPosts();
        document.getElementById('quant_usuarios').innerText = await getTotalUsuarios();
        document.getElementById('media_curtidas').innerText = await mediaCurtidasPorPost();
        document.getElementById('media_comentarios').innerText = await mediaComentarioPorPost();

        await renderUserChart();
    });

    //F

    // Função para pegar o total de comentários
    async function getTotalComentarios() {
        try {
            const response = await fetch(`${CONFIG.URL_API}/relatorios/comentarios`, {
                credentials: 'include'
            });
            if(!response.ok) {
                verifyErrorsApi(response);
                console.error('Erro na requisição', response);
                return;
            }
            const data = await response.json();
            return data.quantidade;
        } catch (error) {
            console.error('Erro ao obter total de comentários:', error);
            return 0;
        }
    }

    // Função para pegar o total de curtidas
    async function getTotalCurtidas() {
        try {
            const response = await fetch(`${CONFIG.URL_API}/relatorios/curtidas`, {
                credentials: 'include'
            });
            if(!response.ok) {
                verifyErrorsApi(response);
                console.error('Erro na requisição', response);
                return;
            }
            const data = await response.json();
            return data.quantidade;
        } catch (error) {
            console.error('Erro ao obter total de curtidas:', error);
            return 0;
        }
    }

    // Função para pegar o total de usuários
    async function getTotalUsuarios() {
        try {
            const response = await fetch(`${CONFIG.URL_API}/relatorios/usuarios`, {
                credentials: 'include'
            });
            if(!response.ok) {
                verifyErrorsApi(response);
                console.error('Erro na requisição', response);
                return;
            }
            const data = await response.json();
            return data.quantidade;
        } catch (error) {
            console.error('Erro ao obter total de usuários:', error);
            return 0;
        }
    }

    // Função para pegar o total de posts
    async function getTotalPosts() {
        try {
            const response = await fetch(`${CONFIG.URL_API}/relatorios/posts`, {
                credentials: 'include'
            });
            if(!response.ok) {
                verifyErrorsApi(response);
                console.error('Erro na requisição', response);
                return;
            }
            const data = await response.json();
            return data.quantidade;
        } catch (error) {
            console.error('Erro ao obter total de posts:', error);
            return 0;
        }
    }

    // Função para calcular a média de comentários por post
    const mediaComentarioPorPost = async () => {
        let resultPost = await getTotalPosts();
        let resultComentarios = await getTotalComentarios();
        let resultado = !Number.isNaN(resultComentarios / resultPost) ? (resultComentarios / resultPost) : 0;

        // Formatar para mostrar apenas os dois primeiros dígitos
        return resultado.toFixed(2).slice(0, 4); // Exibe 2 dígitos decimais
    }

    // Função para calcular a média de curtidas por post
    const mediaCurtidasPorPost = async () => {
        let resultPost = await getTotalPosts();
        let resultCurtidas = await getTotalCurtidas();
        let resultado = !Number.isNaN(resultCurtidas / resultPost) ? (resultCurtidas / resultPost) : 0;

        // Formatar para mostrar apenas os dois primeiros dígitos
        return resultado.toFixed(2).slice(0, 4); // Exibe 2 dígitos decimais
    }

    // Função para buscar e definir o nome do usuário
    async function buscarNomeUsuario() {
        try {
            const resposta = await fetch(`${CONFIG.URL_API}/user/me`, {
                method: 'GET',
                credentials: 'include'
                // headers: {
                //     'Authorization': `Bearer ${localStorage.getItem('token')}` // Inclua o token se necessário
                // }
            });
            const data = await resposta.json();

            if (data.nome) {
                localStorage.setItem('nomeUsuario', data.nome);
                document.getElementById('nome-usuario').textContent = data.nome;
                document.getElementById('link_pf_user_adm').href = `/perfil/${data.usernick}`;
            }
        } catch (error) {
            console.error('Erro ao buscar nome do usuário:', error);
        }
    }

    // Chama a função para buscar o nome do usuário ao carregar a página
    buscarNomeUsuario();

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
                    hoverOffset: 4,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 12, // Tamanho da fonte dos labels da legenda
                                family: 'Lexend Deca' // Família da fonte
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribuição de Usuários',
                        font: {
                            size: 14, // Tamanho da fonte do título
                            family: 'Lexend Deca'
                        }
                    }
                }
            }
        });
    }

    // Função para obter a quantidade de administradores
    async function getTotalAdmins() {
        try {
            const response = await fetch(`${CONFIG.URL_API}/relatorios/usuarios/admins`, {
                credentials: 'include'
            }); 
            // Endpoint que você precisa implementar
            const data = await response.json();
            return data.quantidade;
        } catch (error) {
            console.error('Erro ao obter total de administradores:', error);
            return 0;
        }
    }
}