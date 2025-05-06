// src/pages/CadastroPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./Global.css"; 

function CadastroPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Enviar para o backend futuramente
    console.log("Cadastro com:", email, senha);
  };

  return (
    <div className="cadastro-container">
      <div className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft size={24} /> Voltar
      </div>
      <h1>Cadastro</h1>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroPage;
