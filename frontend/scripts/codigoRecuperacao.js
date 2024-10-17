// pagina u_codigoRecuperacao.html

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const verificationInput = document.getElementById("verificationInput");

    // verifica o campo enquanto o usuário digita
    verificationInput.addEventListener("input", function () {
        const codeValue = verificationInput.value.trim();

        // limpa mensagens de erro anteriores
        clearErrorMessages();

        // exibe mensagem se o código contiver caracteres inválidos
        if (!/^\d*$/.test(codeValue)) {
            showError(verificationInput, "O código é formado por 6 números. Não utilize letras.");
        } else if (codeValue.length > 6) {
            showError(verificationInput, "O código deve ter exatamente 6 números.");
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // previne o envio do formulário até que as validações sejam feitas

        const codeValue = verificationInput.value.trim();
        let valid = true;

        // limpa mensagens de erro anteriores
        clearErrorMessages();

        // verifica se o código tem exatamente 6 números
        if (!/^\d{6}$/.test(codeValue)) {
            showError(verificationInput, "O código é formado por 6 números.");
            valid = false;
        }

        // verifica se o campo está preenchido
        if (codeValue === "") {
            showError(verificationInput, "Você precisa informar o código para prosseguir.");
            valid = false;
        }

        // se tudo estiver válido, submete o formulário
        if (valid) {
            form.submit();
        }
    });

    // função para exibir mensagens de erro
    function showError(input, message) {
        const errorElement = document.createElement("div");
        errorElement.className = "text-danger mt-1";
        errorElement.innerText = message;
        input.parentElement.appendChild(errorElement);
    }

    // função para limpar mensagens de erro
    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll(".text-danger");
        errorMessages.forEach(function (message) {
            message.remove();
        });
    }
});
