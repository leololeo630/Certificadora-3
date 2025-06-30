// src/pages/ProposalListPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { apiService } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ProposalListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [search, setSearch] = useState({ filter: '' });
  const [feedbacks, setFeedbacks] = useState({});
  const [showFeedbacks, setShowFeedbacks] = useState({});
  const [propostaFeedbacks, setPropostaFeedbacks] = useState({}); // Store feedbacks for each proposal

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
    try {
      const data = await apiService.filtrarPropostas(search.filter);
      setPropostas(data);
    } catch (error) {
      setErro(error.message || "Erro ao filtrar propostas");
    }
  };

  const handleEnviarFeedback = async (id) => {
    const texto = feedbacks[id];
    const usuario = user;

    console.log('Feedback text:', texto);
    console.log('User data:', usuario);
    console.log('User ID:', usuario?.id);
    console.log('User type:', usuario?.tipo_usuario);

    if (!texto) {
      alert('Erro: Texto do feedback não pode estar vazio.');
      return;
    }

    if (!usuario) {
      alert('Erro: Usuário não está logado. Faça login novamente.');
      return;
    }

    if (!usuario.id) {
      alert('Erro: ID do usuário não encontrado. Faça login novamente.');
      return;
    }

    if (usuario.tipo_usuario !== 'administrador') {
      alert(`Erro: Somente administradores podem enviar feedback. Seu tipo de usuário: ${usuario.tipo_usuario}`);
      return;
    }

    try {
      await apiService.enviarFeedback(id, usuario.id, texto);
      alert('Feedback enviado!');
      setFeedbacks({ ...feedbacks, [id]: '' });
      
      // Reload feedbacks for this proposal
      if (showFeedbacks[id]) {
        loadFeedbacks(id);
      }
    } catch (error) {
      console.error('Erro ao enviar feedback:', error.message);
      alert(`Erro ao enviar feedback: ${error.message}`);
    }
  };

  const handleExcluirProposta = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta proposta?")) return;

    try {
      await apiService.excluirProposta(id);
      const atualizadas = await apiService.buscarPropostas();
      setPropostas(atualizadas);
    } catch (error) {
      console.error('Erro ao excluir proposta:', error.message);
    }
  };

  const loadFeedbacks = async (propostaId) => {
    try {
      const feedbackData = await apiService.buscarFeedbacks(propostaId);
      setPropostaFeedbacks(prev => ({
        ...prev,
        [propostaId]: feedbackData
      }));
    } catch (error) {
      console.error('Erro ao carregar feedbacks:', error.message);
      setPropostaFeedbacks(prev => ({
        ...prev,
        [propostaId]: []
      }));
    }
  };

  const toggleFeedbacks = async (propostaId) => {
    const isCurrentlyShowing = showFeedbacks[propostaId];
    
    setShowFeedbacks(prev => ({
      ...prev,
      [propostaId]: !prev[propostaId]
    }));

    // Load feedbacks when showing for the first time
    if (!isCurrentlyShowing && !propostaFeedbacks[propostaId]) {
      await loadFeedbacks(propostaId);
    }
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
          onChange={(e) => setSearch({ filter: e.target.value })}
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

                  <textarea
                    placeholder="Escreva um feedback..."
                    rows="2"
                    value={feedbacks[proposta.id] || ''}
                    onChange={(e) =>
                      setFeedbacks({ ...feedbacks, [proposta.id]: e.target.value })
                    }
                    style={{ width: '100%', padding: '10px', marginTop: '10px' }}
                  />

                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <button onClick={() => handleEnviarFeedback(proposta.id)}>
                      Enviar Feedback
                    </button>
                    <button
                      onClick={() => toggleFeedbacks(proposta.id)}
                      style={{ backgroundColor: '#007bff', color: 'white' }}
                    >
                      {showFeedbacks[proposta.id] ? 'Ocultar Feedbacks' : 'Ver Feedbacks'}
                    </button>
                    <button
                      onClick={() => handleExcluirProposta(proposta.id)}
                      style={{ backgroundColor: 'red', color: 'white' }}
                    >
                      Excluir
                    </button>
                  </div>

                  {showFeedbacks[proposta.id] && (
                    <div style={{
                      marginTop: '15px',
                      padding: '15px',
                      backgroundColor: '#e9ecef',
                      borderRadius: '6px',
                      border: '1px solid #dee2e6'
                    }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Feedbacks:</h4>
                      {propostaFeedbacks[proposta.id] && propostaFeedbacks[proposta.id].length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {propostaFeedbacks[proposta.id].map((feedback, feedbackIndex) => (
                            <div 
                              key={feedback.id || feedbackIndex}
                              style={{
                                backgroundColor: 'white',
                                padding: '12px',
                                borderRadius: '4px',
                                border: '1px solid #d0d7de'
                              }}
                            >
                              <div style={{ 
                                fontSize: '12px', 
                                color: '#666', 
                                marginBottom: '5px',
                                display: 'flex',
                                justifyContent: 'space-between'
                              }}>
                                <span><strong>Por:</strong> {feedback.administrador || 'Admin'}</span>
                                <span>{new Date(feedback.data_feedback).toLocaleDateString('pt-BR')}</span>
                              </div>
                              <div style={{ color: '#333' }}>
                                {feedback.texto_feedback}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: '#6c757d', fontStyle: 'italic' }}>
                          Nenhum feedback ainda.
                        </div>
                      )}
                    </div>
                  )}
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