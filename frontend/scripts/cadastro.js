//pagina u_cadastro.html

document.addEventListener('DOMContentLoaded', function () {
    const inputName = document.getElementById('inputName');
    const inputEmail = document.getElementById('inputEmail');
    const inputPassword = document.getElementById('inputPassword');
    const inputConfirmPassword = document.getElementById('inputConfirmPassword');
    const inputPhone = document.getElementById('inputPhone');
    const submitButton = document.querySelector('button[type="submit"]');

    // mensagens de erro
    const nameErrorMessage = document.createElement('div');
    nameErrorMessage.className = 'text-danger mt-1';
    nameErrorMessage.style.display = 'none';
    inputName.parentNode.insertBefore(nameErrorMessage, inputName.nextSibling);

    const emailErrorMessage = document.createElement('div');
    emailErrorMessage.className = 'text-danger mt-1';
    emailErrorMessage.style.display = 'none';
    inputEmail.parentNode.insertBefore(emailErrorMessage, inputEmail.nextSibling);

    const passwordErrorMessage = document.createElement('div');
    passwordErrorMessage.className = 'text-danger mt-1';
    passwordErrorMessage.style.display = 'none';
    inputPassword.parentNode.insertBefore(passwordErrorMessage, inputPassword.nextSibling);

    const confirmPasswordErrorMessage = document.createElement('div');
    confirmPasswordErrorMessage.className = 'text-danger mt-1';
    confirmPasswordErrorMessage.style.display = 'none';
    inputConfirmPassword.parentNode.insertBefore(confirmPasswordErrorMessage, inputConfirmPassword.nextSibling);

    const phoneErrorMessage = document.createElement('div');
    phoneErrorMessage.className = 'text-danger mt-1';
    phoneErrorMessage.style.display = 'none';
    inputPhone.parentNode.insertBefore(phoneErrorMessage, inputPhone.nextSibling);

    // validação do nome
    inputName.addEventListener('input', function () {
        const nameValue = inputName.value.trim();
        if (nameValue === '') {
            nameErrorMessage.textContent = 'Preencha com seu nome para continuar';
            nameErrorMessage.style.display = 'block';
        } else if (/[^a-zA-ZÀ-ÿ\s]/.test(nameValue)) {
            nameErrorMessage.textContent = 'Preencha com um nome válido (somente letras)';
            nameErrorMessage.style.display = 'block';
        } else {
            nameErrorMessage.style.display = 'none';
        }
    });

    // validação do e-mail
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

    // validação da senha (mínimo de 8 dígitos, uma letra, um caractere especial)
    inputPassword.addEventListener('input', function () {
        const passwordValue = inputPassword.value.trim();
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/; // Pelo menos 8 dígitos, uma letra e um caractere especial

        if (passwordValue === '') {
            passwordErrorMessage.textContent = 'Preencha com uma senha para continuar';
            passwordErrorMessage.style.display = 'block';
        } else if (!passwordPattern.test(passwordValue)) {
            passwordErrorMessage.textContent = 'A senha deve conter pelo menos 8 dígitos, uma letra e um caractere especial';
            passwordErrorMessage.style.display = 'block';
        } else {
            passwordErrorMessage.style.display = 'none';
        }
    });

    // validação de confirmação de senha
    inputConfirmPassword.addEventListener('input', function () {
        const confirmPasswordValue = inputConfirmPassword.value.trim();
        const passwordValue = inputPassword.value.trim();

        if (confirmPasswordValue === '') {
            confirmPasswordErrorMessage.textContent = 'Confirme sua senha';
            confirmPasswordErrorMessage.style.display = 'block';
        } else if (confirmPasswordValue !== passwordValue) {
            confirmPasswordErrorMessage.textContent = 'As senhas não conferem';
            confirmPasswordErrorMessage.style.display = 'block';
        } else {
            confirmPasswordErrorMessage.style.display = 'none';
        }
    });

    // validação do telefone
    inputPhone.addEventListener('input', function () {
        const phoneValue = inputPhone.value.trim();
        const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;

        if (phoneValue === '') {
            phoneErrorMessage.textContent = 'Preencha com seu telefone para continuar';
            phoneErrorMessage.style.display = 'block';
        } else if (!phonePattern.test(phoneValue)) {
            phoneErrorMessage.textContent = 'Por favor, preencha no formato (00) 00000-0000';
            phoneErrorMessage.style.display = 'block';
        } else {
            phoneErrorMessage.style.display = 'none';
        }
    });

    // validação antes de enviar o formulário
    submitButton.addEventListener('click', function (event) {
        let isValid = true;

        const nameValue = inputName.value.trim();
        const emailValue = inputEmail.value.trim();
        const passwordValue = inputPassword.value.trim();
        const confirmPasswordValue = inputConfirmPassword.value.trim();
        const phoneValue = inputPhone.value.trim();
        const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/;

        // validação de nome
        if (nameValue === '') {
            nameErrorMessage.textContent = 'Preencha com seu nome para continuar';
            nameErrorMessage.style.display = 'block';
            isValid = false;
        } else if (/[^a-zA-ZÀ-ÿ\s]/.test(nameValue)) {
            nameErrorMessage.textContent = 'Preencha com um nome válido (somente letras)';
            nameErrorMessage.style.display = 'block';
            isValid = false;
        }

        // validação de e-mail
        if (emailValue === '') {
            emailErrorMessage.textContent = 'Prencha com seu e-mail para continuar';
            emailErrorMessage.style.display = 'block';
            isValid = false;
        } else if (!emailValue.includes('@')) {
            emailErrorMessage.textContent = 'Por favor, insira um e-mail válido';
            emailErrorMessage.style.display = 'block';
            isValid = false;
        }

        // validação de senha
        if (passwordValue === '' ) {
            passwordErrorMessage.textContent = 'Crie sua senha para continuar';
            passwordErrorMessage.style.display = 'block';
            isValid = false;
        } else if (!passwordPattern.test(passwordValue)) {
            passwordErrorMessage.textContent = 'A senha deve conter pelo menos 8 dígitos, uma letra e um caractere especial';
            passwordErrorMessage.style.display = 'block';
            isValid = false;
        }

        // validação de confirmação de senha
        if (confirmPasswordValue === '') {
            confirmPasswordErrorMessage.textContent = 'Repita a senha criada para continuar';
            confirmPasswordErrorMessage.style.display = 'block';
            isValid = false;
        } else if (confirmPasswordValue !== passwordValue) {
            confirmPasswordErrorMessage.textContent = 'As senhas não conferem';
            confirmPasswordErrorMessage.style.display = 'block';
            isValid = false; 
        }

        // validação de telefone
        if (phoneValue === '' || !phonePattern.test(phoneValue)) {
            phoneErrorMessage.textContent = 'Por favor, preencha no formato (00) 00000-0000';
            phoneErrorMessage.style.display = 'block';
            isValid = false;
        }

        // impede o envio do formulário se houver erros
        if (!isValid) {
            event.preventDefault();
        }
    });
});
