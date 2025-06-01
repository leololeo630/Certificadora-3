// src/pages/CadastroPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./Global.css"; 

import { apiService } from "../services/api";

function CadastroPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setSucesso("");
    try {
      // Enviar apenas email e senha para o backend
      const resultado = await apiService.cadastrarUsuario(
        email.trim().toLowerCase(), 
        senha
      );
      
      setSucesso("Usuário cadastrado com sucesso!");
      console.log("Usuário criado:", resultado);
      
      // Limpar formulário
      setEmail("");
      setSenha("");
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/"); // redireciona para tela de login
      }, 2000);

    } catch (error) {
      setErro(error.message || "Erro ao cadastrar usuário");
      console.error("Erro no cadastro:", error);
    } finally {
      setLoading(false);
    }
    };

  return (
    <div className="cadastro-container">
      <div className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft size={24} /> Voltar
      </div>
      
      <h1>Cadastro</h1>
      
      {erro && <div className="error-message">{erro}</div>}
      {sucesso && <div className="success-message">{sucesso}</div>}
      
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        
        <input
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          minLength={6}
          disabled={loading}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

export default CadastroPage;