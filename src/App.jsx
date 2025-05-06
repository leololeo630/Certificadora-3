// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CadastroPage from "./pages/CadastroPage";
import Dashboard from "./pages/Dashboard";
import SubmitProposalPage from "./pages/SubmitProposalPage";
import ProposalListPage from "./pages/ProposalListPage"; // Importe a página de propostas

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submissao" element={<SubmitProposalPage />} />
        <Route path="/propostas" element={<ProposalListPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
