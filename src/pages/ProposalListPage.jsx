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
  const [search, setSearch] = useState({ filter: '' });
  const [feedbacks, setFeedbacks] = useState({});

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
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!texto || !usuario?.id || usuario?.tipo_usuario !== 'administrador') {
      alert('Somente administradores podem enviar feedback. Verifique o texto e o login.');
      return;
    }

    try {
      await apiService.enviarFeedback(id, usuario.id, texto);
      alert('Feedback enviado!');
      setFeedbacks({ ...feedbacks, [id]: '' });
    } catch (error) {
      console.error('Erro ao enviar feedback:', error.message);
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
                      onClick={() => handleExcluirProposta(proposta.id)}
                      style={{ backgroundColor: 'red', color: 'white' }}
                    >
                      Excluir
                    </button>
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
