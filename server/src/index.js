const nodemailer = require("nodemailer")
const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(express.json());

app.use(cors({
  origin: process.env.CORS
}));

const smtp = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.PORT,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

app.post("/send-email", (req, res) => {
  const { name, email, cidade, telefone, mensagem } = req.body;

  const configEmail = {
    from: process.env.USER,
    to: process.env.USER,
    subject: "Nova mensagem enviada pelo site da AHBB",
    html: `
      <h2>Você tem uma nova mensagem enviada pelo site da AHBB.</h2><br> 
      <h4>Informações do Cliente:</h4><br> 
      <strong>Nome:</strong> <p>${name}</p><br> 
      <strong>E-mail:</strong> <p>${email}</p><br> 
      <strong>Cidade:</strong> <p>${cidade}</p><br> 
      <strong>Telefone:</strong> <p>${telefone}</p><br> 
      <strong>Mensagem:</strong> <p>${mensagem}</p><br>`
  };

  smtp.sendMail(configEmail, (error, info) => {
    if (error) {
      console.error("Erro ao enviar o e-mail:", error);
      return res.status(500).send({ message: "Erro ao enviar o e-mail", error });
    }
    res.status(200).send({ message: "E-mail enviado com sucesso!", info });
  });
});

app.listen(3002, () => {
  console.log("Projeto rodando na porta 3002");
});

