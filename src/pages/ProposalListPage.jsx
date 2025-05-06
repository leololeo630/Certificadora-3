// src/pages/ProposalListPage.jsx
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Ícone de seta para a esquerda
import "./Global.css"; // Importando o CSS global

function ProposalListPage() {
  const navigate = useNavigate();

  return (
    <div className="proposal-list-container">
      <div className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft size={24} /> Voltar
      </div>
      <h1>Lista de Propostas</h1>
      {/* Aqui você pode listar as propostas com uma tabela ou lista */}
      <p>Aqui estão as propostas enviadas.</p>
    </div>
  );
}

export default ProposalListPage;
