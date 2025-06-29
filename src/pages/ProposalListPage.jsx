// src/pages/ProposalListPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { apiService } from "../services/api";

function ProposalListPage() {
  const navigate = useNavigate();
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [search, setSearch] = useState({
    filter: ''
  });
  useEffect(() => {
    const carregarPropostas = async () => {
      try {
        setLoading(true);
        const data = await apiService.buscarPropostas();
        setPropostas(data);
      } catch (error) {
        setErro(error.message || "Erro ao carregar propostas");
        console.error("Erro ao buscar propostas:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPropostas();
  }, []);

  const handleSearch = async () => {
    console.log(search.filter)
    const data = await apiService.filtrarPropostas(search.filter);
    setPropostas(data)
  };

  return (
    <div className="proposal-list-container">
      <div className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft size={24} /> Voltar
      </div>
      
      <div className="search-bar">
        <textarea
          placeholder="Pesquise por Propostas..."
          value={search.filter}
          onChange={(e) => setSearch({filter: e.target.value })}
          required
          rows="1"
          />
          <button type="submit" onClick={handleSearch}>Pesquisar</button>
      </div>
      <h1>Lista de Propostas</h1>
      
      {erro && <div className="error-message">{erro}</div>}
      
      {loading ? (
        <div className="loading">Carregando propostas...</div>
      ) : (
        <div className="proposals-list">
          {propostas.length === 0 ? (
            <p>Nenhuma proposta encontrada.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {propostas.map((proposta, index) => (
                <div 
                  key={proposta.id || index} 
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: '#333' }}>{proposta.titulo || "Sem título"}</h3>
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#666', 
                      backgroundColor: '#e0e0e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px' 
                    }}>
                      #{proposta.id}
                    </span>
                  </div>
                  
                  <p style={{ margin: 0, lineHeight: '1.5', color: '#555' }}>
                    {proposta.descricao || "Sem descrição"}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        <strong>Autor:</strong> {proposta.autor || "Anônimo"}
                      </span>
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        <strong>Data:</strong> {
                          proposta.data_envio 
                            ? new Date(proposta.data_envio).toLocaleDateString('pt-BR')
                            : "Não informada"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProposalListPage;