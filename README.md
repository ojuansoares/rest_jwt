# API com autenticação JWT

![Image](https://github.com/user-attachments/assets/7ef90b91-e832-48b8-aa14-b5e4ead01a8b)

Uma aplicação React + Flask moderna com sistema de autenticação

## 🚀 Tecnologias Utilizadas

### Frontend
- **React** - Biblioteca JavaScript para construção da interface
- **React Router** - Roteamento entre páginas
- **CSS3** - Estilização moderna com gradientes e animações
- **LocalStorage** - Armazenamento local para persistência de dados

### Backend
- **Flask** - Framework web em Python
- **Flask-CORS** - Liberação de requisições entre domínios (frontend → backend)
- **Flask-JWT-Extended** - Autenticação com JWT
- **Werkzeug Security** - Hash de senha seguro (PBKDF2 + SHA256)
- **os** - Variáveis de ambiente (chave secreta JWT)

## ✨ Funcionalidades

### Frontend
- **Tela de Login** - Interface moderna com validação de formulário
- **Home Page** - Dashboard personalizado com informações do usuário
- **Autenticação** - Sistema de login/logout com persistência
- **Design Responsivo** - Adaptável a diferentes tamanhos de tela

### Backend
- **Login de Usuário (`/api/login`)**  
  Recebe `username` e `password`, valida credenciais e retorna um **JWT válido**.  
  - Se o login for inválido → retorna erro 401  
  - Se válido → retorna `access_token`

- **Rota Protegida (`/api/profile`)**  
  Apenas acessível com **token válido** no cabeçalho da requisição.  
  Retorna os dados do usuário logado e mensagem de boas-vindas.

- **Segurança de Senhas**  
  Senhas armazenadas com **hash seguro** (`generate_password_hash`), nunca em texto puro.  
  Validação feita com `check_password_hash`.

## 📦 Como Executar

1. Clone o repositório
```bash
git clone https://github.com/ojuansoares/rest_jwt
cd rest_jwt
```

2. Instale as dependências do frontend

```bash
cd front
npm install
```

3. Execute o frontend

```bash
npm start
```

4. Acesse no navegador: `http://localhost:3000`

5. **Criar o arquivo `.env` com a chave JWT**

* Crie um arquivo chamado `.env` na raiz do backend (mesma pasta de `app.py`) com o conteúdo:

```
JWT_SECRET_KEY=uma_chave_super_secreta_aqui
```

6. Entre no ambiente virtual

```bash
(windows)
python -m venv .venv && .venv\Scripts\activate
```

```bash
(linux)
python3 -m venv .venv && source .venv/bin/activate
```

7. Execute o backend (Flask)

```bash
cd back
pip install -r requirements.txt
flask run
```

8. O backend ficará disponível em: `http://localhost:5000`

## 📌 Fluxo de Autenticação

1. Usuário envia `username` e `password` para `/api/login`.
2. Se válido, recebe um **JWT**.
3. Para acessar `/api/profile`, o token deve ser enviado no header:

   ```http
   Authorization: Bearer <token>
   ```
4. O backend valida o token e retorna os dados do usuário logado.
