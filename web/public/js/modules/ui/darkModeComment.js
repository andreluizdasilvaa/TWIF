export default function darkModeComment() {
    // theme.js
    const body = document.body;
    const logoHeader = document.getElementById('logo_header');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeKey = 'darkMode';

    // Função para alternar entre o modo claro e escuro
    function toggleDarkMode() {
        const isDarkMode = body.classList.toggle('dark-mode');
        logoHeader.src = isDarkMode ? '../assets/img/logo-white.svg' : '../assets/img/logo-dark.svg'; // Muda a logo
        localStorage.setItem(darkModeKey, isDarkMode); // Armazena a preferência
    }

    // Função para aplicar o tema ao carregar a página
    function applyStoredTheme() {
        const isDarkMode = localStorage.getItem(darkModeKey) === 'true';
        if (isDarkMode) {
            body.classList.add('dark-mode');
            logoHeader.src = '../assets/img/logo-white.svg'; // Logo branca
        } else {
            logoHeader.src = '../assets/img/logo-dark.svg'; // Logo colorida como padrão
        }
    }

    // Chama a função para aplicar o tema ao carregar a página
    applyStoredTheme();

    // Adiciona um event listener para alternar o modo
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
}