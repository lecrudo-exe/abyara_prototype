// server.js

const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.skymail.net.br',
  port: 465,
  secure: true,
  auth: {
    user: 'abyara@abyaraquantum.com.br',
    pass: 'Qntm#2025!'
  }
});

// rota Corretores
app.post('/api/corretor', (req, res) => {
  const { nome, creci, email, imobiliaria } = req.body;
  const mailOptions = {
    from: '"Abyara Quantum" <abyara@abyaraquantum.com.br>',
    to:   'gente@abyara.com.br',
    subject: 'Novo cadastro de Corretor',
    html: `
      <h2>Novo Cadastro de Corretor</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>CRECI:</strong> ${creci}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Imobiliária:</strong> ${imobiliaria}</p>
    `
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return res.status(500).json({ sucesso: false, erro: err.toString() });
    res.json({ sucesso: true });
  });
});

// rota Incorporadores
app.post('/api/incorporador', (req, res) => {
  const { empresa, contato, email, telefone, mensagem } = req.body;
  const mailOptions = {
    from: '"Abyara Quantum" <abyara@abyaraquantum.com.br>',
    to:   'novosnegocios@abyara.com.br',
    subject: 'Novo cadastro de Incorporador',
    html: `
      <h2>Novo Cadastro de Incorporador</h2>
      <p><strong>Empresa:</strong> ${empresa}</p>
      <p><strong>Contato:</strong> ${contato}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Telefone:</strong> ${telefone}</p>
      <p><strong>Mensagem:</strong><br/>${mensagem}</p>
    `
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return res.status(500).json({ sucesso: false, erro: err.toString() });
    res.json({ sucesso: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
