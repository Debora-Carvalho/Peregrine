const bcrypt = require('bcrypt');
const cadastro = require("../models/dados")
const saltRounds = 10; // Define o número de salt rounds para o hash da senha
require('dotenv').config(); // Para usar variáveis de ambiente do arquivo .env
const nodemailer = require('nodemailer');

module.exports = {
    renderIndex: (req, res) => {
        res.render('pages/indexPage', {
            title: 'Página Inicial'
        });
    },

    renderAdmin: (req, res) => {
        res.render('pages/adminInitialPage', {
            title: 'Administrador - Página Inicial',
        });
    },

    renderRecuperarSenha: (req, res) => {
        res.render("pages/recuperarSenhaPage", {
            title:'Recuperar Senha'
        });
    },

    renderLogin: (req, res) => {
        res.render("pages/loginPage", {
            title: 'Login'
        });
    },

    renderCadastro: (req, res) => {
        res.render("pages/cadastroPage", {
            title: 'Cadastro'
        });
    },

    renderCadastroSucesso: (req, res) => {
        res.render("pages/cadastroSucessoPage");
    },

    renderRedefinirSenha: (req, res) => {
        res.render("pages/redefinirSenhaPage");
    },

    cadastrarUsuario: (req, res) => {
        const { nome, email, celular, senha } = req.body;
        // Gera o hash da senha antes de salvar no banco de dados
        bcrypt.hash(senha, saltRounds)
            .then((hashedPassword) => {
                // Cria o usuário no banco de dados com a senha hash
                return cadastro.create({
                    nome,
                    email,
                    celular,
                    senha: hashedPassword // Salva a senha como hash
                });
            })
            .then(() => {
                console.log("Dados cadastrados com sucesso!");
                res.redirect('/cadastro-sucesso'); // Redireciona para a página de sucesso
            })
            .catch((error) => {
                console.log("Erro ao gravar os dados na entidade:", error);
                res.render('pages/cadastroPage', { error: 'Erro ao cadastrar. Tente novamente.' }); // Exibe a mensagem de erro na página
            });
    },

    login: async (req, res) => {
        const { email, senha } = req.body;
        try {
            const user = await cadastro.findOne({ where: { email } });
            if (user && await bcrypt.compare(senha, user.senha)) {
                // Login bem-sucedido
                res.redirect('/administrador');
            } else {
                // Credenciais inválidas
                res.render('pages/loginPage', { error: 'Email ou senha incorretos!' });
            }
        } catch (error) {
            console.error('Erro ao realizar o login:', error);
            res.render('pages/loginPage', { error: 'Erro ao realizar o login. Tente novamente.' });
        }
    },

    funRecuperarSenha: async (req, res) => {
        const { email } = req.body;
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, // Usuário de e-mail vindo do .env
                pass: process.env.EMAIL_PASS, // Senha de aplicativo do .env
            }
        });

        if (!email) {
            return res.render('pages/recuperarSenhaPage', { error: 'O campo de e-mail está vazio.' });
        }

        try {
            const user = await cadastro.findOne({ where: { email } });

            if (user) {
                // Envia o e-mail com o código de verificação
                await transport.sendMail({
                    from: 'Peregrine<narielanahi@gmail.com>',
                    to: email,
                    subject: 'Código para recuperação de senha',
                    html: '<h1>Seu código de verificação!</h1><p>Para recuperar sua senha, utilize o seguinte código na sua verificação: </p><h2>12345</h2>',
                    text: 'Olá, se não funcionar o HTML, envie esta mensagem.',
                });

                console.log('E-mail enviado com sucesso');
                
                // Renderiza a página com o campo de código e mantém o e-mail no formulário oculto
                res.render('pages/recuperarSenhaPage', { 
                    success: 'Código enviado no seu e-mail. Insira o código aqui:', 
                    showCodeField: true, 
                    email 
                });
            } else {
                res.render('pages/recuperarSenhaPage', { error: 'Email não encontrado!' });
            }

        } catch (error) {
            console.error('Erro ao recuperar senha:', error);
            res.render('pages/recuperarSenhaPage', { error: 'Erro ao tentar enviar o e-mail. Tente novamente.' });
        }
    },

    validaCodigo: (req, res) => {
        const { codigo, email } = req.body;
        const codigoEnviado = "12345"; // Código fixo para a validação
    
        if (codigo === codigoEnviado) {
            // Armazenar o e-mail na sessão
            req.session.emailRecuperacao = email;
            // Redirecionar para a página de redefinição de senha
            res.redirect('/redefinirSenhaPage');
        } else {
            res.render('pages/recuperarSenhaPage', {
                codigoError: 'Código inválido. Tente novamente.',
                showCodeField: true,
                email
            });
        }
    },

    atualizarSenha: async (req, res) => {
        const { novaSenha, confirmarSenha } = req.body;
        const email = req.session.emailRecuperacao; // Recuperar o e-mail armazenado na sessão
    
        if (!novaSenha || !confirmarSenha) {
            return res.render('pages/redefinirSenhaPage', { senhaError: 'Preencha todos os campos.' });
        }
        if (novaSenha !== confirmarSenha) {
            return res.render('pages/redefinirSenhaPage', { senhaError: 'As senhas não coincidem.' });
        }
        try {
            // Gerar o hash da nova senha
            const hashedPassword = await bcrypt.hash(novaSenha, saltRounds);
            // Atualizar a senha no banco de dados com o hash gerado
            await cadastro.update({ senha: hashedPassword }, { where: { email } });
            // Redefinição de senha bem-sucedida
            req.session.emailRecuperacao = null; // Limpar o e-mail da sessão
            res.render('pages/loginPage', { senhaSuccess: 'Senha redefinida com sucesso!' });
        } catch (error) {
            console.error('Erro ao atualizar a senha:', error);
            res.render('pages/redefinirSenhaPage', { senhaError: 'Erro ao atualizar a senha. Tente novamente.' });
        }
    }
}