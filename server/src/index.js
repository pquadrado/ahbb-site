require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.CORS
}));

const smtp = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.PORT,
  secure: process.env.SECURE,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

app.post('/enviar-email', async (req, res) => {
  const { name, email, cidade, telefone, mensagem } = req.body;

  const configEmail = {
    from: process.env.USER,
    to: process.env.USER,
    subject: "Você tem uma nova mensagem do site da AHBB!",
    html: `
      <strong><h2>Nova mensagem enviada pelo formulário do AHBB</h2></strong><br><br>
      <h4>Informações do usuário:</h4><br>
      <strong>Nome: </strong><p>${name}</p><br>
      <strong>E-mail: </strong><p>${email}</p><br>
      <strong>Cidade: </strong><p>${cidade}</p><br>
      <strong>Telefone: </strong><p>${telefone}</p><br>
      <strong>Mensagem: </strong><p>${mensagem}</p>
    `,
  };

  try {
    await smtp.sendMail(configEmail);
    res.status(200).send('Email enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).send('Erro ao enviar email.');
  }
});

app.listen(8080, () => {
  console.log("Projeto rodando");
});