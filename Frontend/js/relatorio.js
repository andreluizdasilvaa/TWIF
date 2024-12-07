addEventListener('DOMContentLoaded', async () => {
    document.getElementById('quant_posts').innerText = await getTotalPosts()
    document.getElementById('quant_usuarios').innerText = await getTotalUsuarios()
    document.getElementById('media_curtidas').innerText = await mediaCurtidasPorPost()
    document.getElementById('media_comentarios').innerText = await mediaCurtidasPorPost()
})

//Pegando total de comentarios
async function getTotalComentarios() {
    let result = await fetch('/relatorios/comentarios')
    .then(response => response.json())
    .then(data => {
        return data.quantidade
    })
    .then(r => {
        return r
    })
    .catch(r => {
        return 0
    })
    return result
}

//Pegando total de curtidas
async function getTotalCurtidas() {
    let result = await fetch('/relatorios/curtidas')
    .then(response => response.json())
    .then(data => {
        document.getElementById('').innerText = data.quantidade
        return data.quantidade
    })
    .then(r => {
        return r
    })
    .catch(r => {
        return 0
    })
    return result
}

//Pegando total de usuarios
async function getTotalUsuarios() {
    let result = await fetch('/relatorios/usuarios')
    .then(response => response.json())
    .then(data => {
        document.getElementById('quant_usuarios').innerText = data.quantidade
        return data.quantidade
    })
    .then(r => {
        return r
    })
    .catch(r => {
        return 0
    })
    return result
}  

//Pegando total de posts
async function getTotalPosts() {
    let result = await fetch('/relatorios/posts')
    .then(response => response.json())
    .then(data => {
        return data.quantidade
    })
    .then(r => {
        return r
    })
    .catch(r => {
        return 0
    })
    return result
}

//Media de comentarios por Post
const mediaComentarioPorPost = async () => {
    let resultPost = await getTotalPosts()
    let resultComentarios =  await getTotalComentarios()
    let resultado =  Math.floor(!Number.isNaN(resultComentarios / resultPost) ? (resultComentarios / resultPost) : 0)
    return resultado
}

//Media de comentarios por Post
const mediaCurtidasPorPost = async () => {
    let resultPost = await getTotalPosts()
    let resultCurtidas =  await getTotalCurtidas()
    let resultado =  Math.floor(!Number.isNaN(resultCurtidas / resultPost) ? (resultCurtidas / resultPost) : 0)
    return resultado
}