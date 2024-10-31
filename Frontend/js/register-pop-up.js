// document.addEventListener('DOMContentLoaded', () => {
//     const profilePics = document.querySelectorAll('.profile-pic');
//     const selectedPictureInput = document.getElementById('selectedProfilePicture');

//     if(!selectedPictureInput) {
//         document.getElementById('selectedProfilePicture').value = 'defaultphoto.jpg';
//     }

//     profilePics.forEach(pic => {
//         pic.addEventListener('click', () => {
//             selectedPictureInput.value = pic.src.split('/').pop(); // Extrai o nome do arquivo da URL
//             // Remove a classe de seleção de todas as imagens
//             profilePics.forEach(p => p.classList.remove('selected')); 
//             // Adiciona a classe de seleção à imagem clicada
//             pic.classList.add('selected'); 
//         });
//     });
// });