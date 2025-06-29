import express from 'express';
import sqlite3Import from 'sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenha a API 'verbose' do sqlite3
const sqlite3 = sqlite3Import.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; //Porta 3001 é a default do servidor, porém pode ser alterada (alterar no arquivo vite.config)

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'database.db');

//BANCO DE DADOS
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        criarTabelas();
    }
});

// Função para criar tabelas quando o server for iniciado
function criarTabelas() {
    let sqlTableUsuario = `
      CREATE TABLE IF NOT EXISTS Usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        tipo_usuario TEXT NOT NULL
      )
    `;

    let sqlTableProposta = `CREATE TABLE IF NOT EXISTS Propostas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
      )
    `;
    let sqlTableFeedback = `
    CREATE TABLE IF NOT EXISTS Feedbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_proposta INTEGER,
      id_administrador INTEGER,
      texto_feedback TEXT NOT NULL,
      data_feedback DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_proposta) REFERENCES Propostas(id),
      FOREIGN KEY (id_administrador) REFERENCES Usuarios(id)
    )
  `;

    db.serialize(() => {
        db.run(sqlTableUsuario);
        db.run(sqlTableProposta);
        db.run(sqlTableFeedback);
    });
}

// --- ROTAS DA API EXPRESS ---
// Colocar os métodos aqui

app.post('/api/usuarios/cadastrar', (req, res) => {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
        return res.status(400).json({
            error: 'Email e senha são obrigatórios.',
        });
    }

    // Validação de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Email inválido.'
        });
    }

    // Validação de senha mínima
    if (senha.length < 6) {
        return res.status(400).json({
            error: 'A senha deve ter pelo menos 6 caracteres.'
        });
    }

    // Extrair nome do email (parte antes do @) e definir tipo padrão
    const nome = email.split('@')[0];
    const tipo_usuario = 'usuario'; // Tipo padrão

    // Inserir usuário no banco
    const sql = 'INSERT INTO Usuarios (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)';
    db.run(sql, [nome, email, senha, tipo_usuario], function (err) {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err.message);
            if (err.message.includes('UNIQUE constraint failed: Usuarios.email')) {
                return res.status(409).json({ 
                    error: 'Este email já está cadastrado.' 
                });
            }
            return res.status(500).json({ 
                error: 'Erro interno do servidor.' 
            });
        }
        
        // Retornar sucesso
        res.status(201).json({ 
            id: this.lastID, 
            nome, 
            email, 
            tipo_usuario,
            message: 'Usuário cadastrado com sucesso!' 
        });
    });
});

app.post('/api/usuarios/login', (req, res) => {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
        return res.status(400).json({
            error: 'Email e senha são obrigatórios.',
        });
    }
    // Buscar usuário no banco
    const sql = 'SELECT id, nome, email, tipo_usuario FROM Usuarios WHERE email = ? AND senha = ?';
    db.get(sql, [email.trim().toLowerCase(), senha], (err, row) => {
        if (err) {
            console.error('Erro ao fazer login:', err.message);
            return res.status(500).json({ 
                error: 'Erro interno do servidor.' 
            });
        }

        if (!row) {
            return res.status(401).json({ 
                error: 'Email ou senha incorretos.' 
            });
        }

        res.status(200).json({
            id: row.id,
            nome: row.nome,
            email: row.email,
            tipo_usuario: row.tipo_usuario,
            message: 'Login realizado com sucesso!'
        });
    });
});
app.post('/api/proposal/submit', (req, res) => {
    //const { id_usuario, titulo, descricao } = req.body
    const id_usuario = req.body.proposta.id_usuario
    const titulo = req.body.proposta.titulo
    const descricao = req.body.proposta.descricao
    if (!id_usuario || !titulo || !descricao) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
    }

    const sql = `
    INSERT INTO Propostas (id_usuario, titulo, descricao) 
    VALUES (?, ?, ?)
    `;
    db.run(sql, [id_usuario, titulo, descricao], function (err) {
    if (err) {
      console.error('Erro ao inserir proposta:', err.message);
      return res.status(500).json({ error: 'Erro ao inserir proposta.' });
    }

    res.status(201).json({
      id: this.lastID,
      id_usuario,
      titulo,
      descricao,
      data_envio: new Date().toISOString()
    });
  });

})

app.get('/api/proposal', (req, res) => {
    const sql = `
    SELECT p.id, p.titulo, p.descricao, p.data_envio, u.nome as autor
    FROM Propostas p
    LEFT JOIN Usuarios u ON p.id_usuario = u.id
    ORDER BY p.data_envio DESC
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar propostas:', err.message);
            return res.status(500).json({ error: 'Erro ao buscar propostas.' });
        }
        
        res.status(200).json(rows);
    });
});
//buscar propostas com filtros
app.get('/api/proposal/filter', (req, res) => {
    const  f = req.query.q || "";
    const filter = `%${f}%`;

    const sql = `
    SELECT p.id, p.titulo, p.descricao, p.data_envio, u.nome as autor
    FROM Propostas p
    LEFT JOIN Usuarios u ON p.id_usuario = u.id
    WHERE 
        p.titulo LIKE ? OR
        p.descricao LIKE ? OR
        u.nome LIKE ? 

    ORDER BY p.data_envio DESC
    `;
    
    const params = [filter, filter, filter];
    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Erro ao buscar propostas:', err.message);
            return res.status(500).json({ error: 'Erro ao buscar propostas.' });
        }
        
        res.status(200).json(rows);
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conexão com o banco de dados SQLite fechada.');
        process.exit(0);
    });
});

//EXEMPLO DOS METODOS
/*
app.post('/api/usuarios/cadastrar', (req, res) => {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({
            error: 'Todos os campos são obrigatórios (nome, email, senha, tipo).',
        });
    }

    const sql =
        'INSERT INTO Usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)';
    db.run(sql, [nome, email, senha, tipo], function (err) {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err.message);
            if (
                err.message.includes('UNIQUE constraint failed: Usuarios.email')
            ) {
                return res
                    .status(409)
                    .json({ error: 'Este email já está cadastrado.' });
            }
            return res
                .status(500)
                .json({ error: 'Erro ao cadastrar usuário. ' + err.message });
        }
        res.status(201).json({ id: this.lastID, nome, email, tipo });
    });
});

app.get('/api/propostas', (req, res) => {
    const sql = `
      SELECT p.id, p.titulo, p.descricao, p.area_interesse, p.data_envio, p.status, u.nome as autor_nome, u.email as autor_email
      FROM Propostas p
      LEFT JOIN Usuarios u ON p.id_usuario = u.id
      ORDER BY p.data_envio DESC
  `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar propostas:', err.message);
            return res
                .status(500)
                .json({ error: 'Erro ao buscar propostas. ' + err.message });
        }
        res.status(200).json(rows);
    });
});
 */
