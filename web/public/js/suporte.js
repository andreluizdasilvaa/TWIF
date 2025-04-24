document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('button').addEventListener('click', async (event) => {
        event.preventDefault();  // Evita o comportamento padrão de envio de formulário

        const nome = document.getElementById('input-nome').value;
        const email = document.getElementById('input-email').value;
        const problema = document.getElementById('input-texto').value;

        // Verifique se todos os campos foram preenchidos
        if (!nome || !email || !problema) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/suporte/support', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, email, problema }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.msg);
                document.getElementById('input-nome').value = '';
                document.getElementById('input-email').value = '';
                document.getElementById('input-texto').value = '';
            } else {
                alert(result.msg || 'Ocorreu um erro, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
            alert('Erro ao enviar os dados. Tente novamente mais tarde.');
        }
    });
});
