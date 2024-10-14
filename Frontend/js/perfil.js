// function voltarAoFeed() {
//     document.getElementById(icone-voltar).location.href='../html/feed.html'
// };

// // function LogOut();

// // function alterarFoto()


// //==//==//==//==//==//==//==//
// // FORMULÁRIO DE POSTAGENS  //
// //==//==//==//==//==//==//==//

// export class FormPost{
//     constructor(idForm, idTextarea, idUlPost) {
//         this.form = document.getElementById(idForm);
//         this.textarea = document.getElementById(idTextarea);
//         this.ulPost = document.getElementById(idUlPost);
//         this.addSubmit();
//     }
//     console(){
//         return console.log(`Esta é a mensagem: ${this.teste}`)
//     }

//     onSubmit(func){
//         this.form.addEventListener('submit', func)
//     }

//     formValidate(value) {
//         if(value === '' || value === null || value === undefined || value.lenght <2) {
//             return false
//         }
//             return true
//     }

//     getTime(){
//         const time = new Date();
//         const hour = time.getHours();
//         const minutes = time.getMinutes();
//         return `${hour}h ${minutes}min`
//     }

//     addSubmit(){
//         const handleSubmit = (event) => {
//             event.preventDefault();
//             if (this.formValidate(this.textarea.value)) {
//             const time = this.getTime();
//             const newPost = document.createElement('li');
//             newPost.classList.add('post');
//             newPost.innerHTML = 
//             `   <div class="infoUserPost">
//                     <div class="imgUserPost"></div>

//                     <div class="nameAndHour">
//                         <strong>Douglas Pujol</strong>
//                         <p>${time}</p>
//                     </div>
//                 </div>

//                 <p>
//                     ${this.textarea.value}
//                 </p>

//                 <div class="actionBtnPost">
//                     <button type="button" class="filesPost like"><i class="ph-bold ph-heart"></i></button>

//                     <button type="button" class="filesPost comment"><i class="ph-bold ph-chat-circle"></i></button>
//                 </div>
//                 `;
//                 this.ulPost.append(newPost);
//                 this.textarea.value = "";
//             } else {
//                 alert('Verifique o campo digitado.')
//             }
//         }
             
//         this.onSubmit(handleSubmit)
//     }

// }

// const postForm = new FormPost('formPost', 'textarea', 'posts')

// Não funfo esse codigo de cima  ):



// Modal de logout
document.addEventListener('DOMContentLoaded', ()=> {
    const icone_logout = document.getElementById('icone-logout');
    const modal_logout = document.getElementById('modal_logout');
    const model_button_cancelar = document.getElementById('button_logout_cancelar');
    const model_button_sair = document.getElementById('button_logout_sair');
    const overlay = document.getElementById('overlay');

    icone_logout.addEventListener("click", ()=> {
        modal_logout.style.display = 'flex'
        overlay.style.display = 'block';
    })
    model_button_cancelar.addEventListener('click', ()=> {
        modal_logout.style.display = 'none'
        overlay.style.display = 'none';
    })

    model_button_sair.addEventListener('click', ()=> {
        // toda logica para remover o cookie com token jwt
        
    })
})

