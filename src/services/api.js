// src/services/api.js
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

};