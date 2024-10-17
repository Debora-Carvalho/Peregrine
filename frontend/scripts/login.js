//pagina u_login.html

document.addEventListener('DOMContentLoaded', function () {
    const inputEmail = document.getElementById('inputEmail');
    const inputPassword = document.getElementById('inputPassword');
    const submitButton = document.querySelector('button[type="submit"]');
    
    // mensagens de erro
    const emailErrorMessage = document.createElement('div');
    emailErrorMessage.className = 'text-danger mt-1';
    emailErrorMessage.style.display = 'none';
    inputEmail.parentNode.insertBefore(emailErrorMessage, inputEmail.nextSibling);

    const passwordErrorMessage = document.createElement('div');
    passwordErrorMessage.className = 'text-danger mt-1';
    passwordErrorMessage.style.display = 'none';
    inputPassword.parentNode.insertBefore(passwordErrorMessage, inputPassword.nextSibling);

    // validação do campo de e-mail
    inputEmail.addEventListener('input', function () {
        const emailValue = inputEmail.value.trim();
        if (emailValue === '') {
            emailErrorMessage.textContent = 'Preencha com seu e-mail para continuar';
            emailErrorMessage.style.display = 'block';
        } else if (!emailValue.includes('@')) {
            emailErrorMessage.textContent = 'Por favor, insira um e-mail válido';
            emailErrorMessage.style.display = 'block';
        } else {
            emailErrorMessage.style.display = 'none';
        }
    });

    // validação do campo de senha
    inputPassword.addEventListener('input', function () {
        const passwordValue = inputPassword.value.trim();
        if (passwordValue === '') {
            passwordErrorMessage.textContent = 'Preencha com sua senha para continuar';
            passwordErrorMessage.style.display = 'block';
        } else {
            passwordErrorMessage.style.display = 'none';
        }
    });

    // validação ao clicar no botão de envio
    submitButton.addEventListener('click', function (event) {
        let isValid = true;

        const emailValue = inputEmail.value.trim();
        const passwordValue = inputPassword.value.trim();

        // verifica se o campo de e-mail está vazio ou inválido (ao clicar no botao)
        if (emailValue === '') {
            emailErrorMessage.textContent = 'Preencha com seu e-mail para continuar';
            emailErrorMessage.style.display = 'block';
            isValid = false;
        } else if (!emailValue.includes('@')) {
            emailErrorMessage.textContent = 'Por favor, insira um e-mail válido';
            emailErrorMessage.style.display = 'block';
            isValid = false;
        } else {
            emailErrorMessage.style.display = 'none';
        }

        // verifica se o campo de senha está vazio (ao clicar no botao)
        if (passwordValue === '') {
            passwordErrorMessage.textContent = 'Preencha com sua senha para continuar';
            passwordErrorMessage.style.display = 'block';
            isValid = false;
        } else {
            passwordErrorMessage.style.display = 'none';
        }

        // impede o envio do formulário se houver erros
        if (!isValid) {
            event.preventDefault();
        }
    });
});
