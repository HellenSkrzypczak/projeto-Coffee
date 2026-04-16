
function alternarTelas() {
    const containerLogin = document.getElementsByClassName('login-container')[0];
    const containerRegister = document.getElementsByClassName('register-container')[0];

    containerLogin.classList.remove('animar-entrada');
    containerRegister.classList.remove('animar-entrada');

    if (containerLogin.classList.contains('hidden')) {
        containerLogin.classList.remove('hidden');
        containerRegister.classList.add('hidden');
        containerLogin.classList.add('animar-entrada');

    } else {
        containerLogin.classList.add('hidden');
        containerRegister.classList.remove('hidden');
        containerRegister.classList.add('animar-entrada');
    }
}

