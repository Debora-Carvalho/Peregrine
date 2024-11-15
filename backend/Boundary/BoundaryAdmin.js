const { Op } = require('sequelize');  // Importa o operador `Op` do Sequelize
const Usuario = require('../models/Usuario_01'); // Ajuste o caminho conforme necessário

module.exports = {
    renderIndexAdmin: (req, res) => {
        res.render('pages/admin/index', {
            title: 'Administrador - Página Inicial',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    //RELATORIOS
    renderRelatorio: (req, res) => {
        res.render('pages/admin/relatorios/index', {
            title: 'Relatório',
            user: req.session.user
        });
    },

    renderRelatorioConcluido: (req, res) => {
        res.render('pages/admin/relatorios/relatorio-concluido', {
            title: 'Relatório',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    //VIAJANTES
    renderViajantes: (req, res) => {
        res.render('pages/admin/viajantes/index', {
            title: 'Usuários - Viajantes',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    listarViajantes: async (req, res) => {
        try {
            // Consulta os registros de usuários, omitindo o campo de senha
            const usuarios = await Usuario.findAll({
                attributes: ['A01_ID', 'A01_EMAIL', 'A01_PERFIL']
            });
            // Renderiza a página com os dados dos viajantes e os registros dos usuários
            res.render('pages/admin/viajantes/gerenciar/index', {
                title: 'Usuários - Viajantes',
                logoPath: '/images/logo.ico',
                user: req.session.user,
                usuarios: usuarios // Passando os registros dos usuários para a view
            });
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).send('Erro ao buscar usuários');
        }
    },

    aprovarViajantes: (req, res) => {
        res.render('pages/admin/viajantes/aprovar/index', {
            title: 'Usuários - Viajantes',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    concluirAprovacao: (req, res) => {
        res.render('pages/admin/viajantes/aprovar/aprovar-concluido', {
            title: 'Usuários - Viajantes',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    //DENUNCIA
    renderDenuncias: (req, res) => {
        res.render('pages/admin/viajantes/denuncias/index', {
            title: 'Usuários - Viajantes',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    denunciaIndividual: (req, res) => {
        res.render('pages/admin/viajantes/denuncias/individual', {
            title: 'Administrador - Página Inicial',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    cancelarDenuncia: (req, res) => {
        res.render('pages/admin/viajantes/denuncias/cancelada', {
            title: 'Administrador - Página Inicial',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    banirDenuncia: (req, res) => {
        res.render('pages/admin/viajantes/denuncias/banida', {
            title: 'Administrador - Página Inicial',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    //ADMINISTRADORES
    renderAdminUsuarios: async (req, res) => {
        try {
        let usuarios;
        let buscaRealizada = false;
        const query = req.query.query ? req.query.query.trim() : '';  // Captura o termo de busca, ou define como string vazia

        if (query) {
            buscaRealizada = true;

            // Busca pelo ID ou Email usando a query
            usuarios = await Usuario.findAll({
                where: {
                    [Op.or]: [
                        { A01_ID: query },
                        { A01_EMAIL: { [Op.like]: `%${query}%` } }
                    ]
                }
            });
        } else {
            // Se o campo de busca estiver vazio, exibe todos os registros
            usuarios = await Usuario.findAll();
        }

        const usuariosData = usuarios.map(usuario => usuario.get({ plain: true }));
            // Renderiza a página com os dados dos viajantes e os registros dos usuários
            res.render('pages/admin/administradores/index', {
                title: 'Usuários Administradores',
                logoPath: '/images/logo.ico',
                user: req.session.user,
                usuarios: usuariosData, // Passando os registros dos usuários para a view
                buscaRealizada, query 
            });
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            res.status(500).send('Erro ao buscar usuários');
        }
    },

    criarAdmin: (req, res) => {
        res.render('pages/admin/administradores/criar', {
            title: 'Criar Administrador',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    },

    criarAdminConcluido: (req, res) => {
        res.render('pages/admin/administradores/criar-concluido', {
            title: 'Criar Administrador',
            logoPath: '/images/logo.ico',
            user: req.session.user
        });
    }
}