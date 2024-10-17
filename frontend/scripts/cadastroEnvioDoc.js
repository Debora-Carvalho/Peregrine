//pagina: u_cadastroEnvioDoc

const fileInput1 = document.getElementById('formFile1');
const fileInput2 = document.getElementById('formFile2');
const uploadIcon1 = document.getElementById('uploadIcon1');
const uploadIcon2 = document.getElementById('uploadIcon2');
const proceedArrow = document.getElementById('proceedArrow');

const defaultIconSrc = '../public/images/icon-arquivoUpload.png';
const doneIconSrc = '../public/images/icon-arquivoUploadFeito.png';

// mensagens de erro para os inputs de arquivo
const errorFile1 = document.createElement('div');
errorFile1.className = 'text-danger mt-1';
errorFile1.style.display = 'none';
fileInput1.parentNode.insertBefore(errorFile1, fileInput1.nextSibling);

const errorFile2 = document.createElement('div');
errorFile2.className = 'text-danger mt-1';
errorFile2.style.display = 'none';
fileInput2.parentNode.insertBefore(errorFile2, fileInput2.nextSibling);

// verificar os inputs e alterar as imagens
function checkUploads() {
    if (fileInput1.files.length > 0) {
        uploadIcon1.src = doneIconSrc;
        errorFile1.style.display = 'none'; // remove a mensagem de erro ao preencher
    } else {
        uploadIcon1.src = defaultIconSrc;
    }

    if (fileInput2.files.length > 0) {
        uploadIcon2.src = doneIconSrc;
        errorFile2.style.display = 'none'; // Remove a mensagem de erro ao preencher
    } else {
        uploadIcon2.src = defaultIconSrc;
    }
}

// verificar se todos os arquivos estão anexados antes de prosseguir
function validateAndProceed(event) {
    let isValid = true;

    if (fileInput1.files.length === 0) {
        errorFile1.textContent = 'Por favor, anexe a primeira foto.';
        errorFile1.style.display = 'block';
        isValid = false;
    } 

    if (fileInput2.files.length === 0) {
        errorFile2.textContent = 'Por favor, anexe a segunda foto.';
        errorFile2.style.display = 'block';
        isValid = false;
    } 

    if (!isValid) {
        event.preventDefault();
    } else {
        // se os inputs estiverem preenchidos, redirecionar para a próxima página
        window.location.href = "#"; 
    }
}

// adicionando listeners para cada input
fileInput1.addEventListener('change', checkUploads);
fileInput2.addEventListener('change', checkUploads);
proceedArrow.addEventListener('click', validateAndProceed);
