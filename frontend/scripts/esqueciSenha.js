// pagina u_esqueciSenha.html

document.addEventListener('DOMContentLoaded', function () {
    const inputEmail = document.getElementById('inputEmail');
    const submitButton = document.querySelector('button[type="submit"]');

    // mensagem de erro
    const emailErrorMessage = document.createElement('div');
    emailErrorMessage.className = 'text-danger mt-1';
    emailErrorMessage.style.display = 'none'; 
    inputEmail.parentNode.insertBefore(emailErrorMessage, inputEmail.nextSibling);

    // validação do e-mail (deve conter @)
    inputEmail.addEventListener('input', function () {
        const emailValue = inputEmail.value.trim();

        // limpa mensagens de erro anteriores
        clearErrorMessages();

        if (!emailValue.includes('@')) {
            showError(inputEmail, 'Por favor, insira um e-mail válido.');
        } else {
            emailErrorMessage.style.display = 'none';
        }
    });

    // validação antes de enviar o formulário
    submitButton.addEventListener('click', function (event) {
        const emailValue = inputEmail.value.trim();

        // limpa mensagens de erro anteriores
        clearErrorMessages();

        // verifica se o campo de e-mail está vazio ou se o e-mail é inválido
        if (!emailValue) {
            showError(inputEmail, 'Você precisa preencher seu e-mail para continuar.');
            event.preventDefault(); // impede o envio do formulário
        } else if (!emailValue.includes('@')) {
            showError(inputEmail, 'Por favor, insira um e-mail válido.');
            event.preventDefault(); // impede o envio do formulário
        }
    });

    // função para exibir mensagens de erro
    function showError(input, message) {
        emailErrorMessage.textContent = message;
        emailErrorMessage.style.display = 'block';
    }

    // função para limpar mensagens de erro
    function clearErrorMessages() {
        emailErrorMessage.style.display = 'none';
    }
});
