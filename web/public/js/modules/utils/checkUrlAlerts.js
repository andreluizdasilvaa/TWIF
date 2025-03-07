export default function checkUrlAlert() {
    // Obtém os parâmetros da query string da URL
    const urlParams = new URLSearchParams(window.location.search);
    // grada a URL com as queryes
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    switch (true) {
        case success === 'true':
            alert('Cadastrado com SUCESSO!');
            window.location.href = '/';
            break;

        case error === '1':
            alert('Email ou Senha Incorreto!');
            window.location.href = '/';
            break;

        case error === '2':
            alert('Senha Incorreta');
            window.location.href = '/';
            break;

        case error === '3':
            alert('Faça Login para acessar!');
            window.location.href = '/';
            break;

        case error === '4':
            alert('Sessão invalida!');
            window.location.href = '/';
            break;

        default:
            break;
    }
}