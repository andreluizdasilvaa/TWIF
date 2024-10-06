// Obtém o modal
var modal = document.getElementById("avatarModal");

// Obtém o botão que abre o modal
var btn = document.getElementById("botao-cadastrar");

// Obtém o elemento <span> que fecha o modal
var span = document.getElementsByClassName("close")[0];

// Quando o usuário clica no botão, abre o modal 
btn.onclick = function() {
    modal.style.display = "block";
}

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
        var avatarSrc = this.getAttribute('data-avatar');
        document.getElementById('avatar-escolhido').value = avatarSrc;
        
        // Destaca o avatar selecionado (opcional)
        avatarButtons.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Redireciona para login quando o avatar é salvo (redirecionamento opcional)
document.getElementById("salvar-avatar").onclick = function() {
    document.getElementById("form-avatar").submit();
}

// Obtém todos os botões de avatar
var avatarButtons = document.querySelectorAll('.avatar-button');

// Trata a seleção de avatar
avatarButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        var avatarSrc = this.getAttribute('data-avatar');
        document.getElementById('avatar-escolhido').value = avatarSrc;
        
        // Remove a classe 'selected' de todos os botões
        avatarButtons.forEach(b => b.classList.remove('selected'));
        
        // Adiciona a classe 'selected' ao avatar escolhido
        this.classList.add('selected');
    });
});
