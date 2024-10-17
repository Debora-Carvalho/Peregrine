// pagina u_criarNovaSenha.html

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const newPasswordInput = document.getElementById("newPasswordInput");
    const confirmPasswordInput = document.getElementById("confirmPasswordInput");

    // verifica a senha enquanto o usuário digita no campo nova senha
    newPasswordInput.addEventListener("input", function () {
        const newPassword = newPasswordInput.value.trim();

        // limpa mensagens de erro anteriores
        clearErrorMessages();

        // validação da senha: mínimo de 8 caracteres, uma letra e um caractere especial
        if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
            showError(newPasswordInput, "A senha deve conter pelo menos 8 dígitos, uma letra e um caractere especial.");
        }
    });

    // verifica se as senhas coincidem enquanto o usuário digita no campo de confirmação
    confirmPasswordInput.addEventListener("input", function () {
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // limpa mensagens de erro anteriores
        clearErrorMessages();

        // exibe mensagem se as senhas não coincidirem
        if (newPassword !== confirmPassword) {
            showError(newPasswordInput, "As senhas não conferem.");
            showError(confirmPasswordInput, "As senhas não conferem.");
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // previne o envio do formulário até que as validações sejam feitas

        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        let valid = true;

        // limpa mensagens de erro anteriores
        clearErrorMessages();

        // verifica se os campos estão preenchidos
        if (newPassword === "") {
            showError(newPasswordInput, "Preencha todos os campos para criar sua nova senha.");
            valid = false;
        }

        if (confirmPassword === "") {
            showError(confirmPasswordInput, "Preencha todos os campos para criar sua nova senha.");
            valid = false;
        }

        // validação da senha: mínimo de 8 caracteres, uma letra e um caractere especial
        if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
            showError(newPasswordInput, "A senha deve conter pelo menos 8 dígitos, uma letra e um caractere especial.");
            valid = false;
        }

        // verifica se as senhas coincidem
        if (newPassword !== confirmPassword) {
            showError(newPasswordInput, "As senhas não conferem.");
            showError(confirmPasswordInput, "As senhas não conferem.");
            valid = false;
        }

        // se tudo estiver válido, submete o formulário
        if (valid) {
            form.submit();
        }
    });

    // função para exibir mensagens de erro
    function showError(input, message) {
        if (!input.parentElement.querySelector(".text-danger")) {
            const errorElement = document.createElement("div");
            errorElement.className = "text-danger mt-1";
            errorElement.innerText = message;
            input.parentElement.appendChild(errorElement);
        }
    }

    // função para limpar mensagens de erro
    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll(".text-danger");
        errorMessages.forEach(function (message) {
            message.remove();
        });
    }
});
