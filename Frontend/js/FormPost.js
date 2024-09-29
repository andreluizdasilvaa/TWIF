export class FormPost{
    constructor(idForm, idTextarea, idUlPost) {
        this.form = document.getElementById(idForm);
        this.textarea = document.getElementById(idTextarea);
        this.ulPost = document.getElementById(idUlPost);
        this.addSubmit();
    }
    console(){
        return console.log(`Esta é a mensagem: ${this.teste}`)
    }

    onSubmit(func){
        this.form.addEventListener('submit', func)
    }

    formValidate(value) {
        if(value === '' || value === null || value === undefined || value.lenght <2) {
            return false
        }
            return true
    }

    getTime(){
        const time = new Date();
        const hour = time.getHours();
        const minutes = time.getMinutes();
        return `${hour}h ${minutes}min`
    }

    addSubmit(){
        const handleSubmit = (event) => {
            event.preventDefault();
            if (this.formValidate(this.textarea.value)) {
            const time = this.getTime();
            const newPost = document.createElement('li');
            newPost.classList.add('post');
            newPost.innerHTML = 
            `   <div class="infoUserPost">
                    <div class="imgUserPost"></div>

                    <div class="nameAndHour">
                        <strong>Douglas Pujol</strong>
                        <p>${time}</p>
                    </div>
                </div>

                <p>
                    ${this.textarea.value}
                </p>

                <div class="actionBtnPost">
                    <button type="button" class="filesPost like"><i class="ph-bold ph-heart"></i></button>

                    <button type="button" class="filesPost comment"><i class="ph-bold ph-chat-circle"></i></button>
                </div>
                `;
                this.ulPost.append(newPost);
                this.textarea.value = "";
            } else {
                alert('Verifique o campo digitado.')
            }
        }
             
        this.onSubmit(handleSubmit)
    }

}

const postForm = new FormPost('formPost', 'textarea', 'posts')