import modalAvatarSelection from "./modules/ui/modalAvatarSelection.js";
import registerForm from "./modules/auth/registerHandler.js";
import darkModeRegister from "./modules/ui/darkModeRegister.js";

document.addEventListener('DOMContentLoaded', () => {
    modalAvatarSelection();
    registerForm();
    darkModeRegister();
});