// Obtém o modal
var modal = document.getElementById("avatarModal");

// Obtém o botão que abre o modal
var btn = document.getElementById("botao-cadastrar");

// Obtém o elemento <span> que fecha o modal
var span = document.getElementsByClassName("close")[0];

// Quando o usuário clica em <span> (x), fecha o modal
span.onclick = function() {
    modal.style.display = "none";
}

// Quando o usuário clica em qualquer lugar fora do modal, fecha-o
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Obtém todos os botões de avatar
var avatarButtons = document.querySelectorAll('.avatar-button');

// Trata a seleção de avatar
avatarButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        // Obtém o src da imagem dentro do botão clicado
        var avatarSrc = this.querySelector('img').src;
        
        // Extrai apenas o nome do arquivo do avatar
        var avatarFileName = avatarSrc.split('/').pop();
        
        // Define o valor do campo escondido com o nome do arquivo do avatar escolhido
        document.getElementById('avatar-escolhido').value = avatarFileName;

        // Remove a classe 'selected' de todos os botões
        avatarButtons.forEach(b => b.classList.remove('selected'));
        
        // Adiciona a classe 'selected' ao avatar escolhido
        this.classList.add('selected');
    });
});

// Verificar se os campos estão preenchidos antes de abrir o modal
document.getElementById('botao-cadastrar').addEventListener('click', function () {
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var matricula = document.getElementById('cg').value;
    var senha = document.getElementById('senha').value;

    if (!nome || !email || !matricula || !senha) {
        alert('Por favor, preencha todos os campos obrigatórios antes de prosseguir.');
    } else {
        document.getElementById('avatarModal').style.display = 'block';
    }
});