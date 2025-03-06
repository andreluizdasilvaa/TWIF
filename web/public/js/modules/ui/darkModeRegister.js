export default function darkModeRegister() {
    // Dark mode toggle functionality
    const darkModeSwitch = document.getElementById('dark-mode-switch');
    const logo = document.getElementById('logo');
    const body = document.body;

    darkModeSwitch.addEventListener('change', () => {
        if (darkModeSwitch.checked) {
            body.classList.add('dark-mode');
            logo.src = '../assets/img/logo-white.svg'; // Altera para a logo clara
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            logo.src = '../assets/img/logo-dark.svg'; // Altera para a logo escura
            localStorage.setItem('dark-mode', 'disabled');
        };
    });

    // Check for saved dark mode preference
    if (localStorage.getItem('dark-mode') === 'enabled') {
        darkModeSwitch.checked = true;
        body.classList.add('dark-mode');
        logo.src = '../assets/img/logo-white.svg'; // Altera para a logo clara se o modo escuro estiver ativado
    };
};