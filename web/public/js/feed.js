import listAllPost from "./modules/feed/listAllPosts.js";
import myUserInfo from "./modules/feed/myUserInfo.js";
import toggleModalBurguer from "./modules/feed/feedModalBurguer.js";
import submitPost from "./modules/feed/submitPost.js";

document.addEventListener('DOMContentLoaded', () => {
    myUserInfo();
    listAllPost();
    toggleModalBurguer();
    submitPost();
});