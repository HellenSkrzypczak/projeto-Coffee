import { buscarUsuarioPorEmail, salvarUsuario } from './db.js';
import { Usuario } from './models.js';

function alternarTelas() {
    const containerLogin = document.getElementById('container-login');
    const containerRegister = document.getElementById('container-cadastro');
    
    if (!containerLogin || !containerRegister) return;

    if (containerLogin.classList.contains('hidden')) {
        containerLogin.classList.remove('hidden');
        containerRegister.classList.add('hidden');
    } else {
        containerLogin.classList.add('hidden');
        containerRegister.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btnIrParaCadastro = document.getElementById('link-cadastro');
    const btnIrParaLogin = document.getElementById('link-login');

    if (btnIrParaCadastro) {
        btnIrParaCadastro.addEventListener('click', (evento) => {
            evento.preventDefault();
            alternarTelas();
        });
    }

    if (btnIrParaLogin) {
        btnIrParaLogin.addEventListener('click', (evento) => {
            evento.preventDefault();
            alternarTelas();
        });
    }
});


document.getElementById('btn-login')?.addEventListener('click', async () => {
    const email = document.getElementById('email-login').value;
    const senha = document.getElementById('senha-login').value;
    const msgErro = document.getElementById('msg-erro');

    if (!email || !senha) {
        msgErro.innerText = "Preencha todos os campos!";
        return;
    }

    const usuarioDb = await buscarUsuarioPorEmail(email);

    if (!usuarioDb || usuarioDb.senha !== senha) {
        msgErro.innerText = "E-mail ou senha incorretos!";
        return;
    }

    sessionStorage.setItem('usuarioLogado', JSON.stringify({ nome: usuarioDb.nome, role: usuarioDb.role }));
    
    if (usuarioDb.role === 'admin') {
        window.location.href = 'admin-produtos.html';
    } else {
        window.location.href = 'index.html';
    }
});

document.getElementById('btn-cadastrar')?.addEventListener('click', async () => {
    const nome = document.getElementById('nome-cad').value;
    const email = document.getElementById('email-cad').value;
    const senha = document.getElementById('senha-cad').value;
    const msgErro = document.getElementById('msg-erro-cad');

    if (!nome || !email || !senha) {
        msgErro.innerText = "Preencha todos os campos!";
        return;
    }

    const usuarioExiste = await buscarUsuarioPorEmail(email);
    if (usuarioExiste) {
        msgErro.innerText = "Este e-mail já está cadastrado!";
        return;
    }

    const novoUser = new Usuario(email, nome, senha, 'client');
    const sucesso = await salvarUsuario(novoUser);

    if (sucesso) {
        alert("Cadastro realizado com sucesso! Faça login.");
        alternarTelas();
    } else {
        msgErro.innerText = "Erro ao cadastrar. Tente novamente.";
    }
});