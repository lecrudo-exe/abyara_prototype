// server.js

const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// configura o transporte SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.skymail.net.br',
  port: 465,
  secure: true, // usa SSL
  auth: {
    user: 'abyara@abyaraquantum.com.br',
    pass: 'Qntm#2025!'
  }
});

// rota para cadastro de corretores
app.post('/api/corretor', async (req, res) => {
  const { nome, creci, email, imobiliaria } = req.body;

  const mailOptions = {
    from: '"Abyara Quantum" <abyara@abyaraquantum.com.br>',
    to: 'gente@abyara.com.br',
    subject: 'Novo cadastro de Corretor',
    html: `
      <h2>Novo Cadastro de Corretor</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>CRECI:</strong> ${creci}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Imobiliária:</strong> ${imobiliaria}</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar e-mail:', error);
      return res.status(500).json({ sucesso: false, erro: error.toString() });
    }
    res.json({ sucesso: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
