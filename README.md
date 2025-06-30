# Certificadora-3

# Banco de Ideias - Meninas Digitais UTFPR-CP

##  Ferramentas Utilizadas

### Linguagens e Frameworks
| Ferramenta       | Versão | Link                          |
|------------------|--------|-------------------------------|
| Node.js          | 18.x   | [Download](https://nodejs.org/) |
| React            | 18.x   | [Documentação](https://reactjs.org/) |
| Express          | 4.x    | [Documentação](https://expressjs.com/) |

### Banco de Dados
| Ferramenta       | Versão | Link                          |
|------------------|--------|-------------------------------|
| SQLite           | 3.x    | [Documentação](https://www.sqlite.org/) |

### Bibliotecas Principais
| Biblioteca       | Versão | Uso                           |
|------------------|--------|-------------------------------|
| axios            | 1.x    | Chamadas HTTP                 |
| bcryptjs         | 2.x    | Criptografia de senhas        |
| cors             | 2.x    | Comunicação entre front/back  |

##  Como Executar

1. **Faça o download do repositório e das ferramentas usadas**
   - Clique em "Code" → "Download ZIP"
   - Clique no link [Node.js](https://nodejs.org/) e siga as instruções de instalação para o seu sistema operacional.
   - Clique no link [SQLite](https://www.sqlite.org/) e siga as instruções de instalação para o seu sistema operacional.

2. **Extraia o conteúdo**
   - Extraia o arquivo ZIP para uma pasta de sua preferência

3. **Abra o prompt de comando**
   - Windows: Pressione Win+R, digite "cmd" e Enter

4. **Navegue até a pasta do projeto**
   ```bash
   cd caminho/para/pasta/extraida

5. **Instale as dependências do backend**
   ```bash
   npm install

6. **Acesse a pasta do frontend**
   ```bash
   cd src

7. **Instale as dependências do frontend**
   ```bash
   npm install

8. **Execute o sistema em dois terminais separados**
   - Terminal 1 (Backend):
    ```bash
    cd src/db
    node server.js
    ```
   - Terminal 2 (Frontend):
    ```bash
    cd src
    npm run dev
   ```

9. **Acesse o sistema**
   - Acesse o sistema disponível em: http://localhost:5173

## Grupo 7  
Discentes: Gustavo, Leonardo, Paulo, Gabriel e Mateus.  

## Objetivo  
Facilitar o envio e gerenciamento de ideias para o projeto Meninas Digitais, permitindo que usuários cadastrem propostas e os usuários participantes do projeto possam
visualizar, gerenciar, e responder as propostas enviadas.

## Funcionalidades implementadas  
- Cadastro e login de usuários
- Submissão de propostas
- Deslogar

## Roteiro para teste

1. **Cadastre-se** com e-mail e senha.  
2. **Faça login** e acesse o menu de opções.  
3. **Tente enviar** uma proposta, entrando na opção: submter proposta.
