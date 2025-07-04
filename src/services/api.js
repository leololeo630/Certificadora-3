const API_BASE_URL = 'http://localhost:3001/api';

export const apiService = {
  // Cadastrar usuário (apenas email e senha)
  cadastrarUsuario: async (email, senha) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/cadastrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar usuário');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  login: async (email, senha) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  submitProposal: async (proposta) => {
    try {
      const response = await fetch(`${API_BASE_URL}/proposal/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ proposta }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  buscarPropostas: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/proposal`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar propostas');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  filtrarPropostas: async (filter) => {
    try {
      const query = encodeURIComponent(filter || "");
      const response = await fetch(`${API_BASE_URL}/proposal/filter?q=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar propostas');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  buscarFeedbacks: async (idProposta) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedbacks/${idProposta}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar feedbacks');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  },

  enviarFeedback: async (idProposta, idAdmin, texto_feedback) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedbacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idProposta,
          idAdmin,
          texto_feedback,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar feedback');
      }

      return data;
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      throw error;
    }
  },

  excluirProposta: async (idProposta) => {
    try {
      const response = await fetch(`${API_BASE_URL}/proposal/${idProposta}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir proposta');
      }

      return data;
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
      throw error;
    }
  }
};
