const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario_01'); // Verifique o caminho correto do arquivo de modelo
const Viajante = require('../models/Viajante_02');

const SALT_ROUNDS = 10; // Define o número de salt rounds para o hash da senha
require('dotenv').config(); // Para usar variáveis de ambiente do arquivo .env
const crypto = require('crypto'); // Para gerar o código de verificação
const nodemailer = require('nodemailer');

module.exports = {
    login: async (req, res) => {
        const { email, senha } = req.body;
        try {
            const user = await Usuario.findOne({ where: { A01_EMAIL: email } });

            if (!user) {
                return res.render('pages/loginPage', { error: 'Usuário não encontrado!' });
            }

            if (await bcrypt.compare(senha, user.A01_SENHA)) {

                // Verifica se o usuário é administrador
                if (user.A01_PERFIL === 1) { // Perfil 1 para administrador
                    req.session.user = {
                        nome: user.A01_NOME,
                        email: user.A01_EMAIL,
                        isAdmin: true
                    };
                    return res.redirect('/administrador/indexAdmin'); // Redireciona para a tela do administrador
                } else {
                    // Busca informações adicionais do viajante na tabela viajante_02
                    const viajante = await Viajante.findOne({ where: { A01_ID: user.A01_ID } });

                    if (!viajante) {
                        return res.render('pages/loginPage', { error: 'Viajante não encontrado!' });
                    }

                    // Verifica se a documentação foi enviada
                    if (!viajante.A02_DOCUMENTACAO) {
                        req.session.userId = user.A01_ID; // Armazena o ID do usuário na sessão
                        return res.render('pages/cadastroEnvioDocs'); // Redireciona para a tela de envio de documentos
                    }

                    // Verifica se a conta foi aprovada
                    if (!viajante.A02_APROVADA) {
                        return res.render('pages/cadastroEnvioConcluido', { error: 'Sua conta ainda não foi aprovada.' });
                    }

                    // Usuário comum
                    req.session.user = {
                        nome: viajante.A02_NOME,
                        email: user.A01_EMAIL,
                        isAdmin: false
                    };
                    return res.redirect('/');
                }
            } else {
                return res.render('pages/loginPage', { error: 'Email ou senha incorretos!' });
            }
        } catch (error) {
            console.error('Erro ao realizar o login:', error);
            return res.render('pages/loginPage', { error: 'Erro ao realizar o login. Tente novamente mais tarde.' });
        }
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log('Erro ao encerrar a sessão:', err);
                return res.redirect('/'); // Redireciona mesmo se houver erro ao encerrar a sessão
            }
            // Sessão encerrada com sucesso, redireciona para a página inicial
            res.redirect('/');
        });
    },

    validarEmail: async (req, res) => {
        const { email } = req.body;
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        if (!email) {
            return res.render('pages/senhaRecuperar', { error: 'O campo de e-mail está vazio.' });
        }

        try {
            const user = await Usuario.findOne({ where: { A01_EMAIL: email } });

            if (user) {
                const verificationCode = crypto.randomInt(100000, 999999);
                req.session.verificationCode = verificationCode;
                req.session.emailRecuperacao = email; // Armazenar o email na sessão

                await transport.sendMail({
                    from: 'Peregrine<peregrine.planoviagem@gmail.com>',
                    to: email,
                    subject: 'Recuperação de senha - Peregrine',
                    html: `
                        <h1 style="color: #99067E; text-align: center;">Recuperação de senha</h1>
                        <p style="text-align: justify;">Olá Peregrina,</p>
                        <p style="text-align: justify;">
                            Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Peregrine</strong>.
                            Se você fez essa solicitação, use o código abaixo para concluir o processo de recuperação:
                        </p>
                        <h2 style="color: #FF5733; text-align: center;">${verificationCode}</h2>
                        <p style="text-align: justify;">
                            Caso você não tenha solicitado a recuperação, por favor ignore este e-mail.
                        </p>
                        <p style="text-align: justify;">Estamos à disposição para ajudá-la em caso de dúvidas.</p>
                        <br>
                        <p style="text-align: justify;">Atenciosamente,</p>
                        <p style="text-align: justify;"><strong>Equipe Peregrine ✈️</strong></p>
                        <br><br><hr>
                        <h4 style="color: #777; text-align: center;">Este é um e-mail automático, por favor, não responda.</h4>
                        <h4 style="color: #777; text-align: center;">Você está recebendo esta mensagem porque solicitou a recuperação de senha no <strong>Peregrine</strong>.</h4>
                    `,
                    text: `Seu código de verificação é: ${verificationCode}`,
                });

                console.log('E-mail enviado com sucesso');
                res.render('pages/senhaCodigoRecuperacao', {
                    success: 'Código enviado no seu e-mail. Insira o código aqui:',
                    showCodeField: true,
                    email
                });
            } else {
                res.render('pages/senhaRecuperar', { error: 'Email não encontrado!' });
            }

        } catch (error) {
            console.error('Erro ao recuperar senha:', error);
            res.render('pages/senhaRecuperar', { error: 'Erro ao tentar enviar o e-mail. Tente novamente.' });
        }
    },

    validaCodigo: (req, res) => {
        const { codigo, email } = req.body;
        const codigoEnviado = req.session.verificationCode;

        if (codigo === String(codigoEnviado)) {
            req.session.verificationCode = null;
            res.redirect('/senhaCriarNova');
        } else {
            res.render('pages/senhaCodigoRecuperacao', {
                error: 'Código inválido. Tente novamente.',
                showCodeField: true,
                email: req.session.emailRecuperacao // Passa o email para a renderização da página
            });
        }
    },

    atualizarSenha: async (req, res) => {
        const { novaSenha, confirmarSenha } = req.body;
        const email = req.session.emailRecuperacao;

        if (!novaSenha || !confirmarSenha) {
            return res.render('pages/senhaCriarNova', { senhaError: 'Preencha todos os campos.' });
        }
        if (novaSenha !== confirmarSenha) {
            return res.render('pages/senhaCriarNova', { senhaError: 'As senhas não coincidem.' });
        }
        try {
            const hashedPassword = await bcrypt.hash(novaSenha, SALT_ROUNDS);
            await Usuario.update({ A01_SENHA: hashedPassword }, { where: { A01_EMAIL: email } });

            req.session.verificationCode = null;
            req.session.emailRecuperacao = null;

            res.render('pages/senhaAlteradaSucesso', { senhaSuccess: 'Senha redefinida com sucesso!' });
        } catch (error) {
            console.error('Erro ao atualizar a senha:', error);
            res.render('pages/senhaCriarNova', { senhaError: 'Erro ao atualizar a senha. Tente novamente.' });
        }
    }
}