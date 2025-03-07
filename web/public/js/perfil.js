import infoPerfil from "./modules/perfil/infoPerfil.js";
import loaduserPosts from "./modules/perfil/LoaduserPosts.js";
import replaceProfilePicture from "./modules/perfil/replaceProfilePicture.js";
import modalLogout from "./modules/perfil/modalLogout.js";
import submitPost from "./modules/feed/submitPost.js";
import darkModePerfil from "./modules/ui/darkModePerfil.js";

document.addEventListener('DOMContentLoaded', () => {
    infoPerfil();
    loaduserPosts();
    replaceProfilePicture();
    modalLogout();
    submitPost();
    darkModePerfil();
});