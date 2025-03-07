export default function darkModeFeed() {
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
}