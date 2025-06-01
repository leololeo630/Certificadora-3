// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Global.css"; // Importando o CSS global

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      // Fazer login através da API
      const userData = await apiService.login(
        email.trim().toLowerCase(), 
        senha
      );

      console.log("Login realizado:", userData);

      // Salvar dados do usuário no contexto
      login(userData);

      // Redirecionar para o dashboard
      navigate("/dashboard");

    } catch (error) {
      setErro(error.message || "Erro ao fazer login");
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Banco de Ideias</h1>
      <h1>Meninas Digitais - UTFPR</h1>
      
      {erro && <div className="error-message">{erro}</div>}
      
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          disabled={loading}
          autoComplete="current-password"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        
        <p>
          Ainda não tem conta?{" "}
          <span onClick={() => navigate("/cadastro")}>Cadastre-se</span>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;