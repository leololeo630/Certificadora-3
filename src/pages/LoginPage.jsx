// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Global.css"; // Importando o CSS global

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // colocar a lógica de autenticação real
    // Enviar para o backend futuramente
    console.log("Login com:", email, senha);

    // Após o login bem-sucedido, redireciona para o Dashboard
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <h1>Banco de Ideias</h1>
      <h1>Meninas Digitais - UTFPR</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
        <p>
          Ainda não tem conta?{" "}
          <span onClick={() => navigate("/cadastro")}>Cadastre-se</span>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
