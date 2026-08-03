import { initializeData, loadData, updateData } from "../../data/data.js";

initializeData();

var usuarios;
(async (entidade) => usuarios = await loadData(entidade))('usuarios');


/-- Parte para relizar a transição ao clicar nos botões de inscrever-se e entrar --/
var btnSignin = document.querySelector("#signin");
var btnSignup = document.querySelector("#signup");

var body = document.querySelector("body");
/-- Cria classes "fictícias" para realizar os movimemntos de rolagem|transição entre os layouts de login e cadastro --/
btnSignin.addEventListener("click", function () {
    body.className = "sign-in-js";
});

btnSignup.addEventListener("click", function () {
    body.className = "sign-up-js";
});

/-- funcionalidade de logar e validar usuário --/

/* Carrega os dados de usuários criados no JSON */

document.querySelector('#button').addEventListener('click', fazerLogin);

document.querySelector('#signupButton').addEventListener('click', cadastrar);

function fazerLogin() {
    // leitura dos inputs
    let email = document.querySelector('#emailLogin').value;
    let senha = document.querySelector('#senhaLogin').value;

    //   console.log(email);
    /* validação do usuário */
    validarUsuario(email, senha);

};

/* Validação de usuário */
function validarUsuario(email, senha) {
    let logado = false;

    /* iteração por todos os usuários */
    usuarios.forEach(usuario => {
        /* verifica email e senha na base de dados */
        if (email == usuario.email && senha == usuario.senha) {
            localStorage.setItem('user-name', usuario.nome);
            logado = true;
            // console.log("---");
            window.location.href = "../../templates/pagina-inicial/pagina-inicial.html"
        }

    });

    if (!logado) {
        alert('Erro usuário ou senha inválido.');
    }

    localStorage.setItem('isLogged', logado);
}


/-- Cadastro de usuário --/

function cadastrar() {
    const nome = document.querySelector('#nameSignup').value;
    const email = document.querySelector('#emailSignup').value;
    const senha = document.querySelector('#passwordSignup').value;

    //verificação se o nome atende o parâmetro de no mínimo x caractere
    if (nome == "" || nome.length < 3) {
        alert("Preencha o nome adequadamente!");
        nome.focus();
        return;
    }

    if (email == "") {
        alert("Preencha o e-mail corretamente!");
        email.focus();
        return;
    }

    if (senha == "" || senha.length < 4) {
        alert("A senha deve conter ao mínimo 4 caractere");
        senha.focus();
        return;
    }

    // Carregar dados existentes do LocalStorage
    let usuarios = loadData('usuarios');


    // Verificar se o e-mail já está cadastrado
    const usuarioExistente = usuarios.find(user => user.email === email);
    if (usuarioExistente) {
        alert("Este e-mail já está cadastrado!");
        document.querySelector('#emailSignup').focus();
        return;
    }

    // Criar um novo objeto de usuário
    let usuario = {
        'nome': nome,
        'email': email,
        'senha': senha
    }

    // Adicionar o novo usuário ao array de usuários
    usuarios.push(usuario);

    updateData('usuarios', usuarios);

    // Limpar os campos do formulário após o cadastro
    document.querySelector('#nameSignup').value = '';
    document.querySelector('#emailSignup').value = '';
    document.querySelector('#passwordSignup').value = '';
  
    // Mensagem de sucesso
    alert('Cadastro com sucesso!');

    // Redirecionamento para o login
    body.className = "sign-in-js";
}
