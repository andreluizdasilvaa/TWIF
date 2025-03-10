import listAllPost from "./modules/feed/listAllPosts.js";
import myUserInfo from "./modules/feed/myUserInfo.js";
import toggleModalBurguer from "./modules/feed/feedModalBurguer.js";
import submitPost from "./modules/feed/submitPost.js";
import submitPostInNewModal from "./modules/feed/submitPostInNewModal.js";
import darkModeFeed from "./modules/ui/darkModeFeed.js";
import voltarTopoFeed from "./modules/ui/voltarTopoFeed.js";

document.addEventListener('DOMContentLoaded', () => {
    myUserInfo();
    listAllPost();
    toggleModalBurguer();
    submitPost();
    submitPostInNewModal();
    darkModeFeed();
    voltarTopoFeed();
});