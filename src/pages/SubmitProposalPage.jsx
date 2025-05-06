// src/pages/SubmitProposalPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./Global.css"; // Importando o CSS global

function SubmitProposalPage() {
  const [proposta, setProposta] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Enviar a proposta para o backend futuramente
    console.log("Proposta enviada:", proposta);
  };

  return (
    <div className="submit-proposal-container">
      <div className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft size={24} /> Voltar
      </div>
      <h1>Submeter Proposta</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Descreva sua proposta"
          value={proposta}
          onChange={(e) => setProposta(e.target.value)}
          required
          rows="6"
        />
        <button type="submit">Submeter Proposta</button>
      </form>
    </div>
  );
}

export default SubmitProposalPage;
