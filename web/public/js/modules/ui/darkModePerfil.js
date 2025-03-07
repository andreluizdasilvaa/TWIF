export default function darkModePerfil() {
    // theme.js
    const body = document.body;
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeKey = 'darkMode';

    // Função para alternar entre o modo claro e escuro
    function toggleDarkMode() {
        const isDarkMode = body.classList.toggle('dark-mode');
        localStorage.setItem(darkModeKey, isDarkMode); // Armazena a preferência
    }

    // Função para aplicar o tema ao carregar a página
    function applyStoredTheme() {
        const isDarkMode = localStorage.getItem(darkModeKey) === 'true';
        if (isDarkMode) {
            body.classList.add('dark-mode');
        }
    }

    // Chama a função para aplicar o tema ao carregar a página
    applyStoredTheme();

    // Adiciona um event listener para alternar o modo
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
}