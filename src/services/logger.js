// Serviço para registrar ações no sistema
export const logAction = (action, userId) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Usuário ${userId} executou: ${action}`);
};
