// src/pages/SubmitProposalPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Global.css'; // Importando o CSS global
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

function SubmitProposalPage() {
    const [proposta, setProposta] = useState({
        id_usuario: null,
        titulo: '',
        descricao: '',
        });
    const { user, logout} = useAuth()
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        proposta.id_usuario = user.id

        const proposalData = await apiService.submitProposal(proposta)
        console.log('proposta enviada:  ', proposalData)
    };

    return (
        <div className="submit-proposal-container">
            <div className="back-button" onClick={() => navigate(-1)}>
                <FaArrowLeft size={24} /> Voltar
            </div>
            <h1>Submeter Proposta</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Titulo Da Proposta"
                    value={proposta.titulo}
                    onChange={(e) => setProposta({ ...proposta, titulo: e.target.value })}
                    required
                    rows="1"
                />
                <textarea
                    placeholder="Descreva sua proposta"
                    value={proposta.descricao}
                    onChange={(e) => setProposta({ ...proposta, descricao: e.target.value })}
                    required
                    rows="6"
                />
                <button type="submit">Submeter Proposta</button>
            </form>
        </div>
    );
}

export default SubmitProposalPage;
