// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import "./Global.css"; // Importando o CSS global
import { FaArrowLeft } from "react-icons/fa"; // Ícone de seta para a esquerda

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Adicionar a lógica para deslogar o usuário (limpar o estado ou token)
    console.log("Usuário deslogado");
    navigate("/"); // Redireciona para a tela de login
  };

  return (
    <div className="dashboard-container">
      {/* Ícone de voltar */}
      <div className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft size={24} /> Voltar
      </div>

      <h1>Bem-vindo ao Dashboard</h1>

      {/* Botões de navegação */}
      <div className="dashboard-buttons">
        <button onClick={() => navigate("/propostas")}>Ver Propostas</button>
        <button onClick={() => navigate("/submissao")}>Submeter Proposta</button>
        <button onClick={handleLogout}>Deslogar</button>
      </div>
    </div>
  );
}

export default Dashboard;
